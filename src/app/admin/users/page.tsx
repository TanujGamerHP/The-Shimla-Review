import { PrismaClient } from '@prisma/client'
import UserManagementClient from '@/components/UserManagementClient'

const prisma = new PrismaClient()

export default async function UserManagementPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      createdAt: true
    }
  })

  // Format data for the client
  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    // Note: Downloads and book buys are not tracked natively in the schema yet.
    // Defaulting to 0 as placeholders for the UI.
    downloads: 0,
    bookBuys: 0
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">
          View all registered users, their roles, and basic activity metrics.
        </p>
      </div>

      <UserManagementClient initialUsers={formattedUsers} />
    </div>
  )
}
