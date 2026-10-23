import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import IslandNav from "./components/IslandNav";
import Loader from "./components/Loader";
import Hero from "./sections/Hero";
import Portfolio from "./sections/Portfolio";
import ProjectView from "./sections/ProjectView";
import { projects } from "./projects";

const fromHash = () => (projects[location.hash.slice(1)] ? location.hash.slice(1) : null);

export default function App() {
  const [ready, setReady] = useState(false); // hero entrance waits for the loader's reveal
  const [loading, setLoading] = useState(true);
  // open project: its id plus the window it grew out of (null for deep links)
  const [open, setOpen] = useState(null);
  // the part of the page in view, named in the top bar
  const [section, setSection] = useState("top");
  // stable callbacks: the loader's effect must not restart when App re-renders
  const reveal = useCallback(() => setReady(true), []);
  const done = useCallback(() => setLoading(false), []);

  // each project has its own #hash, so the browser's back button closes it
  const openProject = useCallback((id, origin) => {
    history.pushState({ project: id }, "", `#${id}`);
    setOpen({ id, origin });
  }, []);
  const close = useCallback(() => {
    if (history.state?.project) history.back();
    else {
      history.replaceState(null, "", location.pathname);
      setOpen(null);
    }
  }, []);
  const go = useCallback((id) => {
    history.replaceState({ project: id }, "", `#${id}`);
    setOpen({ id, origin: null });
  }, []);

  useEffect(() => {
    const onPop = () => setOpen((o) => (fromHash() ? { id: fromHash(), origin: null } : null));
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  // a shared link like /#wave opens that project once the intro has revealed the site
  useEffect(() => {
    if (ready && fromHash()) setOpen({ id: fromHash(), origin: null });
  }, [ready]);

  return (
    <main>
      <IslandNav section={section} onOpen={openProject} hidden={!ready || !!open} />
      <Hero ready={ready} onOpen={openProject} paused={!!open} onSection={setSection} />
      <Portfolio onOpen={openProject} onSection={setSection} />
      <AnimatePresence>
        {open && <ProjectView key="project" id={open.id} origin={open.origin} onClose={close} onGo={go} />}
      </AnimatePresence>
      {loading && <Loader onReveal={reveal} onDone={done} />}
    </main>
  );
}
