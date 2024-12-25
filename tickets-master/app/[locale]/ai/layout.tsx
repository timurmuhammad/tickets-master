// import { GeistSans } from 'geist/font/sans'
// import { GeistMono } from 'geist/font/mono'
// import { Analytics } from '@vercel/analytics/react'
// import '@/app/[locale]/ai/globals.css'
// import { cn } from '@/lib/ai/utils'
// import { TailwindIndicator } from '@/components/ai/tailwind-indicator'
// import { Providers } from '@/components/ai/providers'
// import { Header } from '@/components/ai/header'
// import { KasadaClient } from '@/lib/ai/kasada/kasada-client'

// export const viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: 'white' },
//     { media: '(prefers-color-scheme: dark)', color: 'black' }
//   ]
// }

// interface RootLayoutProps {
//   children: React.ReactNode
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//     <body
//       className={cn(
//         'font-sans antialiased',
//         GeistSans.variable,
//         GeistMono.variable
//       )}
//     >
//       <KasadaClient />
//       <Providers
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         <div className="flex flex-col min-h-screen">
//           <Header />
//           <main className="flex flex-col flex-1">{children}</main>
//         </div>
//         <TailwindIndicator />
//       </Providers>
//       <Analytics />
//     </body>
//   )
// }

import '@/app/[locale]/ai/globals.css'
import { Header } from '@/components/ai/header'
import { KasadaClient } from '@/lib/ai/kasada/kasada-client'
import { Providers } from '@/components/ai/providers'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <KasadaClient />
      <Providers
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-col flex-1">{children}</div>
        </div>
      </Providers>
    </>
  )
}
