// app/view-pdf/page.tsx
export default function ViewPDFPage() {
  return (
    <>
      <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
        <iframe
          src="/api/pdf/1/4"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="PDF Viewer"
        />
      </div>
    </>
  );
}