import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Challenge, Badge } from "../types";
import { X, Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  challenge: Challenge;
  badge: Badge;
  onClose: () => void;
  onSuccess: (entryRef: string) => void;
}

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const MAX_INPUT_BYTES = 20 * 1024 * 1024;

async function compressImage(file: File): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}

export function ChallengeSubmissionModal({ challenge, badge, onClose, onSuccess }: Props) {
  const [classGroup, setClassGroup] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("That image is too large. Please choose one under 20 MB.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setPhotoBlob(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error("Compression error:", err);
      setPhotoBlob(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!classGroup.trim()) return setError("Please enter your class group.");
    if (!studentNumber.trim()) return setError("Please enter your student number.");
    if (!photoBlob) return setError("Please attach a photo as proof.");

    setBusy(true);

    try {
      const form = new FormData();
      form.append("class_group", classGroup.trim());
      form.append("student_number", studentNumber.trim());
      form.append("challenge_id", challenge.id);
      form.append("photo", photoBlob, "proof.jpg");

      const res = await fetch("/api/submit-challenge", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.entry_ref) {
          setSuccessRef(data.entry_ref);
          return;
        }
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccessRef(data.entry_ref);
      setTimeout(() => onSuccess(data.entry_ref), 1400);
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Week {challenge.week} · Submit proof
            </p>
            <h3 className="font-extrabold text-brand-green text-base mt-0.5">
              {challenge.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-lg">{badge.icon}</span>
              <span>Unlocks <span className="font-semibold">{badge.name}</span></span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successRef ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-brand-green text-lg">Entry received!</h4>
            <p className="text-sm text-slate-500">
              Reference: <span className="font-mono font-bold text-slate-700">{successRef}</span>
            </p>
            <p className="text-xs text-slate-400">
              We've emailed you a confirmation. The CMUK team has your photo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Class group</label>
              <input
                type="text"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                maxLength={60}
                required
                placeholder="e.g. Westminster Group B"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Student number</label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                maxLength={40}
                required
                placeholder="e.g. W12345678"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Photo proof</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden"
              />

              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full max-h-56 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoBlob(null);
                      setPhotoPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-slate-200 hover:border-brand-orange/40 hover:bg-orange-50/30 rounded-lg flex flex-col items-center gap-2 transition-colors"
                >
                  <Camera className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">
                    Tap to choose or take a photo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    JPEG, PNG, WebP or HEIC · compressed automatically
                  </span>
                </button>
              )}
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed">
              By submitting, you confirm you completed this challenge. Photos are stored
              securely and shared only with the CMUK team for prize judging.
            </p>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 bg-brand-orange hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>Submit entry</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
