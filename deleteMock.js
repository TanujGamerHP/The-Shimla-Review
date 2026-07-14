const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Deleting mock data...");
  try { await prisma.book.delete({ where: { slug: 'echoes-of-the-himalayas' } }); console.log("Deleted mock book 1"); } catch(e){}
  try { await prisma.book.delete({ where: { slug: 'modern-translation-theories' } }); console.log("Deleted mock book 2"); } catch(e){}
  try { await prisma.poem.delete({ where: { slug: 'winter-in-the-valley' } }); console.log("Deleted mock poem"); } catch(e){}
  try { await prisma.researchPaper.delete({ where: { slug: 'sociological-impact-machine-translation' } }); console.log("Deleted mock paper"); } catch(e){}
  console.log("Mock data permanently deleted from Postgres!");
}

main().finally(() => prisma.$disconnect());
