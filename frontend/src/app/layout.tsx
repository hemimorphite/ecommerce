import "@/global.css";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
           {children}
        </div>
      </body>
    </html>
  );
}

