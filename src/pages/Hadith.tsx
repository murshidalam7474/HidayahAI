import StarField from '@/components/StarField';
import Navbar from '@/components/Navbar';
import HadithSection from '@/components/HadithSection';
import Footer from '@/components/Footer';

const Hadith = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20">
        <HadithSection />
      </main>
      <Footer />
    </div>
  );
};

export default Hadith;
