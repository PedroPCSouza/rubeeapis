import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Cena 3D do frasco Rubee Apis.
 * Frasco de vidro vinho com líquido vermelho, tampa conta-gotas,
 * gotas flutuantes e partículas douradas. Reage ao ponteiro e ao scroll.
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
    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0.25, 7.6);

    // --- Luzes ---
    scene.add(new THREE.AmbientLight(0xffe8d0, 0.5));
    const key = new THREE.DirectionalLight(0xfff2df, 2.4);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xc9a15a, 22, 20);
    rim.position.set(-5, 2.5, -3);
    scene.add(rim);
    const under = new THREE.PointLight(0xa03040, 14, 14);
    under.position.set(0.5, -4, 3);
    scene.add(under);

    // --- Frasco ---
    const bottle = new THREE.Group();

    const profile: THREE.Vector2[] = [
      new THREE.Vector2(0.001, -1.62),
      new THREE.Vector2(0.55, -1.62),
      new THREE.Vector2(0.7, -1.52),
      new THREE.Vector2(0.75, -1.1),
      new THREE.Vector2(0.76, 0.2),
      new THREE.Vector2(0.72, 0.62),
      new THREE.Vector2(0.5, 0.95),
      new THREE.Vector2(0.31, 1.1),
      new THREE.Vector2(0.29, 1.38),
      new THREE.Vector2(0.29, 1.42),
    ];
    const glassGeo = new THREE.LatheGeometry(profile, 56);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x571722,
      roughness: 0.06,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.94,
    });
    bottle.add(new THREE.Mesh(glassGeo, glassMat));

    const liquidProfile = profile.slice(1, 7).map((p) => new THREE.Vector2(p.x * 0.82, p.y * 0.92 - 0.06));
    liquidProfile.unshift(new THREE.Vector2(0.001, liquidProfile[0].y));
    liquidProfile.push(new THREE.Vector2(0.001, liquidProfile[liquidProfile.length - 1].y));
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x8e1f2e,
      emissive: 0x5c101c,
      emissiveIntensity: 0.55,
      roughness: 0.25,
    });
    bottle.add(new THREE.Mesh(new THREE.LatheGeometry(liquidProfile, 48), liquidMat));

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a15a, metalness: 1, roughness: 0.25 });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 40), goldMat);
    ring.position.y = 1.46;
    bottle.add(ring);

    const capMat = new THREE.MeshStandardMaterial({ color: 0x14090b, roughness: 0.4, metalness: 0.2 });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.6, 40), capMat);
    cap.position.y = 1.82;
    bottle.add(cap);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.27, 28, 22), capMat);
    bulb.scale.set(1, 1.3, 1);
    bulb.position.y = 2.3;
    bottle.add(bulb);

    bottle.position.y = -0.15;
    scene.add(bottle);

    // --- Gotas flutuantes ---
    const drops: THREE.Mesh[] = [];
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0xa32738,
      emissive: 0x6e1424,
      emissiveIntensity: 0.8,
      roughness: 0.15,
    });
    const dropCount = isMobile ? 4 : 7;
    for (let i = 0; i < dropCount; i++) {
      const size = 0.05 + Math.random() * 0.09;
      const drop = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 14), dropMat);
      const angle = (i / dropCount) * Math.PI * 2;
      drop.position.set(Math.cos(angle) * (1.6 + Math.random() * 1.4), (Math.random() - 0.4) * 3.2, Math.sin(angle) * 1.4 - 0.4);
      drop.userData.seed = Math.random() * 10;
      drops.push(drop);
      scene.add(drop);
    }

    // --- Partículas douradas ---
    const particleCount = isMobile ? 70 : 160;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
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
      bottle.rotation.y += (pointerX * 0.5 + t * 0.24 - bottle.rotation.y) * 0.05;
      bottle.rotation.x += (pointerY * 0.1 + scrollP * 0.3 - bottle.rotation.x) * 0.05;
      bottle.position.y = -0.15 + Math.sin(t * 0.9) * 0.09 - scrollP * 1.7;
      drops.forEach((drop, i) => {
        const seed = drop.userData.seed as number;
        drop.position.y += Math.sin(t * (0.6 + seed * 0.08) + seed) * 0.0035;
        drop.rotation.y = t * 0.4 + i;
      });
      particles.rotation.y = t * 0.02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", onResize);
    if (reduceMotion) {
      bottle.rotation.y = 0.5;
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
