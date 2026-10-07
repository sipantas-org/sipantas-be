import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { AdminRole, AdminStatus } from '../generated/prisma/enums.js';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// Inisialisasi adapter PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Pass adapter ke dalam opsi PrismaClient
const prisma = new PrismaClient({ adapter });

const ROOT_ADMIN = {
  nip: '11111111',
  nama: 'Administrator',
  nomorHp: '081000000000',
  email: 'administrator.sipantas@gmail.com',
  password: 'password.sipantas123',
};

async function seedRootAdmin() {
  await prisma.userAdmin.upsert({
    where: { Email: ROOT_ADMIN.email },
    update: {},
    create: {
      NIP: ROOT_ADMIN.nip,
      Nama: ROOT_ADMIN.nama,
      Nomor_HP: ROOT_ADMIN.nomorHp,
      Email: ROOT_ADMIN.email,
      Password: await bcrypt.hash(ROOT_ADMIN.password, 10),
      Status: AdminStatus.Active,
      Role: AdminRole.Administrator,
    },
  });
  console.log(`Root admin siap: ${ROOT_ADMIN.email}`);
}

async function main() {
  await seedRootAdmin();

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
