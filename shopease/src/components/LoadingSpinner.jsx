import { Loader2 } from "lucide-react";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <Loader2 size={32} className="animate-spin text-primary-600" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
