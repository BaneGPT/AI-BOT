import { Anthropic } from '@anthropic-ai/sdk'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, chatId } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let chat
    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: { id: chatId, userId: session.user.id },
      })
      if (!chat) {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
      }
    } else {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50),
        },
      })
    }

    await prisma.message.create({
      data: {
        content: message,
        role: 'user',
        chatId: chat.id,
        userId: session.user.id,
      },
    })

    const messages = await prisma.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    const anthropicMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const completion = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: anthropicMessages,
    })

    const assistantMessage = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : ''

    await prisma.message.create({
      data: {
        content: assistantMessage,
        role: 'assistant',
        chatId: chat.id,
        userId: session.user.id,
      },
    })

    await prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: assistantMessage,
      chatId: chat.id,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    )
  }
}