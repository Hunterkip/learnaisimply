export function Footer() {
  return (
    <footer className="bg-foreground text-background py-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="font-semibold text-lg mb-2">
            AI for Adults 40+
          </p>
          <p className="text-background/70 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
