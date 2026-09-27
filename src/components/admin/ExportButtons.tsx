import { Download } from "lucide-react";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface ExportButtonsProps {
  students: Array<{
    email: string;
    first_name: string | null;
    submissions: Array<{
      challenge_week: number;
      challenge_title: string;
      class_group: string;
      student_number: string;
      submitted_at: string;
    }>;
  }>;
}

export function ExportButtons({ students }: ExportButtonsProps) {
  const exportSubmissions = () => {
    const rows = students.flatMap((s) =>
      s.submissions.map((sub) => ({
        student_name: s.first_name ?? "",
        student_email: s.email,
        class_group: sub.class_group,
        student_number: sub.student_number,
        week: sub.challenge_week,
        challenge: sub.challenge_title,
        submitted_at: sub.submitted_at,
      }))
    );
    if (rows.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    download(`cmuk-submissions-${stamp}.csv`, toCsv(rows));
  };

  const exportStudents = () => {
    const rows = students.map((s) => ({
      student_name: s.first_name ?? "",
      student_email: s.email,
      submissions: s.submissions.length,
    }));
    if (rows.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    download(`cmuk-students-${stamp}.csv`, toCsv(rows));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportSubmissions}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-green hover:bg-[#1A3C34]/90 text-white text-xs font-bold transition"
      >
        <Download className="w-3.5 h-3.5" />
        Export Submissions CSV
      </button>
      <button
        type="button"
        onClick={exportStudents}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:border-brand-orange/40 hover:bg-orange-50/30 text-brand-green text-xs font-bold transition"
      >
        <Download className="w-3.5 h-3.5" />
        Export Students CSV
      </button>
    </div>
  );
}
