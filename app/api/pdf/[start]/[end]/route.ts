// app/pdf/[start]/[end]/route.ts
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'fs/promises';
import path from 'path';
import { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{
    start: string;
    end: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { start, end } = await params;
    const startPage = parseInt(start);
    const endPage = parseInt(end);
    
    if (isNaN(startPage) || isNaN(endPage) || startPage < 1 || endPage < startPage) {
      return new Response('Invalid page range', { status: 400 });
    }
    
    const pdfPath = path.join(process.cwd(), 'public', 'large-file.pdf');
    const pdfBytes = await readFile(pdfPath);
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    
    if (endPage > totalPages) {
      return new Response('Page range exceeds document', { status: 400 });
    }
    
    const newPdf = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage - 1 + i
    );
    
    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => newPdf.addPage(page));
    
    const newPdfBytes = await newPdf.save();
    
    // המרה ל-Buffer
    const buffer = Buffer.from(newPdfBytes);
    
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="pages-${startPage}-${endPage}.pdf"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('PDF Error:', error);
    return new Response('Failed to process PDF', { status: 500 });
  }
}