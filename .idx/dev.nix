{pkgs}: {
  channel = "stable-24.11";
  packages = [
    pkgs.nodejs_22
    pkgs.python312Full
  ];
  idx.extensions = [
  "eamodio.gitlens"
  "esbenp.prettier-vscode"
  "gengjiawen.vscode-npm-dependency"
  "GitHub.vscode-pull-request-github"
  "ms-python.debugpy"
  "ms-python.python"
  "usernamehw.errorlens"
 ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}