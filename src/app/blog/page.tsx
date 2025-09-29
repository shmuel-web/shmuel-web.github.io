
import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "Blog | My Blog",
};

export default function BlogPage() {
  return (
    <main className="max-w-2xl mx-auto w-full p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
      <p className="mt-3 text-foreground/80">Writing, notes, and ideas.</p>
      <ComingSoon />
    </main>
  );
}


