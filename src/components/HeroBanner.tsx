import { motion } from 'framer-motion'

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[color:rgb(240,250,245)]">
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-[url('/images/studysphere-hero.png')] bg-no-repeat bg-center bg-contain bg-bottom"></div>
    </section>
  )
}