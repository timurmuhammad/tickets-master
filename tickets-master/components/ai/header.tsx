// 'use server'

// import Link from 'next/link'

// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"
// import { Button } from '@/components/ai/ui/button'
// import {
//   IconSeparator,
// } from '@/components/ai/ui/icons'
// import { UserMenu } from '@/components/ai/user-menu'
// import { SidebarMobile } from './sidebar-mobile'
// import { SidebarToggle } from './sidebar-toggle'
// import { ChatHistory } from './chat-history'
// import { Session } from '@/lib/ai/types'

// async function UserOrLogin() {
//   const session = await getServerSession(authOptions) as Session
//   return (
//     <>
//       {session?.user ? (
//         <>
//           <SidebarMobile>
//             <ChatHistory userId={session.user.id} />
//           </SidebarMobile>
//           <SidebarToggle />
//         </>
//       ) : (
//         <Link href="/new" rel="nofollow">
//           <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
//         </Link>
//       )}
//       <div className="flex items-center">
//         <IconSeparator className="size-6 text-zinc-200" />
//         {session?.user ? (
//           <UserMenu user={session.user} />
//         ) : (
//           <Button variant="link" asChild className="-ml-2">
//             <Link href="/login">Login</Link>
//           </Button>
//         )}
//       </div>
//     </>
//   )
// }

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {/* <UserOrLogin /> */}
      </div>
    </header>
  )
}
