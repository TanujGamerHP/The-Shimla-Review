import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import EditContentClient from '@/components/EditContentClient'

const prisma = new PrismaClient()

export default async function EditContentPage({ params }: { params: Promise<{ type: string, id: string }> }) {
  const { type, id } = await params
  let itemData = null

  if (type === 'book') {
    itemData = await prisma.book.findUnique({ where: { id } })
  } else if (type === 'short-story') {
    itemData = await prisma.journal.findUnique({ where: { id } })
  } else if (type === 'research-paper') {
    itemData = await prisma.researchPaper.findUnique({ where: { id } })
  } else if (type === 'poetry') {
    itemData = await prisma.poem.findUnique({ where: { id } })
  }

  if (!itemData) {
    redirect('/admin/manage-content')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">Edit {type.replace('-', ' ')}</h1>
        <p className="text-gray-500 mt-1">Update the details of your published content. Leaving file uploads blank will keep the existing files.</p>
      </div>

      <EditContentClient type={type} data={itemData} />
    </div>
  )
}
