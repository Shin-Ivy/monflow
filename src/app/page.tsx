'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Smartphone, 
  Globe, 
  Sparkles, 
  Database, 
  Wallet, 
  CheckCircle2, 
  Lock, 
  BarChart3, 
  Moon, 
  Zap, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  PieChart, 
  Receipt,
  Download,
  Check,
  X
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-300 selection:bg-[#00838F] selection:text-white relative overflow-x-hidden font-sans">
      
      {/* ── AMBIENT GLOW BACKGROUND ─────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#00838F]/15 via-teal-500/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-[-150px] w-[500px] h-[500px] bg-[#EB7500]/10 blur-[130px] pointer-events-none -z-10" />

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-[#070B14]/75 border-b border-slate-200/80 dark:border-[#26354A]/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <Image
                src="/logo.png"
                alt="MonFlow Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight block leading-none">
                MonFlow
              </span>
              <span className="text-[10px] font-bold text-[#00838F] tracking-[1.5px] uppercase block mt-1">
                FINANCIAL HUB
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <a href="#fitur" className="hover:text-[#00838F] transition-colors">Fitur Unggulan</a>
            <a href="#arsitektur" className="hover:text-[#00838F] transition-colors">Offline-First</a>
            <a href="#komparasi" className="hover:text-[#00838F] transition-colors">Keunggulan</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-[#004D57] to-[#00838F] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-[#00838F]/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Buka Web App</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#00838F]">v1.0 Ready</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Local IndexedDB + Supabase Sync</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
            Kelola Finansial Mandiri <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] via-teal-400 to-[#EB7500]">
              Tanpa Batas Jaringan.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Workspace pembukuan finansial pribadi yang menggabungkan fleksibilitas offline instan, kecerdasan AI pemindai struk belanja, dan privasi penuh atas data kekayaan Anda.
          </p>

          {/* DUAL ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="/downloads/monflow-latest.apk"
              download
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00838F] hover:bg-[#00707A] text-white font-bold text-sm shadow-xl hover:shadow-[#00838F]/30 flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <Smartphone size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Download APK Android</span>
            </a>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-[#151F32] hover:bg-slate-50 dark:hover:bg-[#1E283F] border border-slate-200 dark:border-[#26354A] text-slate-900 dark:text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Globe size={18} className="text-[#00838F]" />
              <span>Jalankan Versi Web</span>
            </Link>
          </div>

          {/* Social Proof Tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500 shrink-0" /> Zero Network Latency
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500 shrink-0" /> Enkripsi Kunci PIN Lokal
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-500 shrink-0" /> Ekspor PDF Berskala Audit
            </span>
          </div>
        </div>

        {/* ── PRODUCT MOCKUP PREVIEW FRAME ────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="rounded-[28px] p-2 sm:p-3 bg-gradient-to-b from-slate-200 dark:from-[#26354A] to-slate-100 dark:to-[#070B14] shadow-2xl">
            <div className="rounded-[22px] bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-[#26354A] overflow-hidden">
              
              {/* Window Bar */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-[#151F32] border-b border-slate-200 dark:border-[#26354A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">app.monflow.local/dashboard</span>
                <div className="w-12" />
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#004D57] to-[#022F35] text-white space-y-3">
                  <div className="flex justify-between items-center text-teal-200 text-xs font-bold">
                    <span>TOTAL SALDO</span>
                    <Wallet size={16} />
                  </div>
                  <div className="text-2xl font-mono font-extrabold tracking-tight">Rp 39.900.000</div>
                  <p className="text-[10px] text-teal-300">2 Rekening Aktif Terhubung</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] space-y-3">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>PEMASUKAN BULAN INI</span>
                    <TrendingUp size={16} className="text-amber-500" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">Rp 15.400.000</div>
                  <p className="text-[10px] text-emerald-500 font-bold">+12% dibanding bulan lalu</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] space-y-3">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                    <span>LIMIT ANGGARAN</span>
                    <PieChart size={16} className="text-rose-500" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">32% Terpakai</div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="w-[32%] h-full bg-[#00838F] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FITUR UTAMA ─────────────────────────────────── */}
      <section id="fitur" className="py-24 bg-slate-50/80 dark:bg-[#0B1120]/60 border-y border-slate-200 dark:border-[#26354A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00838F]">Arsitektur Pintar</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Semua Kendali Finansial, Tanpa Kompromi
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Setiap sudut antarmuka MonFlow dirancang untuk kecepatan input maksimal dan keterbacaan data finansial yang jernih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Multi-Dompet (Besar - 2 Kolom) */}
            <div className="md:col-span-2 p-8 rounded-[30px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs flex flex-col justify-between hover:border-[#00838F]/50 transition-colors">
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-[#00838F] flex items-center justify-center">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Multi-Rekening & Transfer Internal Cepat
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kelola rekening bank konvensional, saldo kas tunai fisik, hingga dompet digital dalam satu layar terpadu. Mutasi pemindahan dana antar-pos langsung menyeimbangkan neraca seketika.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#26354A] flex items-center gap-3 text-xs font-bold text-[#00838F]">
                <span>Mendukung Format Ribuan Otomatis (Titik)</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: AI OCR Receipt */}
            <div className="p-8 rounded-[30px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs flex flex-col justify-between hover:border-[#EB7500]/50 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#EB7500] flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart AI Scanner</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Cukup potret struk atau seret gambar belanjaan Anda. Otomasi AI mengekstrak nominal, toko, dan kategori mutasi tanpa perlu mengetik ulang.
                </p>
              </div>
              <span className="mt-6 inline-block text-[11px] font-mono font-bold text-amber-500">
                Didukung Gemini AI Vision
              </span>
            </div>

            {/* Card 3: Dual Mode */}
            <div className="p-8 rounded-[30px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Moon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deep Obsidian & Clean Light</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tampilan gelap ramah mata dengan kontras OLED sejati dan mode terang bebas silau. Kontras tipografi dirancang agar nominal mata uang selalu tajam terbaca.
              </p>
            </div>

            {/* Card 4: PIN Security */}
            <div className="p-8 rounded-[30px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">App Lock PIN 6-Digit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kunci otomatis melindungi privasi saat aplikasi ditinggalkan. Workspace browser aman dari tatapan orang lain tanpa perlu sign out berulang kali.
              </p>
            </div>

            {/* Card 5: Formal PDF Export */}
            <div className="p-8 rounded-[30px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] shadow-xs space-y-4 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-[#00838F] flex items-center justify-center">
                <Database size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ekspor PDF & JSON Instan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hasilkan lembar laporan keuangan resmi bertanda tangan otomatis untuk keperluan audit, atau buat file cadangan JSON lokal hanya dengan satu klik.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── TABEL KOMPARASI KEUNGGULAN ──────────────────────────────── */}
      <section id="komparasi" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Mengapa Memilih MonFlow?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Perbandingan transparansi dengan aplikasi pembukuan konvensional.
            </p>
          </div>

          <div className="rounded-[26px] bg-white dark:bg-[#151F32] border border-slate-200 dark:border-[#26354A] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#0B1120] border-b border-slate-200 dark:border-[#26354A] text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-6">Fitur & Parameter</th>
                  <th className="py-4 px-6 text-[#00838F]">MonFlow Hub</th>
                  <th className="py-4 px-6 text-slate-400">Aplikasi Konvensional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#26354A]/60">
                <tr>
                  <td className="py-4 px-6 font-semibold">Akses Tanpa Internet (Offline-First)</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check size={16} /> 100% Berfungsi Penuh
                  </td>
                  <td className="py-4 px-6 text-slate-400 flex items-center gap-1.5">
                    <X size={16} className="text-rose-400" /> Terkunci / Harus Online
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Kepemilikan Data Pengguna</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check size={16} /> Lokal di Perangkat
                  </td>
                  <td className="py-4 px-6 text-slate-400">Di Server Pihak Ketiga</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Iklan & Biaya Langganan</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check size={16} /> 100% Gratis & Bersih Iklan
                  </td>
                  <td className="py-4 px-6 text-slate-400">Iklan Banner / Berbayar Bulanan</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Multi-Platform Sinkronisasi</td>
                  <td className="py-4 px-6 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check size={16} /> Web + APK Android
                  </td>
                  <td className="py-4 px-6 text-slate-400">Terbatas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER FINAL ────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-gradient-to-br from-[#004D57] via-[#003B42] to-[#02252A] p-8 sm:p-14 text-white border border-[#00838F]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Mulai Kelola Finansial Anda Hari Ini
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/80 max-w-md">
                Bebas registrasi rumit. Buka langsung di browser atau pasang file APK Android ke ponsel Anda sekarang.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href="/downloads/monflow-latest.apk"
                download
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#00838F] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download size={15} />
                <span>Unduh APK</span>
              </a>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Buka Web App</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-slate-200 dark:border-[#26354A] bg-white dark:bg-[#070B14] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">MonFlow</span>
            <span>•</span>
            <span>Local-First Financial Hub © 2026. Semua Hak Dilindungi.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="/downloads/monflow-latest.apk" download className="hover:text-[#00838F] transition-colors">
              Download APK
            </a>
            <Link href="/dashboard" className="hover:text-[#00838F] transition-colors">
              Web App
            </Link>
            <Link href="/settings" className="hover:text-[#00838F] transition-colors">
              Pengaturan & PIN
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}