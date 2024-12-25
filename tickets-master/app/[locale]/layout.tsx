import { ReactNode } from "react";
import { AppProvider } from '@/providers/AppProvider'
import { StoreProvider } from '@/providers/StoreProvider'
import { SessionProvider } from '@/providers/SessionProvider'
import { UserLocationProvider } from '@/providers/UserLocationProvider'
import LayoutHead from "@/components/head/LayoutHead"
import SrollTop from "@/components/common/ScrollTop"
import HashScroller from "@/components/common/HashScroller"
import TrackingIdHandler from "@/components/common/TrackingIdHandler"
import { headers } from "next/headers"
import { allLocales } from '@/data/locales'
import { getDomainConfig } from '@/utils/domainConfig'
import { Toaster } from '@/components/common/Sonner'

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "@/styles/index.scss";

export async function generateMetadata({ params }) {
  const headerList = headers();
  const reqHost = headerList.get("x-current-domain")
  const { domain } = getDomainConfig({ host: reqHost })
  
  return {
    metadataBase: new URL(`https://${domain}`)
  }
}

export function generateStaticParams() {
  return allLocales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const headerList = headers();
  const host = headerList.get("x-current-domain")

  return (
    <html lang={locale} >
      <AppProvider host={host} locale={locale}>
        <LayoutHead/>
        <body>
          <Toaster position="top-center" />
          <main>
            <StoreProvider>
              <SessionProvider>
                <UserLocationProvider>
                  <HashScroller />
                  <TrackingIdHandler />
                  {children}
                  <SrollTop />
                </UserLocationProvider>
              </SessionProvider>
            </StoreProvider>
          </main>
        </body>
      </AppProvider>
    </html>
  )
}