'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Provided Exact Lists
const expectedBooks = [
  "Translation Studies (2nd Edition)",
  "Translation and Translation Studies",
  "LITERARY TRADITIONS IN INDIA: THE BEGINNER'S INTRODUCTION BY SANDEEP SHARMA",
  "SUFISM, BHAKTI TRADITIONS AND POLITICS OF LANGUAGE IN INDIA: BEGINNER'S INTRODUCTION",
  "LITERARY TRADITIONS IN INDIA: BEGINNER'S INTRODUCTION",
  "BAUL SONGS: BEGINNER'S INTRODUCTION BY SANDEEP SHARMA"
]

const expectedNotes = [
  '"Short Note: Chichewa and Hindi Back Translations of the Bible: A Comparative Check of Translation Techniques"',
  'Student\'s Notes on " The Mad Lover " by Sandeep Sharma',
  "Student's Notes on Wings of Fire by APJ Abdul Kalam by Sandeep Sharma",
  "Student's Notes on Bulleh Shah by Sandeep Sharma",
  "Student's Notes on William Hazlitt by Sandeep Sharma",
  "Student's Notes on Swami Vivekananda",
  "A VERY SHORT NOTE ON TRANSLATION IN BELGIUM by Sandeep Sharma",
  "A VERY SHORT NOTE ON TRANSLATION IN BERMUDA by Sandeep Sharma",
  "A VERY SHORT NOTE ON TRANSLATION IN AUSTRIA by Sandeep Sharma",
  "A VERY SHORT NOTE ON TRANSLATION IN AZERBAIJAN by Sandeep Sharma",
  "A VERY SHORT NOTE ON TRANSLATION IN BANGLADESH by Sandeep Sharma",
  "VERY SHORT NOTE ON TRANSLATION IN ALBANIA by Sandeep Sharma",
  "A VERY SHORT NOTE ON TRANSLATION IN AFGHANISTAN by Sandeep",
  "Student's Notes on the Origin of Hindi by Sandeep Sharma",
  "Student's Notes on Ruskin Bond by Sandeep Sharma",
  "A SHORT NOTE ON DISTRICT SIRMOUR (HIMACHAL PRADESH) INDIA"
]

const expectedPapers = [
  "Nudité du traducteur (Nudity of the Translator) by Sandeep Sharma",
  "Saussure’s Reading of Pānini: The Case of Linguistic Cannibalism, Genitive Absolute, Umlaut and so on...",
  "Cultural Studies in India (Yesterday)",
  "FROM POSTAL MODE TO OER: FIRST EXPERIENCES, CITATION ADVANTAGE AND LESSONS LEARNT IN DISTRIBUTING SELF LEARNING MATERIAL (SLM) ON ACADEMIA.EDU",
  "Saussure's Handless Men: Signing with Phantom Hands",
  "Derridian Metaphor by Sandeep Sharma",
  "Afghanologies! الأفغانيبليد الحركة",
  "STATUS OF DALIT LITERATURE IN THE FEATURED BOOKS OF BLOOMSBURY, HARPER COLLINS AND RUPA, INDIA: A COMPARATIVE CHECK",
  "People of Indus Valley Civilization Never Took “Bath”: Memoirs of Ruins through Derrida",
  "Leftovers of The Trembling/Translating Philosophers: Malamoud, Derrida and the Brahmanic Leftovers (úchiṣṭa)"
]

const expectedMisc = [
  '"Temptation of the Circles"',
  '"Hunger: Who Cares?"',
  '"The Soil Purana:The Soil Bible"',
  '"On my Death: I will be Programmed again"',
  "Himanshu",
  '"Revolutionary Leader, the late Mr. James Ronald Webster\'s Farewell Letter: First Translation" into Hindi by Sandeep Sharma',
  "Satanic Viruses: Interview with Covid 19",
  "Elegy on his Father by Nida Fazli (Trans. Sandeep Sharma)",
  "Décophobia in Derrida Today (2016)",
  "Elegies on Father: Ma'arri and Nida Fazli by Sandeep Sharma",
  "SHORT SHORT STORY.doc",
  "Remembering the Great Academician and Scholar, the Late Dr Som Ranchan: Som Ranchan by Sandeep Sharma",
  "THE FIRST HINDI TRANSLATION OF ULURU STATEMENT.docx",
  "जंगल में लॉक-डाउन (\"Lockdown in Jungle\")",
  "SECRET DIARY OF A POLITICIAN"
]

const ALL_EXPECTED = [
  ...expectedBooks.map(t => ({ title: t.trim(), type: 'Book' })),
  ...expectedNotes.map(t => ({ title: t.trim(), type: 'StudentNote' })),
  ...expectedPapers.map(t => ({ title: t.trim(), type: 'ResearchPaper' })),
  ...expectedMisc.map(t => ({ title: t.trim(), type: 'MiscWork' }))
]

function normalizeStr(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function generateSlug(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  return `${base}-${Math.random().toString(36).substring(2, 8)}`
}

export async function runContentMigration() {
  try {
    const author = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (!author) throw new Error("No users found to act as author.")

    const existingBooks = await prisma.book.findMany()
    const existingPapers = await prisma.researchPaper.findMany()
    const existingNotes = await prisma.studentNote.findMany()
    const existingMisc = await prisma.miscWork.findMany()

    const allExisting = [
      ...existingBooks.map(x => ({ ...x, _currentType: 'Book' })),
      ...existingPapers.map(x => ({ ...x, _currentType: 'ResearchPaper' })),
      ...existingNotes.map(x => ({ ...x, _currentType: 'StudentNote' })),
      ...existingMisc.map(x => ({ ...x, _currentType: 'MiscWork' }))
    ]

    let movedCount = 0
    let createdCount = 0

    // Keep track of which expected titles we've matched
    const matchedExpectedTitles = new Set<string>()

    // 1. Move misplaced items and update exact titles
    for (const item of allExisting) {
      const normalizedTitle = normalizeStr(item.title)
      const expectedMatch = ALL_EXPECTED.find(e => normalizeStr(e.title) === normalizedTitle)

      if (expectedMatch) {
        matchedExpectedTitles.add(expectedMatch.title)

        if (expectedMatch.type !== item._currentType) {
          // It needs to move!
          const dataToCopy = {
            title: expectedMatch.title, // Use exact expected title
            subtitle: item.subtitle,
            slug: item.slug,
            coverImageUrl: item.coverImageUrl,
            downloadUrl: item.downloadUrl,
            views: item.views,
            downloads: item.downloads,
            status: item.status,
            createdAt: item.createdAt,
            authorId: item.authorId
          }

          // Description field names vary: Book(synopsis), Paper(abstract), Note/Misc(description)
          const descContent = (item as any).synopsis || (item as any).abstract || (item as any).description || ""

          // Create in new location
          if (expectedMatch.type === 'Book') {
            await prisma.book.create({ data: { ...dataToCopy, synopsis: descContent } })
          } else if (expectedMatch.type === 'ResearchPaper') {
            await prisma.researchPaper.create({ data: { ...dataToCopy, abstract: descContent } })
          } else if (expectedMatch.type === 'StudentNote') {
            await prisma.studentNote.create({ data: { ...dataToCopy, description: descContent } })
          } else if (expectedMatch.type === 'MiscWork') {
            await prisma.miscWork.create({ data: { ...dataToCopy, description: descContent } })
          }

          // Delete from old location
          if (item._currentType === 'Book') await prisma.book.delete({ where: { id: item.id } })
          if (item._currentType === 'ResearchPaper') await prisma.researchPaper.delete({ where: { id: item.id } })
          if (item._currentType === 'StudentNote') await prisma.studentNote.delete({ where: { id: item.id } })
          if (item._currentType === 'MiscWork') await prisma.miscWork.delete({ where: { id: item.id } })
          
          movedCount++
        } else if (expectedMatch.title !== item.title) {
          // It is in the right table, but the title has minor casing differences. Let's fix the title.
          const newTitle = expectedMatch.title
          if (item._currentType === 'Book') await prisma.book.update({ where: { id: item.id }, data: { title: newTitle } })
          if (item._currentType === 'ResearchPaper') await prisma.researchPaper.update({ where: { id: item.id }, data: { title: newTitle } })
          if (item._currentType === 'StudentNote') await prisma.studentNote.update({ where: { id: item.id }, data: { title: newTitle } })
          if (item._currentType === 'MiscWork') await prisma.miscWork.update({ where: { id: item.id }, data: { title: newTitle } })
        }
      }
    }

    // 2. Create missing items
    for (const expected of ALL_EXPECTED) {
      if (!matchedExpectedTitles.has(expected.title)) {
        // Create placeholder
        const data = {
          title: expected.title,
          slug: generateSlug(expected.title),
          status: "PUBLISHED",
          authorId: author.id
        }

        if (expected.type === 'Book') {
          await prisma.book.create({ data })
        } else if (expected.type === 'ResearchPaper') {
          await prisma.researchPaper.create({ data })
        } else if (expected.type === 'StudentNote') {
          await prisma.studentNote.create({ data })
        } else if (expected.type === 'MiscWork') {
          await prisma.miscWork.create({ data })
        }
        createdCount++
      }
    }

    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true, movedCount, createdCount }

  } catch (error: any) {
    console.error("Migration error:", error)
    return { error: error.message }
  }
}
