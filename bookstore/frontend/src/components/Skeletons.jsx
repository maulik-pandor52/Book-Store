export function ProductSkeleton() {
  return (
    <div className="surface animate-pulse overflow-hidden">
      <div className="h-56 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="surface p-10 text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-3xl dark:bg-slate-800">📚</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
