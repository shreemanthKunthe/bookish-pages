import { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { renderPageToDataURL } from "@/lib/pdf-renderer";
import ReaderControls from "./ReaderControls";
import ThumbnailStrip from "./ThumbnailStrip";

interface BookViewerProps {
  pdf: PDFDocumentProxy;
  onClose: () => void;
}

const Page = forwardRef<HTMLDivElement, { src: string; pageNum: number }>(
  ({ src, pageNum }, ref) => (
    <div ref={ref} className="page-texture h-full w-full relative overflow-hidden">
      <img
        src={src}
        alt={`Page ${pageNum}`}
        className="w-full h-full object-contain"
        draggable={false}
      />
      <div className="spine-gradient absolute inset-0 pointer-events-none" />
      <span
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-sans opacity-40"
        style={{ color: "hsl(24, 10%, 30%)" }}
      >
        {pageNum}
      </span>
    </div>
  )
);
Page.displayName = "Page";

const BOOK_WIDTH = 550;
const BOOK_HEIGHT = 733;

const BookViewer = ({ pdf, onClose }: BookViewerProps) => {
  const flipBookRef = useRef<any>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = pdf.numPages;

  // Load ALL pages first, then render the book once
  useEffect(() => {
    let cancelled = false;
    const loadPages = async () => {
      setLoading(true);
      const rendered: string[] = [];
      for (let i = 1; i <= totalPages; i++) {
        if (cancelled) return;
        const dataUrl = await renderPageToDataURL(pdf, i, BOOK_WIDTH, BOOK_HEIGHT);
        rendered.push(dataUrl);
      }
      if (!cancelled) {
        setPages(rendered);
        setLoading(false);
      }
    };
    loadPages();
    return () => {
      cancelled = true;
    };
  }, [pdf, totalPages]);

  const flipNext = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const goToPage = useCallback((page: number) => {
    flipBookRef.current?.pageFlip()?.flip(page);
  }, []);

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          flipNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          flipPrev();
          break;
        case "Escape":
          if (isFullscreen) setIsFullscreen(false);
          else onClose();
          break;
        case "f":
          setIsFullscreen((f) => !f);
          break;
        case "t":
          setShowThumbnails((s) => !s);
          break;
        case "+":
        case "=":
          setZoom((z) => Math.min(z + 0.1, 2));
          break;
        case "-":
          setZoom((z) => Math.max(z - 0.1, 0.5));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipNext, flipPrev, isFullscreen, onClose]);

  // Show loader until all pages ready
  if (loading || pages.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center animate-pulse-glow">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm font-sans">Preparing your book…</p>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? "fullscreen-reader"
          : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      }
      ref={containerRef}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
      >
        <div className="book-shadow rounded-sm overflow-hidden">
          {/* @ts-ignore - react-pageflip types are incomplete */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={BOOK_WIDTH}
            height={BOOK_HEIGHT}
            size="fixed"
            minWidth={300}
            maxWidth={BOOK_WIDTH}
            minHeight={400}
            maxHeight={BOOK_HEIGHT}
            maxShadowOpacity={0.6}
            showCover={false}
            mobileScrollSupport={false}
            onFlip={handleFlip}
            className="book-viewer"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((src, i) => (
              <Page key={i} src={src} pageNum={i + 1} />
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {showThumbnails && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-full animate-fade-in">
          <ThumbnailStrip
            pages={pages}
            currentPage={currentPage}
            onSelect={goToPage}
          />
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <ReaderControls
          currentPage={currentPage}
          totalPages={totalPages}
          zoom={zoom}
          isFullscreen={isFullscreen}
          showThumbnails={showThumbnails}
          onPrev={flipPrev}
          onNext={flipNext}
          onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
          onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
          onFullscreen={() => setIsFullscreen((f) => !f)}
          onThumbnails={() => setShowThumbnails((s) => !s)}
          onClose={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BookViewer;
