import { motion } from 'framer-motion';
import { MessageSquare, Search, ChevronDown, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface Hadith {
  id: number;
  hadithEnglish: string;
  hadithArabic?: string;
  englishNarrator: string;
  book: {
    bookName: string;
    bookSlug: string;
  };
  chapter: {
    chapterEnglish: string;
    chapterNumber: string;
  };
  hadithNumber: string;
  status: string;
}

interface HadithBook {
  id: number;
  bookName: string;
  bookSlug: string;
  hadithStartNumber: number;
  hadithEndNumber: number;
  totalHadith: number;
}

interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu?: string;
  chapterArabic?: string;
  bookSlug: string;
}

const API_KEY = '$2y$10$3xHbaC6zDjkLeIMItRVehA5O9dRIK1z9CoOfNHMr5Z1hwjBGYK';
const BASE_URL = 'https://hadithapi.com/api';

const HadithSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<HadithBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHadiths, setLoadingHadiths] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      fetchChapters(selectedBook);
      fetchHadiths(selectedBook, currentPage);
    }
  }, [selectedBook, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/books?apiKey=${API_KEY}`);
      const data = await response.json();
      if (data.status === 200) {
        setBooks(data.books);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Hadith books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (bookSlug: string) => {
    try {
      setLoadingChapters(true);
      const url = `${BASE_URL}/${bookSlug}/chapters?apiKey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 200) {
        setChapters(data.chapters);
      } else {
        throw new Error(data.message || 'Failed to fetch chapters');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load chapters: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingChapters(false);
    }
  };

  const fetchHadiths = async (bookSlug: string, page: number = 1) => {
    try {
      setLoadingHadiths(true);
      const url = `${BASE_URL}/hadiths/?apiKey=${API_KEY}&book=${bookSlug}&paginate=10&page=${page}`;
      console.log('Fetching hadiths from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.status === 200) {
        setHadiths(data.hadiths.data || data.hadiths || []);
        setTotalPages(data.hadiths.last_page || 1);
      } else {
        throw new Error(data.message || 'Failed to fetch hadiths');
      }
    } catch (error) {
      console.error('Hadith fetch error:', error);
      toast({
        title: "Error",
        description: `Failed to load Hadiths: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingHadiths(false);
    }
  };

  const handleBookSelect = (bookSlug: string) => {
    setSelectedBook(bookSlug);
    navigate(`/chapters/${bookSlug}`); // Navigate to the chapters page
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() || !selectedBook) return;
    try {
      setLoadingHadiths(true);
      const url = `${BASE_URL}/hadiths/?apiKey=${API_KEY}&book=${selectedBook}&search=${encodeURIComponent(searchTerm)}`;
      console.log('Searching hadiths:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search response:', data);
      
      if (data.status === 200) {
        setHadiths(data.hadiths.data || data.hadiths || []);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: `Search failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoadingHadiths(false);
    }
  };

  return (
    <section id="hadith" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-4xl font-bold text-foreground">Hadith Collections</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore authentic sayings and teachings of Prophet Muhammad (PBUH)
          </p>
        </motion.div>

        {/* Search Bar */}
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto flex gap-2">
              <Input
                placeholder="Search Hadith..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 glass-card"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
            </div>
          </motion.div>
        )}

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-3" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`glass-card hover:shadow-cosmic-card transition-all duration-300 cursor-pointer group ${
                    selectedBook === book.bookSlug ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleBookSelect(book.bookSlug)}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg text-primary group-hover:text-accent transition-colors">
                      {book.bookName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="secondary" className="mb-3">
                      {book.totalHadith?.toLocaleString() || book.hadithEndNumber || 'N/A'} Hadiths
                    </Badge>
                    <Button 
                      variant={selectedBook === book.bookSlug ? "default" : "outline"} 
                      className="w-full"
                    >
                      {selectedBook === book.bookSlug ? 'Selected' : 'Browse Collection'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Hadiths Display */}
        {selectedBook && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">
              Hadiths from {books.find(b => b.bookSlug === selectedBook)?.bookName}
            </h3>

            {/* Chapters List */}
            <div className="mb-6">
              {loadingChapters ? (
                <Skeleton className="h-8 w-full" />
              ) : chapters.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {chapters.map(chapter => (
                    <Badge key={chapter.id} variant="outline">
                      {chapter.chapterNumber}. {chapter.chapterEnglish}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">No chapters found.</p>
              )}
            </div>

            {loadingHadiths ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="glass-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : hadiths.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No hadiths found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {hadiths.map((hadith, index) => (
                  <motion.div
                    key={hadith.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Collapsible>
                      <Card className="glass-card">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3 flex-wrap gap-2">
                                <Badge variant="outline">{hadith.book.bookName}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {hadith.chapter.chapterEnglish}
                                </span>
                                <Badge variant="secondary">#{hadith.hadithNumber}</Badge>
                              </div>
                              <ChevronDown className="h-4 w-4 flex-shrink-0" />
                            </div>
                            {hadith.hadithArabic && (
                              <CardTitle className="text-right font-arabic text-xl text-primary leading-loose">
                                {hadith.hadithArabic}
                              </CardTitle>
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              <p className="text-foreground leading-relaxed">
                                "{hadith.hadithEnglish}"
                              </p>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Narrated by: {hadith.englishNarrator}</span>
                                <Badge variant={hadith.status === 'Sahih' ? 'default' : 'secondary'}>
                                  {hadith.status}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </motion.div>
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loadingHadiths}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loadingHadiths}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HadithSection;