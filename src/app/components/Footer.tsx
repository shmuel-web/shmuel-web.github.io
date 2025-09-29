export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/[.08] dark:border-white/[.145] py-6">
      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 flex items-center justify-center gap-6">
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4"
        >
          LinkedIn
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4"
        >
          Twitter
        </a>
        <a
          href="https://medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:underline-offset-4"
        >
          Medium
        </a>
      </div>
    </footer>
  );
}


