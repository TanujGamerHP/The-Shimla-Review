const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Phase 3 content...')
  
  // Find author
  let author = await prisma.user.findFirst({ where: { role: 'AUTHOR' } })
  if (!author) {
    author = await prisma.user.create({
      data: {
        email: 'sandeep@example.com',
        name: 'Sandeep Sharma',
        role: 'AUTHOR',
        bio: 'Author and Researcher',
      }
    })
  }

  // Create Books
  await prisma.book.create({
    data: {
      title: 'Echoes of the Himalayas',
      synopsis: 'A profound exploration of the culture, myths, and unspoken stories residing deep within the Himalayan ranges. This book travels through time and space to bring you the essence of the mountains.',
      slug: 'echoes-of-the-himalayas',
      coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      publisher: 'Shimla Press',
      publicationDate: new Date('2025-01-15'),
      authorId: author.id,
      status: 'PUBLISHED',
      views: 1245
    }
  })

  await prisma.book.create({
    data: {
      title: 'Modern Translation Theories',
      synopsis: 'An academic textbook covering the evolution of translation theories from the 20th century to the digital age, focusing on sociolinguistics.',
      slug: 'modern-translation-theories',
      coverImageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
      publisher: 'Oxford University Press',
      publicationDate: new Date('2024-08-20'),
      authorId: author.id,
      status: 'PUBLISHED',
      views: 4321
    }
  })

  // Create Poetry
  await prisma.poem.create({
    data: {
      title: 'Winter in the Valley',
      content: 'The snow falls softly on the pine,\nA silent world, a frozen shrine.\nThe river sleeps beneath the ice,\nA momentary paradise.\n\nThe wind it whispers ancient tales,\nThrough empty streets and forgotten vales.\nAnd in this quiet, peaceful night,\nThe stars provide the only light.',
      slug: 'winter-in-the-valley',
      language: 'English',
      authorId: author.id,
      status: 'PUBLISHED',
      views: 890
    }
  })

  // Create Research Papers
  await prisma.researchPaper.create({
    data: {
      title: 'The Sociological Impact of Machine Translation on Indigenous Languages',
      abstract: 'This paper examines how the rapid advancement of neural machine translation models affects the preservation and evolution of indigenous languages, with a specific focus on dialects spoken in the Indian subcontinent.',
      slug: 'sociological-impact-machine-translation',
      doi: '10.1234/tsr.2026.001',
      authorId: author.id,
      status: 'PUBLISHED',
      views: 3120
    }
  })

  console.log('Seeded Phase 3 content successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
