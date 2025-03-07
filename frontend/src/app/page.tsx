import { BentoDemo } from '@/components/Features';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <BentoDemo />
    </div>
  );
}
