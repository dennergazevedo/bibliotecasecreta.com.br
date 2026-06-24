"use client";

import { useState, useRef, useEffect } from "react";

type Project = {
  id: string;
  label: string;
  url: string;
  description: string;
};

const t = {
  bar: "bg-white/95 border-zinc-200/80",
  dot: "bg-zinc-300",
  breadcrumbRoot: "text-zinc-400 hover:text-zinc-700",
  breadcrumbSep: "text-zinc-300",
  breadcrumbCurrent: "text-zinc-700",
  button: "text-zinc-400 hover:text-zinc-700",
  dropdown: "bg-white border-zinc-200 shadow-zinc-200/60",
  itemDefault: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
  itemCurrent: "bg-zinc-100 text-zinc-900",
  itemDotTop: "bg-zinc-400 group-hover:bg-zinc-600",
  itemDotRest: "bg-zinc-300 group-hover:bg-zinc-400",
  itemDesc: "text-zinc-400 group-hover:text-zinc-500",
  footer: "border-zinc-200/80 text-zinc-400"
};

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProject = projects.find(
    (p) => p.id === "bibliotecasecreta.com.br"
  );

  useEffect(() => {
    fetch("https://dnnr.dev/projects.json")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className={`sticky top-0 right-0 left-0 z-[9999] flex h-8 items-center justify-between border-b px-3 backdrop-blur-md select-none ${t.bar}`}
    >
      <a
        href="https://bibliotecasecreta.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors ${t.breadcrumbRoot}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full ${t.dot}`}
        />
        <span>dnnr</span>
        {currentProject && (
          <>
            <span className={t.breadcrumbSep}>/</span>
            <span className={t.breadcrumbCurrent}>{currentProject.label}</span>
          </>
        )}
      </a>

      <div ref={containerRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={`flex h-8 cursor-pointer items-center gap-1 px-2 font-mono text-[11px] transition-colors ${t.button}`}
        >
          <span>projetos</span>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            aria-hidden="true"
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M1.5 3.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            className={`absolute top-full right-0 mt-1 w-68 overflow-hidden rounded-lg border shadow-2xl ${t.dropdown}`}
          >
            <div className="p-1">
              {projects.map((project, index) => {
                const isCurrent = project.id === "bibliotecasecreta.com.br";
                const isTop = index < 3;
                return (
                  <a
                    key={project.id}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors ${
                      isCurrent ? t.itemCurrent : t.itemDefault
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
                        isCurrent
                          ? "bg-emerald-500"
                          : isTop
                            ? t.itemDotTop
                            : t.itemDotRest
                      }`}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-mono text-[11px] leading-tight">
                        {project.label}
                      </span>
                      <span
                        className={`truncate text-[10px] leading-tight transition-colors ${t.itemDesc}`}
                      >
                        {project.description}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="flex-shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-500/70">
                        atual
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            <div className={`border-t px-3 py-2 ${t.footer}`}>
              <span className="font-mono text-[10px]">dnnr.dev — projetos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
