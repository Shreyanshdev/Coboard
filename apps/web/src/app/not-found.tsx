import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#dedcd9] text-[#27221e] p-4 text-center">
      <h2 className="text-4xl font-extrabold text-[#382f28] mb-2">404 - Page Not Found</h2>
      <p className="text-[#5a4d42] mb-6 max-w-md">
        The whiteboard room or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
