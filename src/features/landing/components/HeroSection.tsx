'use client'

import HeroLeft from './HeroLeft'
import CosmicIllustration from './CosmicIllustration'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-28 overflow-hidden">
      {/* Nebula ambient glows */}
      <div className="absolute top-[-15%] left-[-12%] w-[700px] h-[700px] rounded-full bg-neonPurple/[0.07] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[-8%] w-[550px] h-[550px] rounded-full bg-neonPink/[0.04] blur-[110px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 grid lg:grid-cols-[45fr_55fr] gap-8 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
        <HeroLeft />
        <div className="relative flex items-center justify-center min-h-[480px]">
          <CosmicIllustration />
        </div>
      </div>
    </section>
  )
}
