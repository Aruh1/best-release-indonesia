import React from "react";
import Header from "@/components/Header";
import { Card, CardBody } from "@nextui-org/react";

const FaqPage = () => {
    const faqItems = [
        {
            title: "Apa itu Best Release Indonesia?",
            content:
                "Best Release Indonesia adalah platform yang menghadirkan informasi terbaru tentang rilis anime di Indonesia. Kami membantu penggemar anime tetap terhubung dengan rilisan anime terbaik yang tersedia di tanah air."
        },
        {
            title: "Seberapa sering konten diperbarui?",
            content:
                "Informasi tentang rilis anime diperbarui secara berkala agar kamu selalu mendapatkan kabar terbaru mengenai dunia anime di Indonesia."
        },
        {
            title: "Apakah layanan ini gratis?",
            content:
                "Tentu saja! Best Release Indonesia sepenuhnya gratis. Kami berkomitmen untuk menyediakan informasi anime yang mudah diakses oleh semua penggemar di Indonesia."
        },
        {
            title: "Bagaimana cara saya berkontribusi?",
            content:
                "Kamu dapat berkontribusi melalui repositori GitHub kami. Kami dengan senang hati menerima saran, laporan bug, dan *pull request* untuk pengembangan platform ini."
        },
        {
            title: "Apa teknologi yang digunakan untuk website ini?",
            content:
                "Website ini dibangun menggunakan React, Next.js, dan NextUI. Untuk API, kami menggunakan Jikan API (Unofficial MyAnimeList) untuk mengambil data seperti judul asli, judul dalam bahasa Inggris, dan poster anime."
        },
        {
            title: "Bagaimana cara menentukan rilisan 'terbaik'?",
            content:
                "Kami mengevaluasi berbagai aspek seperti kualitas video, audio, akurasi terjemahan, dan nilai produksi secara keseluruhan untuk menentukan rilisan terbaik dari setiap judul anime."
        },
        {
            title: "Apakah aku bisa memasukkan garapanku ke dalam rilisan terbaik?",
            content:
                "Kamu dapat bergabung dengan peladen Discord kami melalui ikon di bagian kanan atas. Silakan *mention* Pololer atau Karuizawa Kei agar garapanmu dapat dipertimbangkan."
        },
        {
            title: "Bagaimana aku mengetahui file tersebut Batch, Part, OVA, dll?",
            content:
                "Kami mencantumkan informasi tersebut di bagian deskripsi rilisan. Jika kamu tidak menemukan informasi tersebut, silakan bergabung dengan peladen Discord kami dan bertanya langsung kepada anggota lain."
        },
        {
            title: "Apa arti warna pada status rilisan?",
            content:
                'Warna pada status rilisan menunjukkan tingkat kualitas rilisan. Kuning menunjukkan rilisan tersebut belum di-mux (mungkin Anda?), dan merah menunjukkan rilisan yang tidak direkomendasikan atau "Bad" Encode.'
        }
    ];

    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Pertanyaan yang Sering Diajukan</h1>
                    {faqItems.map((item, index) => (
                        <Card key={index} className="mb-4">
                            <CardBody>
                                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                                <p className="text-default-600">{item.content}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>
        </>
    );
};

export default FaqPage;
