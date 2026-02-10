interface ThumbnailStripProps {
  pages: string[];
  currentPage: number;
  onSelect: (page: number) => void;
}

const ThumbnailStrip = ({ pages, currentPage, onSelect }: ThumbnailStripProps) => {
  return (
    <div className="reader-controls !rounded-xl !px-2">
      <div className="thumbnail-strip">
        {pages.map((src, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
              i === currentPage
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={src}
              alt={`Page ${i + 1}`}
              className="h-20 w-auto object-contain bg-page"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailStrip;
