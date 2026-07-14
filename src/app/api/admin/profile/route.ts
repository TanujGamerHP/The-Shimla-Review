import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'theshimlareview@gmail.com' }
    })
    
    const settings = await prisma.settings.findMany({
      where: { key: { in: ['home_followers_display', 'home_views_display'] } }
    })
    const getSetting = (key: string, def: string) => settings.find(s => s.key === key)?.value || def

    return NextResponse.json({ 
      user: {
        ...adminUser,
        followersDisplay: getSetting('home_followers_display', adminUser?.followers?.toString() || '0'),
        viewsDisplay: getSetting('home_views_display', adminUser?.views?.toString() || '0')
      } 
    })
  } catch (error) {
    console.error('Failed to fetch admin profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
