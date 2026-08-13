import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import StatisticsSection from '@/components/StatisticsSection'
import FeaturesSection from '@/components/FeaturesSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import WhySection from '@/components/WhySection'
import ScreenshotSection from '@/components/ScreenshotSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <HeroBanner />

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <StatisticsSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <FeaturesSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <HowItWorksSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <WhySection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <ScreenshotSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <TestimonialsSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <FAQSection />
      </section>

      <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
        <CTASection />
      </section>

      <Footer />
    </div>
  )
}