const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient(); // uses process.env.DATABASE_URL
const db = new sqlite3.Database('prisma/dev.db');

async function migrate() {
  const admin = await prisma.user.findFirst();
  if (!admin) {
    console.error("No user found in Postgres. Cannot migrate.");
    process.exit(1);
  }

  db.all("SELECT * FROM ResearchPaper", async (err, papers) => {
    if (err) throw err;
    console.log(`Migrating ${papers.length} Research Papers...`);
    for (const paper of papers) {
      try {
        await prisma.researchPaper.upsert({
          where: { slug: paper.slug },
          update: {},
          create: {
            title: paper.title,
            abstract: paper.abstract,
            slug: paper.slug,
            doi: paper.doi,
            coverImageUrl: paper.coverImageUrl,
            downloadUrl: paper.downloadUrl,
            previewUrl: paper.previewUrl,
            views: paper.views,
            status: paper.status,
            createdAt: new Date(paper.createdAt),
            updatedAt: new Date(paper.updatedAt),
            authorId: admin.id
          }
        });
      } catch (e) {
        console.error(`Failed to migrate paper ${paper.slug}:`, e.message);
      }
    }
    console.log("Done with Research Papers.");
  });

  db.all("SELECT * FROM Book", async (err, books) => {
    if (err) throw err;
    console.log(`Migrating ${books.length} Books...`);
    for (const book of books) {
      try {
        await prisma.book.upsert({
          where: { slug: book.slug },
          update: {},
          create: {
            title: book.title,
            synopsis: book.synopsis,
            slug: book.slug,
            coverImageUrl: book.coverImageUrl,
            publisher: book.publisher,
            publicationDate: book.publicationDate ? new Date(book.publicationDate) : null,
            isbn: book.isbn,
            readingLevel: book.readingLevel,
            purchaseUrl: book.purchaseUrl,
            downloadUrl: book.downloadUrl,
            price: book.price,
            views: book.views,
            status: book.status,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt),
            authorId: admin.id
          }
        });
      } catch (e) {
        console.error(`Failed to migrate book ${book.slug}:`, e.message);
      }
    }
    console.log("Done with Books.");
  });
}

migrate();
