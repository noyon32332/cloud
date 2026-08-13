import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorksSection from '@/components/HowItWorksSection'

import ScreenshotSection from '@/components/ScreenshotSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <HeroBanner />

      <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC]">
        <FeaturesSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC] dark:bg-[#65B3DC]">
        <HowItWorksSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC] dark:bg-[#65B3DC]">
        <ScreenshotSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC] dark:bg-[#65B3DC]">
        <TestimonialsSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC] dark:bg-[#65B3DC]">
        <FAQSection />
      </section>

      <Footer />
    </div>
  )
}