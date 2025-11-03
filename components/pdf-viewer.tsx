
export default function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
    return (
        <iframe
            src={pdfUrl}
            width="100%"
            height="800px"
            style={{ border: "none" }}
            title="PDF Viewer"
        />
    );
}
