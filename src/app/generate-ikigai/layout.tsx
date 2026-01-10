export default function GenerateIkigaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate">
      <div className="fixed inset-0 -z-20 bg-[url('/assets/ikigai-finder.webp')] bg-cover bg-center" />
      <div className="fixed inset-0 -z-10 bg-background/55" />
      <div className="min-h-screen-minus-64">{children}</div>
    </div>
  );
}

