import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <div className="text-7xl font-black text-indigo-600">404</div>
      <h1 className="mt-4 text-3xl font-black">Page not found</h1>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
      >
        Back Home
      </Link>
    </section>
  );
}
