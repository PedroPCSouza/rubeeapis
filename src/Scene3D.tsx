import { useEffect, useRef } from "react";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Ambientação 3D do hero, desenhada a partir da identidade Rubee Apis:
 * — favos hexagonais dourados (a colmeia por trás da própolis);
 * — gotas de própolis vermelha em formato real de gota, com material de resina;
 * — pólen dourado em suspensão (shader com deriva ascendente e cintilação);
 * — feixes de luz de manhã, ecoando o "6h47, antes do café" da narrativa.
 * O produto em si é a foto real, renderizada em HTML sobre a cena.
 */

const GOLD = new THREE.Color(0xc9a15a);
const GOLD_LIGHT = new THREE.Color(0xe2c98f);

/** Contorno de célula de favo (hexágono vazado, pointy-top). */
function hexOutlineGeometry(outer: number, thickness: number) {
  const shape = new THREE.Shape();
  const hole = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const xo = Math.cos(a) * outer;
    const yo = Math.sin(a) * outer;
    const xi = Math.cos(a) * (outer - thickness);
    const yi = Math.sin(a) * (outer - thickness);
    if (i === 0) {
      shape.moveTo(xo, yo);
      hole.moveTo(xi, yi);
    } else {
      shape.lineTo(xo, yo);
      hole.lineTo(xi, yi);
    }
  }
  shape.closePath();
  hole.closePath();
  shape.holes.push(hole);
  return new THREE.ShapeGeometry(shape);
}

/** Hexágono preenchido — célula "operculada" do favo. */
function hexFillGeometry(outer: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const x = Math.cos(a) * outer;
    const y = Math.sin(a) * outer;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

/** Gota de própolis: perfil de lágrima revolucionado (base redonda, ápice fino). */
function dropGeometry(radius: number) {
  const points: THREE.Vector2[] = [];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI;
    const r = Math.sin(angle) * Math.pow(Math.sin(angle / 2) || 0.0001, 0.55);
    points.push(new THREE.Vector2(r * radius, -Math.cos(angle) * radius * 1.4));
  }
  return new THREE.LatheGeometry(points, 36);
}

const pollenVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute float aAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vAlpha;
  void main() {
    vSeed = aSeed;
    vAlpha = aAlpha;
    vec3 p = position;
    float rise = uTime * (0.055 + fract(aSeed * 7.13) * 0.075);
    p.y = mod(position.y + 4.6 + rise, 9.2) - 4.6;
    p.x += sin(uTime * 0.16 + aSeed * 12.6) * 0.28;
    p.z += cos(uTime * 0.11 + aSeed * 9.4) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (6.4 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const pollenFragment = /* glsl */ `
  uniform float uTime;
  varying float vSeed;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.5 + vSeed * 1.3) + vSeed * 41.0);
    float core = pow(smoothstep(0.5, 0.0, d), 1.9);
    vec3 warm = mix(vec3(0.79, 0.63, 0.35), vec3(0.91, 0.81, 0.58), fract(vSeed * 3.7));
    gl_FragColor = vec4(warm, core * twinkle * vAlpha);
  }
`;

const shaftVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shaftFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float edge = smoothstep(0.0, 0.42, vUv.x) * smoothstep(1.0, 0.58, vUv.x);
    float fall = smoothstep(0.05, 0.9, vUv.y);
    gl_FragColor = vec4(uColor, edge * fall * uOpacity);
  }
`;

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 760;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 60);
    camera.position.set(0, 0, 8);

    // Ambiente de estúdio para reflexos suaves na resina das gotas.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // --- Luz de manhã: quente vindo do alto-esquerdo, contorno vinho à direita ---
    scene.add(new THREE.AmbientLight(0xffe8d0, 0.3));
    scene.add(new THREE.HemisphereLight(0xf2d79b, 0x26070e, 0.55));
    const key = new THREE.DirectionalLight(0xffedd2, 1.05);
    key.position.set(-4, 6, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xb95542, 7, 16);
    rim.position.set(4.5, 1.2, -2);
    scene.add(rim);

    // --- Favos: clusters de células hexagonais douradas em profundidade ---
    type Cell = { mesh: THREE.Mesh; material: THREE.MeshBasicMaterial; baseOpacity: number; seed: number };
    const cells: Cell[] = [];
    const honeycombGroups: THREE.Group[] = [];
    const hexR = 0.62;
    const neighborOffsets: Array<[number, number]> = [
      [0, 0],
      [Math.sqrt(3) * hexR, 0], [-Math.sqrt(3) * hexR, 0],
      [(Math.sqrt(3) / 2) * hexR, 1.5 * hexR], [(Math.sqrt(3) / 2) * hexR, -1.5 * hexR],
      [-(Math.sqrt(3) / 2) * hexR, 1.5 * hexR], [-(Math.sqrt(3) / 2) * hexR, -1.5 * hexR],
      [Math.sqrt(3) * hexR, 1.5 * hexR], [Math.sqrt(3) * 1.5 * hexR, 0.75 * hexR],
      [-Math.sqrt(3) * hexR, -1.5 * hexR],
    ];
    const outlineGeo = hexOutlineGeometry(hexR * 0.94, 0.028);
    const fillGeo = hexFillGeometry(hexR * 0.82);

    function buildHoneycomb(
      position: [number, number, number],
      rotation: [number, number, number],
      cellCount: number,
      opacityScale: number,
      filledIndices: number[]
    ) {
      const group = new THREE.Group();
      for (let i = 0; i < Math.min(cellCount, neighborOffsets.length); i++) {
        const [cx, cy] = neighborOffsets[i];
        const depthFade = 1 - i * 0.055;
        const material = new THREE.MeshBasicMaterial({
          color: i % 3 === 0 ? GOLD_LIGHT : GOLD,
          transparent: true,
          opacity: 0.16 * depthFade * opacityScale,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const cell = new THREE.Mesh(outlineGeo, material);
        cell.position.set(cx, cy, -i * 0.045);
        group.add(cell);
        cells.push({ mesh: cell, material, baseOpacity: material.opacity, seed: i * 1.37 + position[0] });

        if (filledIndices.includes(i)) {
          const fillMaterial = new THREE.MeshBasicMaterial({
            color: GOLD,
            transparent: true,
            opacity: 0.03 * opacityScale,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          const fill = new THREE.Mesh(fillGeo, fillMaterial);
          fill.position.set(cx, cy, -i * 0.045 - 0.01);
          group.add(fill);
          cells.push({ mesh: fill, material: fillMaterial, baseOpacity: fillMaterial.opacity, seed: i * 2.11 + 5 });
        }
      }
      group.position.set(...position);
      group.rotation.set(...rotation);
      scene.add(group);
      honeycombGroups.push(group);
      return group;
    }

    buildHoneycomb([3.55, 0.35, -2.6], [0.08, -0.38, 0.06], isMobile ? 7 : 10, 1, [0, 3]);
    if (!isMobile) buildHoneycomb([-4.9, -2.1, -3.6], [-0.05, 0.42, -0.1], 7, 0.55, [1]);

    // --- Gotas de própolis vermelha (lágrimas de resina) ---
    const drops: THREE.Mesh[] = [];
    const dropMat = new THREE.MeshPhysicalMaterial({
      color: 0x7e1f2c,
      emissive: 0x36060d,
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.0,
      transmission: 0.35,
      thickness: 0.6,
      ior: 1.45,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.15,
    });
    const dropAnchors: Array<[number, number, number]> = [
      [-5.1, 2.3, -1.2], [5.2, 2.5, -1.9], [-5.4, -2.5, -0.8],
      [4.9, -2.3, -1.4], [2.6, 3.1, -3.1], [-2.6, -3.2, -2.4],
    ];
    const dropCount = isMobile ? 3 : 6;
    for (let i = 0; i < dropCount; i++) {
      const size = 0.11 + (i % 3) * 0.045;
      const drop = new THREE.Mesh(dropGeometry(size), dropMat);
      const [x, y, z] = dropAnchors[i];
      drop.position.set(x, y, z);
      drop.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.08;
      drop.userData = { seed: i * 1.73 + 0.5, baseX: x, baseY: y, baseScale: 1 };
      drops.push(drop);
      scene.add(drop);
    }

    // --- Pólen dourado em suspensão (shader) ---
    const pollenCount = isMobile ? 70 : 170;
    const positions = new Float32Array(pollenCount * 3);
    const sizes = new Float32Array(pollenCount);
    const seeds = new Float32Array(pollenCount);
    const alphas = new Float32Array(pollenCount);
    for (let i = 0; i < pollenCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      const isBokeh = Math.random() < 0.08;
      sizes[i] = isBokeh ? 9 + Math.random() * 8 : 1.6 + Math.random() * 3.4;
      alphas[i] = isBokeh ? 0.1 : 0.5 + Math.random() * 0.4;
      seeds[i] = Math.random();
    }
    const pollenGeo = new THREE.BufferGeometry();
    pollenGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pollenGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pollenGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    pollenGeo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    const pollenMat = new THREE.ShaderMaterial({
      vertexShader: pollenVertex,
      fragmentShader: pollenFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pollen = new THREE.Points(pollenGeo, pollenMat);
    scene.add(pollen);

    // --- Feixes de luz de manhã ---
    const shafts: THREE.Mesh[] = [];
    const shaftGeo = new THREE.PlaneGeometry(1.7, 7.5);
    const shaftConfigs: Array<{ pos: [number, number, number]; rotZ: number; opacity: number }> = isMobile
      ? [{ pos: [-2.4, 1.6, -3.4], rotZ: -0.5, opacity: 0.055 }]
      : [
          { pos: [-3.4, 1.8, -3.4], rotZ: -0.52, opacity: 0.06 },
          { pos: [-1.6, 2.1, -4.2], rotZ: -0.44, opacity: 0.038 },
        ];
    shaftConfigs.forEach((config, i) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: shaftVertex,
        fragmentShader: shaftFragment,
        uniforms: {
          uColor: { value: GOLD_LIGHT.clone() },
          uOpacity: { value: config.opacity },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const shaft = new THREE.Mesh(shaftGeo, material);
      shaft.position.set(...config.pos);
      shaft.rotation.z = config.rotZ;
      shaft.userData = { baseRotZ: config.rotZ, baseOpacity: config.opacity, seed: i * 2.4 };
      shafts.push(shaft);
      scene.add(shaft);
    });

    // --- Interação: parallax de ponteiro, respiração autônoma e fade no scroll ---
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
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Cena fora de vista (hero rolado): pula o render, mantém o loop leve.
      if (scrollP >= 1.05) return;

      // Parallax de câmera com deriva autônoma (viva mesmo sem ponteiro).
      const driftX = Math.sin(t * 0.1) * 0.12;
      const driftY = Math.cos(t * 0.08) * 0.08;
      camera.position.x += (pointerX * 0.6 + driftX - camera.position.x) * 0.04;
      camera.position.y += (-pointerY * 0.4 + driftY - scrollP * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, -scrollP * 1.2, 0);

      drops.forEach((drop, i) => {
        const { seed, baseX, baseY } = drop.userData as { seed: number; baseX: number; baseY: number };
        drop.position.y = baseY + Math.sin(t * 0.3 + seed) * 0.12;
        drop.position.x = baseX + Math.cos(t * 0.2 + seed) * 0.06;
        drop.rotation.y = t * 0.22 + i;
        const breathe = 1 + Math.sin(t * 0.55 + seed * 2) * 0.03;
        drop.scale.set(breathe, 1 / breathe, breathe);
      });

      cells.forEach((cell) => {
        cell.material.opacity = cell.baseOpacity * (0.72 + 0.28 * Math.sin(t * 0.4 + cell.seed));
      });
      honeycombGroups.forEach((group, i) => {
        group.rotation.z = Math.sin(t * 0.1 + i * 1.8) * 0.04;
        group.position.y += Math.sin(t * 0.22 + i * 2.6) * 0.0008;
      });

      shafts.forEach((shaft) => {
        const { baseRotZ, baseOpacity, seed } = shaft.userData as { baseRotZ: number; baseOpacity: number; seed: number };
        shaft.rotation.z = baseRotZ + Math.sin(t * 0.12 + seed) * 0.02;
        (shaft.material as THREE.ShaderMaterial).uniforms.uOpacity.value =
          baseOpacity * (0.8 + 0.2 * Math.sin(t * 0.18 + seed * 3));
      });

      pollenMat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", onResize);
    if (reduceMotion) {
      pollenMat.uniforms.uTime.value = 12;
      renderer.render(scene, camera);
      window.addEventListener("scroll", onScroll, { passive: true });
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
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="scene3d" ref={mountRef} aria-hidden="true" />;
}
