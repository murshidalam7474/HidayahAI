import StarField from '@/components/StarField';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuotesSection from '@/components/QuotesSection';
import AIChat from '@/components/AIChat';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <QuotesSection />
        <AboutSection />
      </main>
      
      <AIChat />
      <Footer />
    </div>
  );
};

export default Index;
