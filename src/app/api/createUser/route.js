import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req) {
  const body = await req.json()

  const { type, data } = body

  if (type !== 'session.created') {
    return NextResponse.json({ success: true, message: 'Not a session event' })
  }

  const userId = data?.user_id

  try {
    // Fetch user info from Clerk
    const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch user from Clerk:', await userResponse.text())
      return new NextResponse('Failed to fetch user from Clerk', { status: 500 })
    }

    const user = await userResponse.json()
    const email = user.email_addresses?.[0]?.email_address || ''
    const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          name,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
