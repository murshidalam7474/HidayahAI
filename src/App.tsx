import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import NotFound from "./pages/NotFound";
import ChaptersPage from "./components/ChaptersPage";
import HadithsPage from "./components/HadithsPage";
import AboutSection from "./components/AboutSection"; // Import the AboutSection component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/about" element={<AboutSection />} /> {/* Added About route */}
          <Route path="/chapters/:bookSlug" element={<ChaptersPage />} />
          <Route path="/hadiths/:bookSlug/:chapterId" element={<HadithsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
