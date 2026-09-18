import type { MouseEvent } from "react";

export function smoothScrollTo(id: string) {
  return (event: MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
