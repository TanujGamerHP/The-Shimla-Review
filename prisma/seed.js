const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Clear the database
  await prisma.paper.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.user.deleteMany()

  // Create Users with different roles
  const authorUser = await prisma.user.create({
    data: {
      email: 'sandeep@example.com',
      name: 'Sandeep Sharma',
      role: 'AUTHOR',
      bio: 'Author and Researcher',
      followers: 4336,
      following: 1,
      views: 0
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shimla.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      bio: 'System Administrator'
    }
  })

  console.log('Created Users:', authorUser.name, adminUser.name)

  // Create Papers to support the legacy Academia clone components
  const papers = [
    {
      title: "Translation Studies (2nd Edition)",
      institution: "HP University (the 2nd Ed)",
      abstract: "A reference text used in India, Africa, and Ukraine, widely accessed on academia.edu with strong ...",
      views: 21719,
      type: "Paper",
      thumbnailUrl: "/translation-studies.jpg"
    },
    {
      title: "Short Note: Chichewa and Hindi Back Translations of the Bible: A Comparative Check of Translation Techniques",
      institution: "SIL International (Dallas, TX, USA)",
      abstract: "The Bible in India has been seen by some as an offshoot of the missionary movement in pre- and po...",
      views: 1778,
      type: "Paper",
      thumbnailUrl: null
    },
    {
      title: "Nudité du traducteur (Nudity of the Translator) by Sandeep Sharma",
      institution: "La Salle University (Bogotá), Translation Studies",
      abstract: "In this essay, we will look into various metaphors of translation studies which describe the trans...",
      views: 1373,
      type: "Paper",
      thumbnailUrl: "/nudite.jpg"
    },
    {
      title: "Annabaj and Traduction et Langues (University of Oran 2).",
      institution: "Oran 2 University (Algeria), Translation Studies",
      abstract: "Sandeep Sharma has published translation studies research in various prestigious international jour...",
      views: 1042,
      type: "Paper",
      thumbnailUrl: "/annabaj.jpg"
    },
    {
      title: "Anuvad ka Samajshastra (Sociology of Translation)",
      institution: "HP University, Interdisciplinary Studies",
      abstract: "A paper discussing the sociology of translation in a modern context...",
      views: 890,
      type: "Paper",
      thumbnailUrl: null
    }
  ]

  for (const paper of papers) {
    await prisma.paper.create({
      data: paper
    })
  }

  // Create Teaching Documents
  const teachingDocs = [
    {
      title: "Syllabus for Translation Theory",
      institution: "HP University",
      abstract: "Syllabus for the Master's program in Translation Theory, Fall Semester.",
      views: 345,
      type: "Teaching Document",
      thumbnailUrl: null
    },
    {
      title: "Lecture Notes: Introduction to Applied Linguistics",
      institution: "HP University",
      abstract: "Comprehensive notes for the introductory course on Applied Linguistics.",
      views: 512,
      type: "Teaching Document",
      thumbnailUrl: null
    }
  ]

  for (const doc of teachingDocs) {
    await prisma.paper.create({
      data: doc
    })
  }

  console.log('Seeded database with new schema!')
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
