import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export interface PDFPage {
  pageNum: number;
  canvas: HTMLCanvasElement;
}

export async function loadPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf;
}

export async function renderPage(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(width / viewport.width, height / viewport.height);
  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
  return canvas;
}

export async function renderPageToDataURL(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
  width: number,
  height: number
): Promise<string> {
  const canvas = await renderPage(pdf, pageNum, width, height);
  return canvas.toDataURL("image/jpeg", 0.92);
}
