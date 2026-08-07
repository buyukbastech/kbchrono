import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import WatchDetail from "./pages/WatchDetail.tsx";
import Collections from "./pages/Collections.tsx";
import Contact from "./pages/Contact.tsx";
import RareBags from "./pages/RareBags.tsx";
import Jewellery from "./pages/Jewellery.tsx";
import Personalization from "./pages/Personalization.tsx";
import OldMoney from "./pages/OldMoney.tsx";
import NotFound from "./pages/NotFound.tsx";
import WhatsAppButton from "./components/WhatsAppButton.tsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGeoLanguage } from "./hooks/useGeoLanguage";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash, pathname]);

  return null;
};

const YandexMetrikaTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(111394495, "hit", pathname);
    }
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => {
  useGeoLanguage();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <WhatsAppButton />
      <BrowserRouter>
        <ScrollToHash />
        <YandexMetrikaTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/watch/:id" element={<WatchDetail />} />
          <Route path="/rare-bags" element={<RareBags />} />
          <Route path="/jewellery" element={<Jewellery />} />
          <Route path="/personalization" element={<Personalization />} />
          <Route path="/old-money" element={<OldMoney />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
