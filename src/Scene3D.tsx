import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Cena 3D do frasco Rubee Apis, fiel ao produto real:
 * vidro âmbar, tampa conta-gotas preta e rótulo vinho com a
 * identidade da marca desenhada em canvas e aplicada como textura.
 */

const LABEL_W = 2048;
const LABEL_H = 1024;

function drawLabel(ctx: CanvasRenderingContext2D) {
  const cx = LABEL_W / 2; // centro frontal do rótulo

  // Fundo vinho com leve gradiente
  const bg = ctx.createLinearGradient(0, 0, 0, LABEL_H);
  bg.addColorStop(0, "#5a1b26");
  bg.addColorStop(0.55, "#4b1420");
  bg.addColorStop(1, "#3a0f18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);

  // Brilho sutil no centro frontal
  const glow = ctx.createRadialGradient(cx, 420, 60, cx, 420, 640);
  glow.addColorStop(0, "rgba(255, 200, 140, 0.07)");
  glow.addColorStop(1, "rgba(255, 200, 140, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);

  // Arcos decorativos à direita
  ctx.strokeStyle = "rgba(217, 173, 100, 0.22)";
  ctx.lineWidth = 2.5;
  for (let r = 70; r <= 230; r += 40) {
    ctx.beginPath();
    ctx.arc(cx + 470, 660, r, Math.PI * 1.15, Math.PI * 1.95);
    ctx.stroke();
  }

  const cream = "#ecdcba";
  const gold = "#d9ad64";

  // Logotipo RU / BEE / APIS
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = cream;
  try { ctx.letterSpacing = "26px"; } catch { /* opcional */ }
  ctx.font = "400 132px 'DM Serif Display', Georgia, serif";
  ctx.fillText("RU", cx, 218);
  ctx.fillText("BEE", cx, 344);
  try { ctx.letterSpacing = "30px"; } catch { /* opcional */ }
  ctx.font = "600 40px 'DM Sans', Arial, sans-serif";
  ctx.fillText("APIS", cx, 448);
  try { ctx.letterSpacing = "0px"; } catch { /* opcional */ }

  // extrato de própolis
  ctx.fillStyle = gold;
  ctx.font = "italic 400 62px 'DM Serif Display', Georgia, serif";
  ctx.fillText("extrato", cx, 590);
  ctx.fillText("de própolis", cx, 662);

  // Selo "vermelha"
  const badgeW = 280;
  const badgeH = 62;
  const badgeY = 712;
  ctx.fillStyle = cream;
  ctx.beginPath();
  ctx.roundRect(cx - badgeW / 2, badgeY, badgeW, badgeH, 10);
  ctx.fill();
  ctx.fillStyle = "#4b1420";
  ctx.font = "italic 400 42px 'DM Serif Display', Georgia, serif";
  ctx.fillText("vermelha", cx, badgeY + badgeH / 2 + 2);

  // 30ml
  ctx.fillStyle = cream;
  ctx.font = "500 34px 'DM Sans', Arial, sans-serif";
  ctx.fillText("30ml", cx, 840);

  // Faixa inferior
  ctx.fillStyle = "#2c0a12";
  ctx.fillRect(0, 924, LABEL_W, LABEL_H - 924);
  ctx.fillStyle = gold;
  try { ctx.letterSpacing = "10px"; } catch { /* opcional */ }
  ctx.font = "600 30px 'DM Sans', Arial, sans-serif";
  ctx.fillText("INDÚSTRIA BRASILEIRA", cx, 974);
  try { ctx.letterSpacing = "0px"; } catch { /* opcional */ }
}

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
    scene.add(new THREE.AmbientLight(0xffe8d0, 0.65));
    const key = new THREE.DirectionalLight(0xfff2df, 2.6);
    key.position.set(4, 6, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd9ad64, 0.5);
    fill.position.set(-5, 2, 4);
    scene.add(fill);
    const rim = new THREE.PointLight(0xc9a15a, 20, 20);
    rim.position.set(-5, 2.5, -3);
    scene.add(rim);
    const under = new THREE.PointLight(0xa03040, 10, 14);
    under.position.set(0.5, -4, 3);
    scene.add(under);

    // --- Frasco (vidro âmbar, proporções de conta-gotas 30 ml) ---
    const bottle = new THREE.Group();

    const glassProfile: THREE.Vector2[] = [
      new THREE.Vector2(0.001, -1.55),
      new THREE.Vector2(0.5, -1.55),
      new THREE.Vector2(0.58, -1.5),
      new THREE.Vector2(0.6, -1.38),
      new THREE.Vector2(0.6, 0.72),
      new THREE.Vector2(0.57, 0.92),
      new THREE.Vector2(0.4, 1.1),
      new THREE.Vector2(0.27, 1.18),
      new THREE.Vector2(0.26, 1.3),
    ];
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x7a3a16, // vidro âmbar
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.96,
    });
    bottle.add(new THREE.Mesh(new THREE.LatheGeometry(glassProfile, 64), glassMat));

    // Líquido vermelho-escuro visível através do ombro
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x6e1a22,
      emissive: 0x400d14,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.15, 48), liquidMat);
    liquid.position.y = -0.4;
    bottle.add(liquid);

    // --- Rótulo (textura canvas fiel ao produto) ---
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = LABEL_W;
    labelCanvas.height = LABEL_H;
    const labelCtx = labelCanvas.getContext("2d");
    if (labelCtx) drawLabel(labelCtx);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // Redesenha quando as fontes da página terminarem de carregar
    if (document.fonts && labelCtx) {
      document.fonts.ready.then(() => {
        drawLabel(labelCtx);
        labelTexture.needsUpdate = true;
      });
    }
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.55,
      metalness: 0.05,
    });
    const label = new THREE.Mesh(new THREE.CylinderGeometry(0.615, 0.615, 1.98, 64, 1, true), labelMat);
    label.position.y = -0.36;
    label.rotation.y = Math.PI; // centro do rótulo de frente para a câmera
    bottle.add(label);

    // --- Tampa conta-gotas preta ---
    const capMat = new THREE.MeshStandardMaterial({ color: 0x121012, roughness: 0.5, metalness: 0.15 });
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 48), capMat);
    collar.position.y = 1.52;
    bottle.add(collar);
    const bulbBody = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.42, 40), capMat);
    bulbBody.position.y = 1.98;
    bottle.add(bulbBody);
    const bulbTop = new THREE.Mesh(new THREE.SphereGeometry(0.26, 28, 20), capMat);
    bulbTop.position.y = 2.19;
    bottle.add(bulbTop);

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
      // Oscila em vez de girar: o rótulo permanece legível
      const targetY = Math.sin(t * 0.35) * 0.45 + pointerX * 0.5;
      bottle.rotation.y += (targetY - bottle.rotation.y) * 0.05;
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
      labelTexture.dispose();
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
