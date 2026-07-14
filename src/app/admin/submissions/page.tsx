export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import SubmissionsClient from '@/components/SubmissionsClient'

const prisma = new PrismaClient()

export default async function SubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <SubmissionsClient initialSubmissions={submissions as any} />
  )
}
