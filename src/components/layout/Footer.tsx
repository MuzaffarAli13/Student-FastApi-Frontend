
import { GraduationCap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <GraduationCap className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left text-muted-foreground">
            &copy; {year} StudentVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
