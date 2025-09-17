export default function IkigaiFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate">
      <div className="fixed inset-0 -z-20 hidden sm:block bg-[url('/assets/ikigai-finder.webp')] bg-cover bg-center" />
      <div className="fixed inset-0 -z-10 hidden sm:block bg-black/50" />
      <div className="min-h-[calc(100vh-115px)] sm:min-h-[calc(100vh-64px)] max-h-[calc(100vh-115px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
