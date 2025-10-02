import { motion } from 'framer-motion';
import { Moon, Heart, Github, Twitter, Mail } from 'lucide-react';
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
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mail className="h-4 w-4" />
              </Button>
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
              <Heart className="inline h-4 w-4 text-red-400 mx-1" />
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