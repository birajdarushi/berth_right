// Shared page container: full-width on mobile, a wide, balanced card on desktop to avoid needless vertical scrolling.
export default function Screen({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-3 sm:py-4 md:py-6">
      <div
        className={`flex w-full flex-col gap-3.5 sm:gap-4 md:rounded-xl md:border md:border-border md:bg-card/90 md:p-6 md:shadow-xs backdrop-blur-xs ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
