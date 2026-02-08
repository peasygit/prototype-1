import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ValueCards from '@/components/ValueCards';
import ProcessSteps from '@/components/ProcessSteps';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ValueCards />
      <ProcessSteps />
      <Footer />
    </main>
  );
}