export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-xl font-bold">CraftCV</div>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Build Resumes That Get You Hired
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            CraftCV helps you create professional resumes with AI-guided content
            suggestions and a powerful drag-and-drop editor.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/signup"
              className="rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Building
            </a>
            <a
              href="/templates"
              className="rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent"
            >
              Browse Templates
            </a>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} CraftCV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
