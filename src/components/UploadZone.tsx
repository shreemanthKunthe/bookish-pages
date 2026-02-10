import { useState, useCallback, useRef } from "react";
import { BookOpen, Upload } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files?.[0]?.type === "application/pdf") {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className={`upload-zone cursor-pointer p-16 text-center ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Upload className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-serif text-foreground mb-2">
            Drop your PDF here
          </h3>
          <p className="text-muted-foreground text-sm">
            or click to browse · PDF files only
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
