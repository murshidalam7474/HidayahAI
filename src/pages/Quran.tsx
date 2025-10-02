import StarField from '@/components/StarField';
import Navbar from '@/components/Navbar';
import QuranSection from '@/components/QuranSection';
import Footer from '@/components/Footer';

const Quran = () => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <Navbar />
      <main className="relative z-10 pt-20">
        <QuranSection />
      </main>
      <Footer />
    </div>
  );
};

export default Quran;
