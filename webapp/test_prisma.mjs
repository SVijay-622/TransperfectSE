import { createRequire } from 'module';
const require = createRequire(import.meta.url);

process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:51218/template1?sslmode=disable';
const {PrismaClient} = require('@prisma/client');
const {PrismaPg} = require('@prisma/adapter-pg');
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

try {
  const r = await prisma.ticket.create({
    data: {
      externalId: 'TEST-VERIFY-001',
      title: 'Connection Test',
      status: 'Open',
      priority: 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  console.log('SUCCESS - ticket created with id:', r.id);
  // Cleanup
  await prisma.ticket.delete({ where: { id: r.id } });
  console.log('Cleanup done');
} catch(e) {
  const fs = require('fs');
  fs.writeFileSync('test_error.txt', JSON.stringify({ message: e.message, code: e.code, meta: e.meta }, null, 2));
  console.log('FAILED - check test_error.txt');
  console.log('code:', e.code);
}
await prisma.$disconnect();
