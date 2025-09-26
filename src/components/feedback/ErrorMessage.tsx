import { btn, btnSm } from "../../styles/ui";

export default function ErrorMessage({
  message = "Un problème est survenu lors du chargement.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-red-200"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className={`${btn} ${btnSm}`}>
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
