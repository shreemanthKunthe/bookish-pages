import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  LayoutGrid,
  X,
  Loader2,
} from "lucide-react";

interface ReaderControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  showThumbnails: boolean;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onThumbnails: () => void;
  onClose: () => void;
  loading: boolean;
}

const ReaderControls = ({
  currentPage,
  totalPages,
  zoom,
  isFullscreen,
  showThumbnails,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onFullscreen,
  onThumbnails,
  onClose,
  loading,
}: ReaderControlsProps) => {
  return (
    <div className="reader-controls">
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Close (Esc)"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
        title="Previous (←)"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-xs font-sans text-muted-foreground min-w-[80px] text-center tabular-nums">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin inline" />
        ) : (
          `${currentPage + 1} / ${totalPages}`
        )}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
        title="Next (→)"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={onZoomOut}
        disabled={zoom <= 0.5}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
        title="Zoom out (-)"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <span className="text-xs font-sans text-muted-foreground min-w-[40px] text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        disabled={zoom >= 2}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30"
        title="Zoom in (+)"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={onThumbnails}
        className={`p-2 rounded-full transition-colors ${
          showThumbnails ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        }`}
        title="Thumbnails (T)"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      <button
        onClick={onFullscreen}
        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        title="Fullscreen (F)"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ReaderControls;
