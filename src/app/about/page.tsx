import ComingSoon from "../components/ComingSoon";

export const metadata = {
  title: "About | My Blog",
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto w-full p-8 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-bold">About</h1>
      <p className="mt-3 text-foreground/80">
        This is a Next.js blog. Learn more about me here soon.
      </p>
      <ComingSoon />
    </main>
  );
}


