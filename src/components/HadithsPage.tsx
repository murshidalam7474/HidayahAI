import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from './Navbar';
import { useToast } from '@/hooks/use-toast';

const API_KEY = '$2y$10$3xHbaC6zDjkLeIMItRVehA5O9dRIK1z9CoOfNHMr5Z1hwjBGYK';
const BASE_URL = 'https://hadithapi.com/public/api/hadiths';

interface Hadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithUrdu?: string;
  hadithArabic?: string;
  headingEnglish?: string;
  headingUrdu?: string;
  headingArabic?: string;
}

const HadithsPage = () => {
  const { bookSlug, chapterId } = useParams<{ bookSlug: string; chapterId: string }>();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHadiths = async () => {
      try {
        setLoading(true);
        const page = searchParams.get('page') || currentPage;
        const url = `${BASE_URL}?apiKey=${API_KEY}&book=${bookSlug}&chapter=${chapterId}&paginate=25&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 200) {
          setHadiths(data.hadiths.data);
          setCurrentPage(data.hadiths.current_page);
          setTotalPages(data.hadiths.last_page);
        } else {
          throw new Error(data.message || 'Failed to fetch Hadiths');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to load Hadiths: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHadiths();
  }, [bookSlug, chapterId, currentPage, searchParams, toast]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Hadiths</h2>
            <p className="text-lg text-muted-foreground">
              Explore Hadiths from the selected chapter.
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
          ) : hadiths.length === 0 ? (
            <p className="text-center text-muted-foreground">No Hadiths found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hadiths.map((hadith) => (
                <Card
                  key={hadith.id}
                  className="glass-card cursor-pointer h-64" // Fixed height
                  onClick={() => setSelectedHadith(hadith)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Hadith {hadith.hadithNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {hadith.hadithEnglish}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
            //   disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {/* Dialog for Hadith Details */}
      <Dialog open={!!selectedHadith} onOpenChange={() => setSelectedHadith(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Hadith {selectedHadith?.hadithNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedHadith?.hadithEnglish}</p>
            {selectedHadith?.hadithArabic && (
              <p className="text-right font-arabic text-xl text-primary">
                {selectedHadith.hadithArabic}
              </p>
            )}
            {selectedHadith?.hadithUrdu && (
              <p className="text-muted-foreground">{selectedHadith.hadithUrdu}</p>
            )}
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => setSelectedHadith(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HadithsPage;