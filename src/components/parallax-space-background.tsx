import { useEffect, useRef } from "react";

const planets = [
  { className: "planet planet-ember planet-depth-far", label: "Distant rust planet" },
  { className: "planet planet-azure planet-depth-mid", label: "Blue shadow planet" },
  { className: "planet planet-violet planet-ringed planet-depth-near", label: "Ringed violet planet" },
  { className: "planet planet-rose planet-depth-far", label: "Distant rose planet" },
  { className: "planet planet-ice planet-ringed planet-depth-mid", label: "Ringed ice planet" },
  { className: "planet planet-eclipse planet-depth-near", label: "Eclipsed planet" },
  { className: "planet planet-moon planet-depth-far", label: "Small cratered moon" },
] as const;

export function ParallaxSpaceBackground() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;
      scene.style.setProperty("--parallax-x", currentX.toFixed(3));
      scene.style.setProperty("--parallax-y", currentY.toFixed(3));

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * -2;
      targetY = (event.clientY / window.innerHeight - 0.5) * -2;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sceneRef} className="space-environment" aria-hidden="true">
      <div className="space-layer nebula-layer">
        <div className="nebula-glow nebula-glow-one" />
        <div className="nebula-glow nebula-glow-two" />
        <div className="nebula-glow nebula-glow-three" />
      </div>
      <div className="space-layer far-star-layer">
        <div className="star-map star-map-far" />
      </div>
      <div className="space-layer mid-star-layer">
        <div className="star-map star-map-mid" />
      </div>
      <div className="space-layer near-star-layer">
        <div className="star-map star-map-near" />
      </div>
      <div className="planetarium">
        {planets.map((planet) => (
          <div key={planet.label} className={planet.className}>
            <span className="planet-surface" />
            {planet.className.includes("planet-ringed") && <span className="planet-ring" />}
          </div>
        ))}
      </div>
      <div className="film-grain" />
    </div>
  );
}