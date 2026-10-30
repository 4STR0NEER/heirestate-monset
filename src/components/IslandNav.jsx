import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Logo, { Mark } from "@/components/Logo";
import { inPlace, siteUrl } from "@/lib/links";
import { order, projects } from "@/projects";

const SPRING = { type: "spring", duration: 0.55, bounce: 0.18 };

// The top bar. At the top of the page it is an open row over the hero's film; once you scroll it
// gathers into a floating navy island (after the Dynamic Island idea: Skiper UI skiper02,
// VengeanceUI notch-navbar) that stays on screen, names the section you are in, and grows
// into a project menu. Motion's layout animation does the morphing between the two.
export default function IslandNav({ section, onOpen, hidden }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const nav = useRef(null);
  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
    setMenu(false);
  });
  const island = scrolled || menu;

  useEffect(() => {
    if (!menu) return;
    const onKey = (e) => e.key === "Escape" && setMenu(false);
    const onDown = (e) => !nav.current?.contains(e.target) && setMenu(false);
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  const current = projects[section];
  const link = "font-inscription rounded-full px-4 py-2 text-[0.7rem] tracking-[0.26em] uppercase transition-colors duration-200";

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:pt-4"
      initial={{ opacity: 0, transform: "translateY(-12px)" }}
      animate={hidden ? { opacity: 0, transform: "translateY(-12px)" } : { opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.nav
        ref={nav}
        layout
        aria-label="Main"
        transition={SPRING}
        style={{ borderRadius: menu ? 26 : 999 }}
        className={`overflow-hidden ${hidden ? "" : "pointer-events-auto"} ${
          island ? "bg-ink text-paper shadow-[0_18px_40px_-18px_rgb(20_33_58/0.55)]" : "w-full max-w-[1480px] text-paper"
        }`}
      >
        <motion.div layout="position" transition={SPRING} className={`flex items-center gap-2 ${island ? "py-1.5 pr-1.5 pl-4" : "justify-between px-[clamp(4px,2.4vw,36px)] py-2"}`}>
          <motion.a layout="position" href="#top" aria-label="Heir Estates, back to top" className="flex items-center gap-3 py-1">
            {island ? (
              <>
                <Mark className="h-6 w-auto text-paper" />
                <span className="font-inscription hidden text-[0.72rem] tracking-[0.32em] sm:inline">HEIR ESTATES</span>
              </>
            ) : (
              <Logo className="text-paper *:last:hidden sm:*:last:inline" />
            )}
          </motion.a>

          {/* where you are on the page, with that project's colour */}
          <AnimatePresence mode="popLayout" initial={false}>
            {island && !menu && (
              <motion.span
                key={section}
                layout="position"
                className="font-inscription hidden items-center gap-2 border-l border-paper/20 pr-2 pl-4 text-[0.68rem] tracking-[0.24em] whitespace-nowrap text-champagne uppercase md:flex"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <span className="size-1.5 rounded-full ring-1 ring-paper/70" style={{ background: current?.accent ?? "var(--color-gold)" }} />
                {current?.name ?? "The collection"}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.div layout="position" className="flex items-center gap-1">
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="project-menu"
              onClick={() => setMenu((m) => !m)}
              className={`${link} flex items-center gap-2 hover:bg-paper/10`}
            >
              Projects
              <svg viewBox="0 0 10 6" className={`w-2.5 transition-transform duration-300 ${menu ? "rotate-180" : ""}`} aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <a href="#portfolio" className={`${link} hidden md:block hover:bg-paper/10`}>
              Portfolio
            </a>
            <a href="#agents" className={`${link} hidden lg:block hover:bg-paper/10`}>
              Agents
            </a>
            <a href="#enquiry" className={`${link} bg-gold text-ink hover:bg-champagne`}>
              Enquire
            </a>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {menu && (
            <motion.div
              id="project-menu"
              key="menu"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 0.35, delay: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="w-[min(92vw,640px)] px-3 pb-3"
            >
              <ul className="grid gap-2 sm:grid-cols-3">
                {order.map((id) => (
                  <li key={id}>
                    <a
                      href={siteUrl(id)}
                      onClick={inPlace((e) => {
                        setMenu(false);
                        onOpen(id, e.currentTarget.querySelector("img").getBoundingClientRect());
                      })}
                      className="group flex w-full items-center gap-3 rounded-[18px] p-1.5 text-left transition-colors duration-200 hover:bg-paper/8 sm:block"
                    >
                      <span className="relative block w-24 shrink-0 overflow-hidden rounded-[13px] sm:w-auto">
                        <img src={`${projects[id].panel}.jpg`} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <span className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to top, ${projects[id].accent}, transparent)` }} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 px-1 sm:mt-2.5">
                        <span className="size-1.5 rounded-full ring-1 ring-paper/70" style={{ background: projects[id].accent }} />
                        <span className="font-display text-[1.05rem]">{projects[id].name}</span>
                      </span>
                      <span className="font-inscription mt-0.5 block px-1 pb-1 text-[0.6rem] tracking-[0.22em] text-champagne/75 uppercase">{projects[id].tagline}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="font-inscription mt-1 flex items-center gap-3 border-t border-paper/15 px-2 pt-3 text-[0.62rem] tracking-[0.24em] text-champagne/70 uppercase">
                <span className="size-1.5 rounded-full bg-gold" />
                Two more projects forthcoming
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
