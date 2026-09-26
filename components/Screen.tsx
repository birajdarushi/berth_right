// Shared page container: centered, paper-native index card canvas with generous whitespace and high contrast.
export default function Screen({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-3 py-3 sm:px-4 sm:py-6">
      <div
        className={`flex w-full flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 sm:p-6 md:p-7 paper-shadow transition-shadow ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
