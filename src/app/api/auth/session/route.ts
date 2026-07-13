import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify the Firebase ID Token using the Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check if user exists in our Prisma DB
    let user = await prisma.user.findUnique({
      where: { email: decodedToken.email }
    });

    // If it's a completely new user (e.g. from Google Sign-In on client side), register them in Prisma
    if (!user && decodedToken.email) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email,
          name: decodedToken.name || 'User',
          firebaseUid: decodedToken.uid,
          avatarUrl: decodedToken.picture || null,
          role: decodedToken.email === 'theshimlareview@gmail.com' ? 'SUPER_ADMIN' : 'AUTHOR'
        }
      });
    } else if (user) {
      // Auto-upgrade to SUPER_ADMIN if it's the owner account but was previously just an AUTHOR
      if (user.email === 'theshimlareview@gmail.com' && user.role !== 'SUPER_ADMIN') {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { role: 'SUPER_ADMIN', firebaseUid: decodedToken.uid }
        });
      } else if (!user.firebaseUid) {
        // If user existed before Firebase migration, link their account
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid: decodedToken.uid }
        });
      }
    }

    // Set a secure HTTP-only cookie for Next.js SSR and Server Actions
    const cookieStore = await cookies();
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, role: user?.role || 'AUTHOR' });
  } catch (error) {
    console.error('Session sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}
