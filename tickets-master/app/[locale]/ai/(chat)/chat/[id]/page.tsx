import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getChat, getMissingKeys } from '@/app/[locale]/ai/actions'
import { Chat } from '@/components/ai/chat'
import { AI } from '@/lib/ai/chat/actions'
import { Session } from '@/lib/ai/types'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions) as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const userId = session.user.id as string
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        interactions: []
      }}
    >
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
