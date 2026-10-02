export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-11 w-40 rounded-xl bg-neutral-200" />
          <div className="size-10 rounded-xl bg-neutral-200 sm:w-24" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-2xl bg-neutral-200"
            />
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-10 w-44 rounded-lg bg-neutral-200" />

          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl bg-neutral-200 sm:h-24"
            />
          ))}
        </div>
      </div>
    </main>
  );
}