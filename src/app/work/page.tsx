
import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "Work | My Blog",
};

export default function WorkPage() {
  return (
    <main className="max-w-2xl mx-auto w-full p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold">Work</h1>
      <p className="mt-3 text-foreground/80">A collection of my work and projects.</p>
      <ComingSoon />
    </main>
  );
}


