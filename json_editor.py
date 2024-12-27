import json
import subprocess
from typing import Dict, List, Optional
from PyQt5.QtWidgets import (
    QMainWindow, QFileDialog, QMessageBox, QTableWidget,
    QTableWidgetItem, QPushButton, QVBoxLayout, QHBoxLayout, QWidget,
    QDialog, QLabel, QLineEdit, QGridLayout, QHeaderView, QStyle,
    QListWidget, QDialogButtonBox
)
from PyQt5.QtCore import Qt, QSize

class ReleaseEditDialog(QDialog):
    def __init__(self, releases: List[Dict], parent=None):
        super().__init__(parent)
        self.releases = releases.copy() if releases else []
        self.setup_ui()

    def setup_ui(self):
        self.setWindowTitle('Edit Releases')
        layout = QVBoxLayout(self)

        # List widget to show releases
        self.list_widget = QListWidget()
        self.update_list()
        layout.addWidget(self.list_widget)

        # Buttons
        button_layout = QHBoxLayout()
        self.add_button = QPushButton('Add Release')
        self.edit_button = QPushButton('Edit Release')
        self.delete_button = QPushButton('Delete Release')
        
        self.add_button.clicked.connect(self.add_release)
        self.edit_button.clicked.connect(self.edit_release)
        self.delete_button.clicked.connect(self.delete_release)
        
        button_layout.addWidget(self.add_button)
        button_layout.addWidget(self.edit_button)
        button_layout.addWidget(self.delete_button)
        layout.addLayout(button_layout)

        # Dialog buttons
        buttons = QDialogButtonBox(
            QDialogButtonBox.Ok | QDialogButtonBox.Cancel,
            Qt.Horizontal, self
        )
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons)

    def update_list(self):
        self.list_widget.clear()
        for release in self.releases:
            item_text = f"{release.get('name', '')}"
            if 'downloadLinks' in release:
                item_text += f" ({len(release['downloadLinks'])} links)"
            self.list_widget.addItem(item_text)

    def add_release(self):
        dialog = SingleReleaseDialog(None, self)
        if dialog.exec_():
            self.releases.append(dialog.get_data())
            self.update_list()

    def edit_release(self):
        current_row = self.list_widget.currentRow()
        if current_row >= 0:
            dialog = SingleReleaseDialog(self.releases[current_row], self)
            if dialog.exec_():
                self.releases[current_row] = dialog.get_data()
                self.update_list()

    def delete_release(self):
        current_row = self.list_widget.currentRow()
        if current_row >= 0:
            reply = QMessageBox.question(
                self, 'Confirm Deletion',
                'Are you sure you want to delete this release?',
                QMessageBox.Yes | QMessageBox.No
            )
            if reply == QMessageBox.Yes:
                self.releases.pop(current_row)
                self.update_list()

    def get_releases(self) -> List[Dict]:
        return self.releases

class SingleReleaseDialog(QDialog):
    def __init__(self, release: Optional[Dict], parent=None):
        super().__init__(parent)
        self.release = release or {}
        self.setup_ui()

    def setup_ui(self):
        self.setWindowTitle('Edit Release Details')
        layout = QGridLayout(self)

        # Name field
        layout.addWidget(QLabel('Name:'), 0, 0)
        self.name_edit = QLineEdit(self.release.get('name', ''))
        layout.addWidget(self.name_edit, 0, 1)

        # Description field
        layout.addWidget(QLabel('Description:'), 1, 0)
        self.description_edit = QLineEdit(self.release.get('description', ''))
        layout.addWidget(self.description_edit, 1, 1)

        # Download Links
        layout.addWidget(QLabel('Download Links:'), 2, 0)
        self.links_edit = QLineEdit()
        current_links = self.release.get('downloadLinks', [])
        self.links_edit.setText('\n'.join(current_links))
        layout.addWidget(self.links_edit, 2, 1)
        layout.addWidget(QLabel('(One link per line)'), 3, 1)

        # Dialog buttons
        buttons = QDialogButtonBox(
            QDialogButtonBox.Ok | QDialogButtonBox.Cancel,
            Qt.Horizontal, self
        )
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        layout.addWidget(buttons, 4, 0, 1, 2)

    def get_data(self) -> Dict:
        links = [link.strip() for link in self.links_edit.text().split('\n') if link.strip()]
        data = {
            'name': self.name_edit.text().strip()
        }
        if self.description_edit.text().strip():
            data['description'] = self.description_edit.text().strip()
        if links:
            data['downloadLinks'] = links
        return data

class AnimeEditorPyQt(QMainWindow):
    def __init__(self):
        super().__init__()
        self.json_data: List[Dict] = []
        self.file_path: Optional[str] = None
        self.unsaved_changes: bool = False
        self.initUI()

    def initUI(self):
        self.setWindowTitle('Anime JSON Editor')
        self.setMinimumSize(1200, 800)

        # Main widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Status bar
        self.statusBar().showMessage('No file loaded')

        # Table
        self.table = QTableWidget()
        self.table.setAlternatingRowColors(True)
        self.table.setSelectionBehavior(QTableWidget.SelectRows)
        self.table.setSelectionMode(QTableWidget.SingleSelection)
        layout.addWidget(self.table)

        # Buttons
        button_layout = QHBoxLayout()
        
        buttons = [
            ('Open JSON', self.open_json, 'SP_DialogOpenButton'),
            ('Save JSON', self.save_json, 'SP_DialogSaveButton'),
            ('Edit Entry', self.edit_entry, 'SP_FileIcon'),
            ('Edit Best Releases', self.edit_best_releases, 'SP_FileDialogDetailedView'),
            ('Edit Alternatives', self.edit_alternatives, 'SP_FileDialogListView'),
            ('Add Entry', self.add_entry, 'SP_FileDialogNewFolder'),
            ('Delete Entry', self.delete_entry, 'SP_DialogDiscardButton'),
            ('Sort Data', self.sort_data, 'SP_ArrowDown'),
            ('Format JSON', self.format_json, 'SP_FileDialogDetailedView')
        ]
        
        for text, slot, icon in buttons:
            button = QPushButton(text)
            button.clicked.connect(slot)
            button.setIcon(self.style().standardIcon(getattr(QStyle, icon)))
            button.setIconSize(QSize(20, 20))
            button_layout.addWidget(button)

        layout.addLayout(button_layout)

    def open_json(self):
        if self.unsaved_changes:
            reply = QMessageBox.question(
                self, 'Unsaved Changes',
                'Do you want to save changes before opening a new file?',
                QMessageBox.Save | QMessageBox.Discard | QMessageBox.Cancel
            )
            if reply == QMessageBox.Save:
                self.save_json()
            elif reply == QMessageBox.Cancel:
                return

        file_path, _ = QFileDialog.getOpenFileName(
            self, 'Open JSON File', '',
            'JSON files (*.json);;All files (*.*)'
        )
        if not file_path:
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.json_data = json.load(file)
            self.file_path = file_path
            self.populate_table()
            self.unsaved_changes = False
            self.statusBar().showMessage(f'Loaded: {file_path}')
        except Exception as e:
            QMessageBox.critical(self, 'Error', f'Failed to open file: {str(e)}')

    def populate_table(self):
        headers = ['MAL ID', 'Title', 'Best Releases', 'Best Alternatives', 'Notes', 'Quality Comparisons']
        self.table.setColumnCount(len(headers))
        self.table.setHorizontalHeaderLabels(headers)
        self.table.setRowCount(len(self.json_data))

        for row, anime in enumerate(self.json_data):
            # MAL ID
            self.table.setItem(row, 0, QTableWidgetItem(str(anime.get('malId', ''))))
            
            # Title
            self.table.setItem(row, 1, QTableWidgetItem(anime.get('title', '')))
            
            # Best Releases
            releases = anime.get('bestReleases', [])
            releases_text = ', '.join(r.get('name', '') for r in releases)
            self.table.setItem(row, 2, QTableWidgetItem(releases_text))
            
            # Best Alternatives
            alternatives = anime.get('bestAlternatives', [])
            alt_text = ', '.join(f"{a.get('name', '')} ({a.get('description', '')})" 
                                for a in alternatives)
            self.table.setItem(row, 3, QTableWidgetItem(alt_text))
            
            # Notes
            self.table.setItem(row, 4, QTableWidgetItem(anime.get('notes', '')))
            
            # Quality Comparisons
            self.table.setItem(row, 5, QTableWidgetItem(anime.get('qualityComparisons', '')))

        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeToContents)
        self.table.horizontalHeader().setStretchLastSection(True)

    def save_json(self):
        if not self.file_path:
            self.file_path, _ = QFileDialog.getSaveFileName(
                self, 'Save JSON File', '',
                'JSON files (*.json);;All files (*.*)'
            )
            if not self.file_path:
                return

        try:
            with open(self.file_path, 'w', encoding='utf-8') as file:
                json.dump(self.json_data, file, indent=4, ensure_ascii=False)
            self.unsaved_changes = False
            self.statusBar().showMessage(f'Saved: {self.file_path}')
        except Exception as e:
            QMessageBox.critical(self, 'Error', f'Failed to save file: {str(e)}')

    def edit_entry(self):
        current_row = self.table.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, 'Warning', 'Please select an entry to edit')
            return

        anime = self.json_data[current_row]
        dialog = QDialog(self)
        dialog.setWindowTitle('Edit Anime Entry')
        layout = QGridLayout(dialog)

        # Create form fields
        fields = {}
        for row, (label, key, value) in enumerate([
            ('MAL ID:', 'malId', str(anime.get('malId', ''))),
            ('Title:', 'title', anime.get('title', '')),
            ('Notes:', 'notes', anime.get('notes', '')),
            ('Quality Comparisons:', 'qualityComparisons', anime.get('qualityComparisons', ''))
        ]):
            layout.addWidget(QLabel(label), row, 0)
            field = QLineEdit(value)
            layout.addWidget(field, row, 1)
            fields[key] = field

        # Add OK/Cancel buttons
        buttons = QDialogButtonBox(
            QDialogButtonBox.Ok | QDialogButtonBox.Cancel,
            Qt.Horizontal, dialog
        )
        buttons.accepted.connect(dialog.accept)
        buttons.rejected.connect(dialog.reject)
        layout.addWidget(buttons, len(fields), 0, 1, 2)

        if dialog.exec_():
            try:
                mal_id = int(fields['malId'].text())
                updated_data = {
                    'malId': mal_id,
                    'title': fields['title'].text().strip()
                }
                if fields['notes'].text().strip():
                    updated_data['notes'] = fields['notes'].text().strip()
                if fields['qualityComparisons'].text().strip():
                    updated_data['qualityComparisons'] = fields['qualityComparisons'].text().strip()
                
                self.json_data[current_row].update(updated_data)
                self.populate_table()
                self.unsaved_changes = True
                self.statusBar().showMessage('Unsaved changes')
            except ValueError:
                QMessageBox.critical(self, 'Error', 'MAL ID must be a number')

    def edit_best_releases(self):
        current_row = self.table.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, 'Warning', 'Please select an entry to edit')
            return

        releases = self.json_data[current_row].get('bestReleases', [])
        dialog = ReleaseEditDialog(releases, self)
        if dialog.exec_():
            self.json_data[current_row]['bestReleases'] = dialog.get_releases()
            self.populate_table()
            self.unsaved_changes = True
            self.statusBar().showMessage('Unsaved changes')

    def edit_alternatives(self):
        current_row = self.table.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, 'Warning', 'Please select an entry to edit')
            return

        alternatives = self.json_data[current_row].get('bestAlternatives', [])
        dialog = ReleaseEditDialog(alternatives, self)
        if dialog.exec_():
            self.json_data[current_row]['bestAlternatives'] = dialog.get_releases()
            self.populate_table()
            self.unsaved_changes = True
            self.statusBar().showMessage('Unsaved changes')

    def add_entry(self):
        new_entry = {
            'malId': 0,
            'title': ''
        }
        self.json_data.append(new_entry)
        self.populate_table()
        self.table.selectRow(len(self.json_data) - 1)
        self.edit_entry()
        self.unsaved_changes = True

    def delete_entry(self):
        current_row = self.table.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, 'Warning', 'Please select an entry to delete')
            return

        reply = QMessageBox.question(
            self, 'Confirm Deletion',
            'Are you sure you want to delete this entry?',
            QMessageBox.Yes | QMessageBox.No
        )
        if reply == QMessageBox.Yes:
            self.json_data.pop(current_row)
            self.populate_table()
            self.unsaved_changes = True
            self.statusBar().showMessage('Unsaved changes')

    def sort_data(self):
        self.json_data.sort(key=lambda x: x['title'])
        self.populate_table()
        self.unsaved_changes = True
        self.statusBar().showMessage('Data sorted')

    def format_json(self):
        if not self.file_path:
            QMessageBox.warning(self, 'Warning', 'No file loaded to format')
            return

        try:
            subprocess.run(['npx', 'prettier', '--write', self.file_path], check=True)
            self.statusBar().showMessage('JSON formatted with Prettier')
        except subprocess.CalledProcessError as e:
            QMessageBox.critical(self, 'Error', f'Failed to format JSON: {str(e)}')

if __name__ == '__main__':
    from PyQt5.QtWidgets import QApplication
    import sys
    
    app = QApplication(sys.argv)
    editor = AnimeEditorPyQt()
    editor.show()
    sys.exit(app.exec_())