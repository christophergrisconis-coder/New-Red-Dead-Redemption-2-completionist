import { useRef } from "react";
import { useProgress } from "@/lib/progress";
import { Download, Upload, Trash2 } from "lucide-react";

export function ImportExportButtons() {
  const exportState = useProgress((s) => s.exportState);
  const importState = useProgress((s) => s.importState);
  const clearAll = useProgress((s) => s.clearAll);
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = () => {
    const data = exportState();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rdr1-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed && typeof parsed === "object") importState(parsed);
      } catch (e) {
        console.error(e);
        alert("Could not read that file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onExport}
        className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs text-parchment hover:border-brass/40"
      >
        <Download className="h-3.5 w-3.5" /> Export
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs text-parchment hover:border-brass/40"
      >
        <Upload className="h-3.5 w-3.5" /> Import
      </button>
      <button
        onClick={() => {
          if (confirm("Wipe all local progress?")) clearAll();
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" /> Reset
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImport(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
