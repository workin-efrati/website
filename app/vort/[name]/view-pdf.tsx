// app/view-pdf/page.tsx
export default function ViewPDF({start, end}: {start: number, end: number}) {
  return (
    <>
      <div style={{ width: '100%', height: '100vh', margin: 0 }}>
        <iframe
          src={`/api/pdf/${start}/${end}`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="PDF Viewer"
        />
      </div>
    </>
  );
}