import { useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { loadPdf } from "@/lib/pdf-renderer";
import UploadZone from "@/components/UploadZone";
import BookViewer from "@/components/BookViewer";
import { BookOpen } from "lucide-react";

const Index = () => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsLoading(true);
    try {
      const doc = await loadPdf(file);
      setPdf(doc);
    } catch (e) {
      setError("Failed to load PDF. Please try another file.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPdf(null);
  };

  if (pdf) {
    return <BookViewer pdf={pdf} onClose={handleClose} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary mb-5">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-serif text-foreground mb-3 tracking-tight">
            Bibliotheca
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Experience your documents as beautifully bound books with realistic page-turning physics.
          </p>
        </div>

        <UploadZone onFileSelect={handleFileSelect} />

        {isLoading && (
          <div className="text-center mt-6">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground text-xs">Loading PDF…</p>
          </div>
        )}

        {error && (
          <p className="text-center mt-4 text-destructive text-sm">{error}</p>
        )}

        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>← → Navigate</span>
            <span>F Fullscreen</span>
            <span>T Thumbnails</span>
            <span>+/- Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
