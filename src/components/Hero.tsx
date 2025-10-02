import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import galaxyBg from '@/assets/galaxy-bg.jpg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Galaxy Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url(${galaxyBg})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-nebula" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="space-y-8"
        >
          {/* Islamic Greeting */}
          <motion.div
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-arabic text-foreground">
              <span className="bg-gradient-islamic bg-clip-text text-transparent">
                أَسَّلاَمُ عَلَيْكُمْ
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Peace be upon you
            </p>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h2
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              Welcome to{' '}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                HidayahAI
              </span>
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.7,
              }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Your comprehensive Islamic companion powered by AI. Explore the
              Holy Quran, authentic Hadith, inspiring quotes, and get guided
              answers to your Islamic questions.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.9,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="cosmic-glow bg-gradient-islamic hover:shadow-islamic-glow text-primary-foreground font-semibold px-8 py-3 rounded-full transition-all duration-300"
              onClick={() => navigate('/quran')} // Navigate to Quran page
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Read Quran
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/10 px-8 py-3 rounded-full"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.2,
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex flex-col items-center space-y-2 text-muted-foreground"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;