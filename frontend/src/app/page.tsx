import { Features } from '@/components/Features';
import Hero from '@/components/Hero';
import HowTo from '@/components/HowTo';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowTo />
    </div>
  );
}
