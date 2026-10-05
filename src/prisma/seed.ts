import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import * as fs from 'fs';
import * as path from 'path';

// Inisialisasi adapter PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Pass adapter ke dalam opsi PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Memulai seeding dari file SQL mentah...\n');

  const sqlPath = path.join('src/prisma/data', 'wilayah.sql');

  if (!fs.existsSync(sqlPath)) {
    throw new Error(`File SQL tidak ditemukan di path: ${sqlPath}`);
  }

  console.log(`Membaca file SQL: ${sqlPath}`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  if (!sqlContent.trim()) {
    console.warn('File SQL kosong, tidak ada query yang dieksekusi.');
    return;
  }

  console.log('Mengirim query SQL ke PostgreSQL...');
  const startTime = Date.now();

  await prisma.$executeRawUnsafe(sqlContent);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nSeeding berhasil diselesaikan dalam ${duration} detik!`);
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan saat mengeksekusi file SQL:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
