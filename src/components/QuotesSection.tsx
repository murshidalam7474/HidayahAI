import { motion } from 'framer-motion';
import { Quote, Share2, RefreshCw, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const QuotesSection = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const islamicQuotes = [
    {
      text: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
      source: "Quran 65:3",
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ"
    },
    {
      text: "The believer is not one who eats his fill while his neighbor goes hungry.",
      source: "Prophet Muhammad (PBUH)",
      arabic: "لَيْسَ الْمُؤْمِنُ الَّذِي يَشْبَعُ وَجَارُهُ جَائِعٌ"
    },
    {
      text: "And Allah is the best of providers.",
      source: "Quran 62:11",
      arabic: "وَاللَّهُ خَيْرُ الرَّازِقِينَ"
    },
    {
      text: "Be kind, for whenever kindness becomes part of something, it beautifies it.",
      source: "Prophet Muhammad (PBUH)",
      arabic: "إِنَّ الرِّفْقَ مَا كَانَ فِي شَيْءٍ إِلَّا زَانَهُ"
    }
  ];

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % islamicQuotes.length);
  };

  const shareQuote = () => {
    const quote = islamicQuotes[currentQuoteIndex];
    if (navigator.share) {
      navigator.share({
        title: 'Islamic Quote',
        text: `${quote.text} - ${quote.source}`,
      });
    }
  };

  return (
    <section id="quotes" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Quote className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-foreground">Daily Inspiration</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Reflect upon timeless wisdom from the Quran and Sunnah
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card cosmic-glow p-8 text-center relative overflow-hidden">
              {/* Gradient Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
              
              <CardContent className="relative z-10 space-y-6">
                {/* Arabic Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-right"
                >
                  <p className="text-2xl md:text-3xl font-arabic text-primary leading-relaxed">
                    {islamicQuotes[currentQuoteIndex].arabic}
                  </p>
                </motion.div>

                {/* English Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Quote className="h-8 w-8 text-accent mx-auto mb-4 opacity-50" />
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
                    {islamicQuotes[currentQuoteIndex].text}
                  </p>
                </motion.div>

                {/* Source */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-border/20"
                >
                  <p className="text-muted-foreground font-medium">
                    — {islamicQuotes[currentQuoteIndex].source}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center space-x-4 pt-6"
                >
                  <Button
                    onClick={nextQuote}
                    variant="outline"
                    size="lg"
                    className="flex items-center space-x-2 hover:bg-primary/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>New Quote</span>
                  </Button>
                  
                  <Button
                    onClick={shareQuote}
                    variant="outline"
                    size="lg"
                    className="flex items-center space-x-2 hover:bg-accent/10"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Save</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quote Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {islamicQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuoteIndex 
                    ? 'bg-primary shadow-islamic-glow' 
                    : 'bg-muted-foreground/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotesSection;