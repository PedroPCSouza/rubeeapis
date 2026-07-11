import { useEffect, useRef } from "react";

import * as THREE from "three";

/**
 * Ambientação 3D do hero: partículas douradas em profundidade,
 * gotas de própolis flutuando e parallax de câmera com o ponteiro.
 * O produto em si é a foto real, renderizada em HTML sobre a cena.
 */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 760;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0, 8);

    // --- Luzes ---
    scene.add(new THREE.AmbientLight(0xffe8d0, 0.38));
    scene.add(new THREE.HemisphereLight(0xf2d79b, 0x26070e, 0.72));
    const key = new THREE.DirectionalLight(0xfff2df, 1.15);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xb95542, 9, 18);
    rim.position.set(4.5, 1.5, -2);
    scene.add(rim);

    // --- Gotas de própolis flutuando em profundidade ---
    const drops: THREE.Mesh[] = [];
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x8f2430,
      emissive: 0x3d080f,
      emissiveIntensity: 0.32,
      roughness: 0.24,
      metalness: 0.02,
      transmission: 0.08,
      transparent: true,
      opacity: 0.78,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
    });
    const dropCount = isMobile ? 3 : 7;
    const dropAnchors = [
      [-5.1, 2.3, -1.2], [5.15, 2.15, -1.8], [-5.35, -2.55, -0.8],
      [4.85, -2.35, -1.4], [2.7, 3.05, -3.1], [-2.55, -3.15, -2.4], [5.7, 0.1, -3.6],
    ];
    for (let i = 0; i < dropCount; i++) {
      const size = 0.085 + (i % 3) * 0.035;
      const drop = new THREE.Mesh(new THREE.SphereGeometry(size, 24, 18), dropMat);
      const [x, y, z] = dropAnchors[i];
      drop.position.set(x, y, z);
      drop.scale.set(0.82, 1.28, 0.82);
      drop.userData.seed = i * 1.73 + 0.5;
      drop.userData.baseX = x;
      drop.userData.baseY = y;
      drops.push(drop);
      scene.add(drop);
    }

    // --- Bolhas douradas suaves (bokeh) ---
    const bokehs: THREE.Mesh[] = [];
    const bokehMat = new THREE.MeshBasicMaterial({
      color: 0xc9a15a,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bokehCount = isMobile ? 2 : 5;
    for (let i = 0; i < bokehCount; i++) {
      const bokeh = new THREE.Mesh(new THREE.SphereGeometry(0.28 + i * 0.12, 20, 16), bokehMat);
      const side = i % 2 === 0 ? 1 : -1;
      bokeh.position.set(side * (4.1 + i * 0.25), 2.6 - i * 1.25, -3.5 - i * 0.35);
      bokeh.userData.seed = i * 1.31;
      bokeh.userData.baseY = bokeh.position.y;
      bokehs.push(bokeh);
      scene.add(bokeh);
    }

    // Arcos finos repetem as curvas do rótulo e conectam a cena à identidade visual.
    const arcs = new THREE.Group();
    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8b56d,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    [-0.24, 0, 0.24].forEach((offset, index) => {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(1.55 + index * 0.22, 0.008, 8, 100, Math.PI * 1.2), arcMaterial);
      arc.position.set(2.25, -0.15 + offset, -2.8 - index * 0.18);
      arc.rotation.set(1.38, 0.15, -0.62);
      arcs.add(arc);
    });
    scene.add(arcs);

    // --- Partículas douradas ---
    const particleCount = isMobile ? 48 : 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: 0xe2c98f,
        size: 0.022,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
    );
    scene.add(particles);

    // --- Interação ---
    let pointerX = 0;
    let pointerY = 0;
    let scrollP = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollP = Math.min(window.scrollY / Math.max(window.innerHeight * 0.9, 1), 1.4);
      mount.style.opacity = String(Math.max(0, 1 - scrollP * 1.05));
    };
    const onResize = () => {
      const { clientWidth, clientHeight } = mount;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      if (reduceMotion) renderer.render(scene, camera);
    };

    const tick = () => {
      const t = clock.getElapsedTime();
      // Parallax de câmera: profundidade sutil seguindo o ponteiro
      camera.position.x += (pointerX * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-pointerY * 0.4 - scrollP * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, -scrollP * 1.2, 0);
      drops.forEach((drop, i) => {
        const seed = drop.userData.seed as number;
        drop.position.y = (drop.userData.baseY as number) + Math.sin(t * 0.32 + seed) * 0.11;
        drop.position.x = (drop.userData.baseX as number) + Math.cos(t * 0.22 + seed) * 0.06;
        drop.rotation.y = t * 0.18 + i;
      });
      bokehs.forEach((bokeh) => {
        const seed = bokeh.userData.seed as number;
        bokeh.position.y = (bokeh.userData.baseY as number) + Math.sin(t * 0.18 + seed) * 0.08;
      });
      particles.rotation.y = t * 0.012;
      arcs.rotation.z = Math.sin(t * 0.16) * 0.025;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", onResize);
    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="scene3d" ref={mountRef} aria-hidden="true" />;
}
