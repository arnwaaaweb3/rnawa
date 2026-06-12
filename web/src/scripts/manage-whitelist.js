import fs from 'fs';
import path from 'path';

// 1. Ambil argumen tindakan (add/remove) dan nama repo dari terminal
const [action, repoInput] = process.argv.slice(2);

if (!action || !repoInput) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: Argumen kurang lengkap!');
  console.log('\n💡 Cara Penggunaan di Terminal:');
  console.log('   npm run repo:add owner/nama-repo');
  console.log('   npm run repo:remove owner/nama-repo\n');
  process.exit(1);
}

// 2. Daftar file route API yang wajib di-update otomatis
const targetFiles = [
  'src/app/api/github/tree/route.ts',
  'src/app/api/github/content/route.ts',
  'src/app/api/github/commits/route.ts'
];

const normalizedRepo = repoInput.trim();

console.log(`\x1b[36m%s\x1b[0m`, `🤖 Memulai proses otomasi whitelist... [Aksi: ${action.toUpperCase()}]`);

targetFiles.forEach((filePath) => {
  const fullPath = path.resolve(filePath);
  
  // Cek apakah file target beneran ada
  if (!fs.existsSync(fullPath)) {
    console.warn('\x1b[33m%s\x1b[0m', `⚠️ File dilewati (tidak ditemukan): ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Regex untuk mendeteksi block array ALLOWED_REPOSITORIES
  const blockRegex = /const ALLOWED_REPOSITORIES = \[\s*([\s\S]*?)\s*\];/;
  const match = content.match(blockRegex);
  
  if (!match) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Gagal menemukan struktur ALLOWED_REPOSITORIES di: ${filePath}`);
    return;
  }
  
  // Ekstrak repo yang sudah terdaftar saat ini
  const innerContent = match[1];
  const repoRegex = /'([^']+)'/g;
  let currentRepos = [];
  let repoMatch;
  
  while ((repoMatch = repoRegex.exec(innerContent)) !== null) {
    currentRepos.push(repoMatch[1]);
  }
  
  let updatedRepos = [...currentRepos];
  
  // LOGIKA TAMBAH REPO
  if (action === 'add') {
    const exists = currentRepos.some(r => r.toLowerCase() === normalizedRepo.toLowerCase());
    if (!exists) {
      updatedRepos.push(normalizedRepo);
    } else {
      console.log(`ℹ️ Repo '${normalizedRepo}' sudah terdaftar sebelumnya di ${filePath}`);
      return;
    }
  } 
  // LOGIKA HAPUS REPO
  else if (action === 'remove' || action === 'delete') {
    const exists = currentRepos.some(r => r.toLowerCase() === normalizedRepo.toLowerCase());
    if (exists) {
      updatedRepos = currentRepos.filter(r => r.toLowerCase() !== normalizedRepo.toLowerCase());
    } else {
      console.log(`ℹ️ Repo '${normalizedRepo}' memang tidak ada di list ${filePath}`);
      return;
    }
  } 
  // Jika command typo atau ngaco
  else {
    console.error('\x1b[31m%s\x1b[0m', `❌ Aksi '${action}' tidak valid! Gunakan perintah 'add' atau 'remove'.`);
    process.exit(1);
  }
  
  // 3. Susun ulang baris kodenya dengan rapi (Indentasi 2 spasi + trailing comma standar industri)
  const formattedItems = updatedRepos.map(repo => `  '${repo}',`).join('\n');
  const newBlock = `const ALLOWED_REPOSITORIES = [\n${formattedItems}\n];`;
  
  // Replace block lama dengan block baru tanpa menyentuh sisa fungsi kode lainnya
  const newContent = content.replace(blockRegex, newBlock);
  fs.writeFileSync(fullPath, newContent, 'utf8');
  
  console.log('\x1b[32m%s\x1b[0m', `✅ Sukses memperbarui: ${filePath}`);
});

console.log(`\x1b[32m%s\x1b[0m`, `🎉 Semua file sinkron! Repository aman diproses.`);