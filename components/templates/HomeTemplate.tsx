import { Header } from "@/components/organisms/Header"
import { HeroSection } from "@/components/organisms/HeroSection"
import { WhatIsSection } from "@/components/organisms/WhatIsSection"
import { AmazonSection } from "@/components/organisms/AmazonSection"
import { TransformSection } from "@/components/organisms/TransformSection"
import { FAQSection } from "@/components/organisms/FAQSection"
import { Footer } from "@/components/organisms/Footer"

interface HomeTemplateProps {
  isAuthenticated: boolean
}

export function HomeTemplate({ isAuthenticated }: HomeTemplateProps) {
  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <main>
        <HeroSection />
        <WhatIsSection />
        <AmazonSection />
        <TransformSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
