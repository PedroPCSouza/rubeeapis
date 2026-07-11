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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0, 8);

    // --- Luzes ---
    scene.add(new THREE.AmbientLight(0xffe8d0, 0.7));
    const key = new THREE.DirectionalLight(0xfff2df, 1.8);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xc9a15a, 16, 22);
    rim.position.set(-5, 2.5, -3);
    scene.add(rim);

    // --- Gotas de própolis flutuando em profundidade ---
    const drops: THREE.Mesh[] = [];
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0xa32738,
      emissive: 0x6e1424,
      emissiveIntensity: 0.8,
      roughness: 0.15,
    });
    const dropCount = isMobile ? 5 : 10;
    for (let i = 0; i < dropCount; i++) {
      const size = 0.04 + Math.random() * 0.1;
      const drop = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 14), dropMat);
      const angle = (i / dropCount) * Math.PI * 2 + Math.random();
      drop.position.set(
        Math.cos(angle) * (2 + Math.random() * 3),
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 0.5
      );
      drop.userData.seed = Math.random() * 10;
      drops.push(drop);
      scene.add(drop);
    }

    // --- Bolhas douradas suaves (bokeh) ---
    const bokehs: THREE.Mesh[] = [];
    const bokehMat = new THREE.MeshBasicMaterial({
      color: 0xc9a15a,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bokehCount = isMobile ? 4 : 8;
    for (let i = 0; i < bokehCount; i++) {
      const bokeh = new THREE.Mesh(new THREE.SphereGeometry(0.35 + Math.random() * 0.7, 20, 16), bokehMat);
      bokeh.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, -2 - Math.random() * 4);
      bokeh.userData.seed = Math.random() * 10;
      bokehs.push(bokeh);
      scene.add(bokeh);
    }

    // --- Partículas douradas ---
    const particleCount = isMobile ? 90 : 220;
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
        size: 0.035,
        transparent: true,
        opacity: 0.75,
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
        drop.position.y += Math.sin(t * (0.5 + seed * 0.08) + seed) * 0.004;
        drop.position.x += Math.cos(t * 0.3 + seed) * 0.0015;
        drop.rotation.y = t * 0.4 + i;
      });
      bokehs.forEach((bokeh) => {
        const seed = bokeh.userData.seed as number;
        bokeh.position.y += Math.sin(t * 0.25 + seed) * 0.002;
      });
      particles.rotation.y = t * 0.02;
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
