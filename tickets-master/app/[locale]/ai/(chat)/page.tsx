import { nanoid } from '@/lib/ai/utils'
import { Chat } from '@/components/ai/chat'
import { AI } from '@/lib/ai/chat/actions'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import { Session } from '@/lib/ai/types'
import { getMissingKeys } from '@/app/[locale]/ai/actions'

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = await getServerSession(authOptions) as Session
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
