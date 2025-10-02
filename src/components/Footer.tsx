import { motion } from 'framer-motion';
import { Moon, Heart, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Resources',
      links: [
        { name: 'Quran', href: '#quran' },
        { name: 'Hadith', href: '#hadith' },
        { name: 'Daily Quotes', href: '#quotes' },
        { name: 'AI Assistant', href: '#chat' }
      ]
    }
  ];

  // Glow animation variants
  const glowVariant = {
    hidden: { opacity: 0.6, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1.2,
      boxShadow: "0px 0px 12px rgba(59,130,246,0.8)", // blue glow
      transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
    }
  };

  return (
    <footer className="relative bg-card/20 border-t border-border/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-islamic">
                <Moon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground font-arabic">HidayahAI</h3>
                <p className="text-xs text-muted-foreground">Your Islamic Companion</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering Muslims worldwide with authentic Islamic knowledge through 
              modern technology and AI assistance.
            </p>

            {/* Social Links with Glow Animation */}
            <div className="flex space-x-3">
              {/* GitHub */}
              <motion.a
                href="https://github.com/murshidalam7474"
                target="_blank"
                rel="noopener noreferrer"
                variants={glowVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Github className="h-4 w-4 text-primary" />
                </Button>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/mohammed-murshid-alam-9421561ba"
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  ...glowVariant,
                  visible: {
                    ...glowVariant.visible,
                    boxShadow: "0px 0px 12px rgba(37,99,235,0.9)" // LinkedIn blue
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4 text-blue-500" />
                </Button>
              </motion.a>

              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/mma_7474/"
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  ...glowVariant,
                  visible: {
                    ...glowVariant.visible,
                    boxShadow: "0px 0px 12px rgba(236,72,153,0.9)" // Instagram pink
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Instagram className="h-4 w-4 text-pink-500" />
                </Button>
              </motion.a>
            </div>
          </motion.div>

          {/* Horizontal Footer Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-3"
          >
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="flex flex-wrap gap-4">
              {footerLinks[0].links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Islamic Greeting */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-6 border-t border-border/20"
        >
          <div className="space-y-3">
            <p className="text-lg font-arabic text-primary">
              بَارَكَ اللَّهُ فِيكُمْ
            </p>
            <p className="text-sm text-muted-foreground">
              May Allah bless you all
            </p>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-6 border-t border-border/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} HidayahAI. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-400 mx-1 animate-pulse" />
              for the Ummah.
            </p>
            <p className="text-sm text-muted-foreground">
              "And say: My Lord, increase me in knowledge." - Quran 20:114
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
