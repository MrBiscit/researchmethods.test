import { BookOpenText } from "lucide-react";
import type { ReactNode } from "react";

export function StudyHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex min-h-14 max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenText className="size-4" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="font-serif text-[0.95rem] font-semibold">Reading Comprehension Study</p>
            <p className="eyebrow hidden sm:block">Research session</p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}
