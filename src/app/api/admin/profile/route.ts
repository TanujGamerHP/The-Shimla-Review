import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'theshimlareview@gmail.com' }
    })
    
    return NextResponse.json({ user: adminUser })
  } catch (error) {
    console.error('Failed to fetch admin profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
