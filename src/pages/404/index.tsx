import { Link } from "@tanstack/react-router";
// Using an existing placeholder asset from public

export const Page404 = () => {
  return (
    <div className="grid gap-4 md:flex md:min-h-[60vh] md:items-center">
      <div className="text-center">
        <img width={400} src="/placeholder.svg" alt="404" loading="lazy" decoding="async" />
        <a href="https://stories.freepik.com/web" className="text-xs">
          Illustration by Freepik Stories
        </a>
      </div>

      <div className="text-center md:text-start">
        <h1 className="text-3xl">Page not Found</h1>

        <div className="grid gap-2">
          <p>It&apos;s Okay!</p>
          <div>
            <Link to="/">Let&apos;s Head Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};