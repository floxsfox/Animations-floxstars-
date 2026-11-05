# Floxstars – Remotion Text Animation

Animasi teks 1920x1080, 30fps, 7 detik. Render MP4 otomatis oleh GitHub Actions.

## Cara pakai (lewat web GitHub)
1. Buat repo baru di github.com (public/private bebas).
2. Add file → Create new file. Ketik nama dengan path lengkap (mis. `src/Floxstars.tsx`, `.github/workflows/render.yml`), tempel isinya, Commit. Ulangi untuk semua file.
3. Setelah commit ke branch `main`, tab **Actions** otomatis menjalankan "Render Floxstars MP4" (atau klik Run workflow).
4. Selesai (±2-5 menit): ambil MP4 di tab **Releases** (langsung .mp4) atau di bagian Artifacts pada run tersebut.

## Preview lokal (opsional)
npm install && npm run dev
