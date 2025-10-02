import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from './Navbar'; // Import the Navbar component

const API_KEY = '$2y$10$3xHbaC6zDjkLeIMItRVehA5O9dRIK1z9CoOfNHMr5Z1hwjBGYK';
const BASE_URL = 'https://hadithapi.com/api';

interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu?: string;
  chapterArabic?: string;
}

const ChaptersPage = () => {
  const { bookSlug } = useParams<{ bookSlug: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
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
          title: 'Error',
          description: `Failed to load chapters: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [bookSlug, toast]);

  return (
    <>
      <Navbar /> {/* Render the Navbar */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Chapters</h2>
            <p className="text-lg text-muted-foreground">
              Explore chapters from the selected Hadith book.
            </p>
          </div>

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
          ) : chapters.length === 0 ? (
            <p className="text-center text-muted-foreground">No chapters found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <Card key={chapter.id} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Chapter {chapter.chapterNumber}: {chapter.chapterEnglish}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chapter.chapterArabic && (
                      <p className="text-right font-arabic text-xl text-primary">
                        {chapter.chapterArabic}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate(`/hadiths/${bookSlug}/${chapter.id}`)}
                    >
                      View Hadiths
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ChaptersPage;