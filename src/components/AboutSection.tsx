import { motion } from 'framer-motion';
import { User, Code, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutSection = () => {
  const skills = [
    'React & TypeScript', 'AI Integration', 'Islamic Studies', 
    'UI/UX Design', 'API Development', 'Mobile Responsive'
  ];

  const features = [
    {
      icon: Code,
      title: 'Modern Technology',
      description: 'Built with React, TypeScript, and cutting-edge AI technologies'
    },
    {
      icon: Heart,
      title: 'Built with Love',
      description: 'Crafted with passion to serve the Muslim community worldwide'
    },
    {
      icon: Star,
      title: 'Quality Focused',
      description: 'Authentic Islamic content verified from reliable sources'
    }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-foreground">About Developer</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate developer behind HidayahAI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-islamic flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground">Mohammed Murshid Alam</CardTitle>
                <p className="text-muted-foreground">
                  Full Stack Developer & Gen AI Engineer
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  Assalamu Alaikum! I'm Mohammed Murshid Alam, a passionate Full Stack Developer and Gen AI Engineer dedicated to creating meaningful Islamic applications that serve the Ummah. HidayahAI represents my commitment to combining modern technology with authentic Islamic knowledge.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Mission</h4>
                  <p className="text-muted-foreground text-sm">
                    To make Islamic knowledge accessible, authentic, and beautifully presented 
                    through modern technology, helping Muslims worldwide strengthen their 
                    connection with their faith.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Why HidayahAI?
            </h3>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card hover:shadow-cosmic-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Dua */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Card className="glass-card border-primary/20">
                <CardContent className="p-6 text-center">
                  <p className="text-lg font-arabic text-primary mb-2">
                    رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ
                  </p>
                  <p className="text-sm text-muted-foreground">
                    "Our Lord, accept this from us. Indeed, You are the All-Hearing, the All-Knowing."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Quran 2:127
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;