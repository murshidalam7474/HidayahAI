import { motion } from 'framer-motion';
import { Book, Play, Pause, Volume2, X, ChevronLeft, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

interface AyahWithAudio extends Ayah {
  audio?: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface Reciter {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

const BASE_URL = 'https://api.alquran.cloud/v1';

const QuranSection = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahData | null>(null);
  const [translationData, setTranslationData] = useState<SurahData | null>(null);
  const [audioData, setAudioData] = useState<{ ayahs: AyahWithAudio[] } | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<string>('ar.alafasy');
  const [loading, setLoading] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [lastRead, setLastRead] = useState<{ surahNumber: number; ayahNumber: number; surahName: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSurahs();
    fetchReciters();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
      return () => {
        audioRef.current?.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [currentAyah, audioData]);

  useEffect(() => {
    const savedLastRead = localStorage.getItem('lastRead');
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead));
    }
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/surah`);
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Surahs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReciters = async () => {
    try {
      const response = await fetch(`${BASE_URL}/edition/format/audio`);
      const data = await response.json();
      if (data.code === 200) {
        setReciters(data.data);
      }
    } catch (error) {
      console.error("Failed to load reciters", error);
    }
  };

  const fetchSurahData = async (surahNumber: number) => {
    try {
      setLoadingSurah(true);
      
      const [arabicRes, translationRes, audioRes] = await Promise.all([
        fetch(`${BASE_URL}/surah/${surahNumber}`),
        fetch(`${BASE_URL}/surah/${surahNumber}/en.asad`),
        fetch(`${BASE_URL}/surah/${surahNumber}/${selectedReciter}`)
      ]);

      const [arabicData, translationData, audioData] = await Promise.all([
        arabicRes.json(),
        translationRes.json(),
        audioRes.json()
      ]);

      if (arabicData.code === 200) {
        setSelectedSurah(arabicData.data);
      }
      if (translationData.code === 200) {
        setTranslationData(translationData.data);
      }
      if (audioData.code === 200) {
        setAudioData(audioData.data);
      }

      setIsDialogOpen(true);
      setCurrentAyah(0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Surah details",
        variant: "destructive",
      });
    } finally {
      setLoadingSurah(false);
    }
  };

  // Update the handlePlayPause function
  const handlePlayPause = (ayahIndex: number) => {
    if (!audioData?.ayahs[ayahIndex]?.audio) return;

    if (currentAyah === ayahIndex && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioData.ayahs[ayahIndex].audio!;
        audioRef.current.play();
        setCurrentAyah(ayahIndex);
        setIsPlaying(true);

        // Scroll to the currently playing Ayah
        scrollToAyah(audioData.ayahs[ayahIndex].numberInSurah);
      }
    }
  };

  // Update the handleAudioEnded function
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (audioData && currentAyah < audioData.ayahs.length - 1) {
      const nextAyah = currentAyah + 1;
      setCurrentAyah(nextAyah);

      if (audioRef.current && audioData.ayahs[nextAyah]?.audio) {
        audioRef.current.src = audioData.ayahs[nextAyah].audio!;
        audioRef.current.play();
        setIsPlaying(true);

        // Scroll to the next Ayah
        scrollToAyah(audioData.ayahs[nextAyah].numberInSurah);
      }
    }
  };

  const handleReciterChange = async (reciterId: string) => {
    setSelectedReciter(reciterId);
    if (selectedSurah) {
      setLoadingSurah(true);
      try {
        // Only fetch audio for the new reciter, keep surah and translation as is
        const audioRes = await fetch(`${BASE_URL}/surah/${selectedSurah.number}/${reciterId}`);
        const audioJson = await audioRes.json();
        if (audioJson.code === 200) {
          setAudioData(audioJson.data);

          // If an ayah is currently playing, update audio src and continue playing
          if (isPlaying && audioRef.current && audioJson.data.ayahs[currentAyah]?.audio) {
            audioRef.current.src = audioJson.data.ayahs[currentAyah].audio!;
            audioRef.current.play();
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load audio for selected reciter",
          variant: "destructive",
        });
      } finally {
        setLoadingSurah(false);
      }
    }
  };

  // Filter surahs based on searchKey (matches Arabic or English name, case-insensitive)
  const filteredSurahs = surahs.filter(surah =>
    surah.name.toLowerCase().includes(searchKey.trim().toLowerCase()) ||
    surah.englishName.toLowerCase().includes(searchKey.trim().toLowerCase())
  );

  // Updated handleMarkAsLastRead function
  const handleMarkAsLastRead = async (surahNumber: number, ayahNumber: number, surahName: string) => {
    const lastReadData = { surahNumber, ayahNumber, surahName };
    localStorage.setItem('lastRead', JSON.stringify(lastReadData));
    setLastRead(lastReadData);

    toast({
      title: "Success",
      description: `Marked Surah ${surahName}, Ayah ${ayahNumber} as last read.`,
      variant: "default",
    });

    // Fetch the Surah data and scroll to the Ayah immediately
    await fetchSurahData(surahNumber);
    scrollToAyah(ayahNumber);
  };

  // Scroll to Ayah
  const scrollToAyah = (ayahNumber: number) => {
    const ayahElement = document.getElementById(`ayah-${ayahNumber}`);
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="quran" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Book className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-foreground">Holy Quran</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read, listen, and reflect upon the divine guidance of Allah (SWT)
          </p>
        </motion.div>

        {/* Search Input and Go To Last Read Button */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              placeholder="Search Surah by Arabic or English name..."
              className="w-full py-2 pl-10 pr-4 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-lg bg-primary/10 text-primary placeholder:text-primary/60 transition"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary" />
          </div>
          {lastRead && (
            <Button
              variant="default"
              className="ml-4"
              onClick={async () => {
                await fetchSurahData(lastRead.surahNumber); // Fetch the Surah data
                scrollToAyah(lastRead.ayahNumber); // Scroll to the specific Ayah
              }}
            >
              Go To Last Read
            </Button>
          )}
        </div>

        {/* Show search key as a badge if searching */}
        {searchKey.trim() && (
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="text-base px-4 py-2 bg-primary/80 text-white border-none">
              Searching: <span className="font-arabic ml-2">{searchKey}</span>
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah, index) => (
                <motion.div
                  key={surah.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card hover:shadow-cosmic-card transition-all duration-300 group cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          Surah {surah.number}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {surah.revelationType}
                        </Badge>
                      </div>
                      <CardTitle className="font-arabic text-xl text-right text-primary">
                        {surah.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {surah.englishName} - {surah.englishNameTranslation}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {surah.numberOfAyahs} Ayahs
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary/10 transition-colors"
                        onClick={() => fetchSurahData(surah.number)}
                        disabled={loadingSurah}
                      >
                        {loadingSurah ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Read Surah'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground text-lg py-10">
                No Surah found for "<span className="font-arabic">{searchKey}</span>"
              </div>
            )
          )}
        </div>

        {/* Surah Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] glass-card">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="font-arabic text-3xl text-primary">
                    {selectedSurah?.name}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-2">
                    {selectedSurah?.englishName} - {selectedSurah?.englishNameTranslation}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">{selectedSurah?.numberOfAyahs} Ayahs</Badge>
                    <Badge variant="outline">{selectedSurah?.revelationType}</Badge>
                  </div>
                </div>
              </div>
              
              {/* Reciter Selection */}
              <div className="flex items-center gap-2 mt-4">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedReciter} onValueChange={handleReciterChange}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Reciter" />
                  </SelectTrigger>
                  <SelectContent>
                    {reciters.map((reciter) => (
                      <SelectItem key={reciter.identifier} value={reciter.identifier}>
                        {reciter.englishName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {selectedSurah?.ayahs.map((ayah, index) => (
                  <motion.div
                    id={`ayah-${ayah.numberInSurah}`}
                    key={ayah.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      currentAyah === index && isPlaying 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card/50 border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{ayah.numberInSurah}</Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePlayPause(index)}
                          className="h-8 w-8 p-0"
                        >
                          {currentAyah === index && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        {/* Updated "Mark as Last Read" button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsLastRead(selectedSurah?.number!, ayah.numberInSurah, selectedSurah?.name!)}
                        >
                          Mark as Last Read
                        </Button>
                      </div>
                    </div>
                    
                    <p className="font-arabic text-2xl text-right leading-loose text-primary mb-4">
                      {ayah.text}
                    </p>
                    
                    {translationData?.ayahs[index] && (
                      <p className="text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {translationData.ayahs[index].text}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            
            <audio ref={audioRef} className="hidden" />
          </DialogContent>
        </Dialog>

        {/* Continue Reading button */}
        {lastRead && (
          <div className="flex justify-center mb-6">
            <Button
              variant="default"
              onClick={() => fetchSurahData(lastRead.surahNumber).then(() => scrollToAyah(lastRead.ayahNumber))}
            >
              Continue Reading: Surah {lastRead.surahName}, Ayah {lastRead.ayahNumber}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuranSection;