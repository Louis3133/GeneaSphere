<script setup lang="ts">
import * as THREE from "three";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const route = useRoute();
const treeId = route.params.id;
const graphContainer = ref<HTMLElement | null>(null);
const membersList = ref<any[]>([]);
const drawer = ref<HTMLInputElement | null>(null);
const selectedMember = ref<any>(null);
const isLoading = ref(true);
const autoRotate = ref(false);
let autoRotateFrame: number | null = null;
const pageLink = ref("");
async function copyPaste() {
  try {
    await navigator.clipboard.writeText(pageLink.value);
  }
  catch (err) {
    console.error("Erreur lors de la copie :", err);
  }
}

function isDead(date: any) {
  if (!date)
    return false;
  if (date === "null" || date === "undefined")
    return false;
  if (typeof date === "string" && date.startsWith("1970"))
    return false;
  return true;
}

const { data: treeData, pending } = await useFetch<any>(`/api/threes/${treeId}`);

watch(treeData, (newData) => {
  if (newData && newData.members) {
    membersList.value = newData.members;
  }
}, { immediate: true });

const rootMemberIds = computed(() => {
  return new Set(
    membersList.value
      .filter(m => !m.parent1 && !m.parent2)
      .map(m => m.id),
  );
});

const graphData = computed(() => {
  const nodes = [];
  const links = [];
  const unionNodesCreated = new Set();

  if (!membersList.value.length)
    return { nodes: [], links: [] };

  for (const memberItem of membersList.value) {
    const isRoot = rootMemberIds.value.has(memberItem.id);
    let nodeColor = "#5C3310";
    if (isDead(memberItem.deathDate))
      nodeColor = "#3d2208";
    else if (memberItem.isAdopted)
      nodeColor = "#7a4a1e";

    nodes.push({
      id: memberItem.id,
      name: memberItem.name,
      color: nodeColor,
      isUser: true,
      isRoot,
    });

    if (memberItem.unions && memberItem.unions.length > 0) {
      for (const union of memberItem.unions) {
        if (union.partner) {
          const p1 = Math.min(memberItem.id, union.partner);
          const p2 = Math.max(memberItem.id, union.partner);
          const unionId = `union_${p1}_${p2}`;
          if (!unionNodesCreated.has(unionId)) {
            nodes.push({ id: unionId, name: union.status, color: "#8B6240", val: 0.3 });
            links.push({ source: p1, target: unionId, isUnion: true });
            links.push({ source: p2, target: unionId, isUnion: true });
            unionNodesCreated.add(unionId);
          }
        }
      }
    }
  }

  for (const memberItem of membersList.value) {
    if (memberItem.parent1 && memberItem.parent2) {
      const p1 = Math.min(memberItem.parent1, memberItem.parent2);
      const p2 = Math.max(memberItem.parent1, memberItem.parent2);
      const unionId = `union_${p1}_${p2}`;
      if (!unionNodesCreated.has(unionId)) {
        nodes.push({ id: unionId, name: "Union", color: "#8B6240", val: 0.3 });
        links.push({ source: p1, target: unionId, isUnion: true });
        links.push({ source: p2, target: unionId, isUnion: true });
        unionNodesCreated.add(unionId);
      }
      links.push({ source: unionId, target: memberItem.id, isUnion: false });
    }
    else {
      if (memberItem.parent1)
        links.push({ source: memberItem.parent1, target: memberItem.id, isUnion: false });
      if (memberItem.parent2)
        links.push({ source: memberItem.parent2, target: memberItem.id, isUnion: false });
    }
  }

  return { nodes, links };
});

let myGraphInstance: any = null;
const orbitTarget = new THREE.Vector3(0, 0, 0);

function makeRng(seed: number) {
  return (n: number) => {
    const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
}

const BASE_RADIUS_MAIN = 4.2;
const BASE_RADIUS_TIP = 0.55;
const BASE_RADIUS_UNION = 0.75;

function getTreeBranchLevels(memberCount: number): number {
  if (memberCount <= 10)
    return 1;
  if (memberCount <= 30)
    return 2;
  return 3;
}

function buildOrganicRoot(
  mesh: THREE.Mesh,
  start: THREE.Vector3,
  end: THREE.Vector3,
  isUnion: boolean,
  linkSeed: number,
  depthNorm: number,
) {
  const length = new THREE.Vector3().subVectors(end, start).length();
  if (length < 0.5)
    return;

  const rng = makeRng(linkSeed);

  const t_thick = depthNorm ** 0.7;
  const radiusBase = isUnion
    ? BASE_RADIUS_UNION * (0.3 + t_thick * 0.7)
    : BASE_RADIUS_TIP + (BASE_RADIUS_MAIN - BASE_RADIUS_TIP) * t_thick;
  const radiusTip = radiusBase * 0.28;
  const radialSegs = isUnion ? 5 : 7;

  const numCtrl = Math.max(3, Math.floor(length / 10));
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= numCtrl; i++) {
    const t = i / numCtrl;
    const base = new THREE.Vector3().lerpVectors(start, end, t);
    if (i > 0 && i < numCtrl) {
      const devScale = length * 0.13 * Math.sin(Math.PI * t);
      base.x += (rng(i * 3 + 0) - 0.5) * 2 * devScale;
      base.y += (rng(i * 3 + 1) - 0.5) * 2 * devScale * 0.25;
      base.z += (rng(i * 3 + 2) - 0.5) * 2 * devScale;
    }
    points.push(base);
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  const segments = Math.max(10, Math.floor(length * 1.4));
  const curvePoints = curve.getPoints(segments);
  const path = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);

  if (mesh.geometry)
    mesh.geometry.dispose();
  const tubeGeo = new THREE.TubeGeometry(path, segments, radiusBase, radialSegs, false);

  const pos = tubeGeo.attributes.position;

  if (isUnion) {
    for (let seg = 0; seg <= segments; seg++) {
      const cp = curvePoints[Math.min(seg, curvePoints.length - 1)];
      const tSeg = seg / segments;
      const pulse = 1.0 + 0.08 * Math.sin(tSeg * Math.PI * 3 + rng(seg % 5) * Math.PI);
      for (let r = 0; r < radialSegs; r++) {
        const idx = seg * radialSegs + r;
        if (idx >= pos.count)
          continue;
        const rx = pos.getX(idx) - cp.x;
        const ry = pos.getY(idx) - cp.y;
        const rz = pos.getZ(idx) - cp.z;
        pos.setXYZ(idx, cp.x + rx * pulse, cp.y + ry * pulse, cp.z + rz * pulse);
      }
    }
  }
  else {
    const topY = Math.max(start.y, end.y);
    const bottomY = Math.min(start.y, end.y);
    const yRange = Math.max(topY - bottomY, 0.01);

    for (let seg = 0; seg <= segments; seg++) {
      const cp = curvePoints[Math.min(seg, curvePoints.length - 1)];
      const tY = Math.max(0, Math.min(1, (cp.y - bottomY) / yRange));
      const taper = tY ** 0.5;
      const scale = (radiusTip + (radiusBase - radiusTip) * taper) / radiusBase;

      for (let r = 0; r < radialSegs; r++) {
        const idx = seg * radialSegs + r;
        if (idx >= pos.count)
          continue;
        const rx = pos.getX(idx) - cp.x;
        const ry = pos.getY(idx) - cp.y;
        const rz = pos.getZ(idx) - cp.z;
        pos.setXYZ(idx, cp.x + rx * scale, cp.y + ry * scale, cp.z + rz * scale);
      }
    }
  }

  pos.needsUpdate = true;
  tubeGeo.computeVertexNormals();
  mesh.geometry = tubeGeo;

  const hueShift = (rng(0) - 0.5) * 0.04;
  const lightShift = (rng(1) - 0.5) * 0.06;
  const baseColor = isUnion
    ? new THREE.Color(0.22 + hueShift, 0.13 + lightShift, 0.06)
    : new THREE.Color(0.13 + hueShift, 0.07 + lightShift, 0.01);

  if (!mesh.material || Array.isArray(mesh.material)) {
    mesh.material = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.87 + rng(2) * 0.08,
      metalness: 0.0,
    });
  }
  else {
    (mesh.material as THREE.MeshStandardMaterial).color.copy(baseColor);
  }

  mesh.position.set(0, 0, 0);
  mesh.quaternion.identity();
}

function buildTrunkConnection(scene: THREE.Scene, nodePos: THREE.Vector3, trunkBaseY: number, seed: number) {
  const rng = makeRng(seed);
  const minRise = 22;
  const actualTrunkY = Math.max(trunkBaseY, nodePos.y + minRise);
  const trunkBase = new THREE.Vector3(
    nodePos.x + (rng(0) - 0.5) * 8,
    actualTrunkY,
    nodePos.z + (rng(1) - 0.5) * 8,
  );

  const length = new THREE.Vector3().subVectors(trunkBase, nodePos).length();
  if (length < 4)
    return;

  const numCtrl = Math.max(3, Math.floor(length / 10));
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= numCtrl; i++) {
    const t = i / numCtrl;
    const base = new THREE.Vector3().lerpVectors(nodePos, trunkBase, t);
    if (i > 0 && i < numCtrl) {
      const devH = length * 0.08 * Math.sin(Math.PI * t);
      base.x += (rng(i * 4 + 0) - 0.5) * 2 * devH;
      base.y += (rng(i * 4 + 1) - 0.5) * devH * 0.15;
      base.z += (rng(i * 4 + 2) - 0.5) * 2 * devH;
    }
    points.push(base);
  }

  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  const segments = Math.max(10, Math.floor(length * 1.5));
  const curvePoints = curve.getPoints(segments);
  const path = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);

  const radiusBase = BASE_RADIUS_MAIN * 1.15;
  const radiusTip = BASE_RADIUS_MAIN * 0.18;
  const radialSegs = 8;

  const tubeGeo = new THREE.TubeGeometry(path, segments, radiusBase, radialSegs, false);
  const pos = tubeGeo.attributes.position;
  const topY2 = Math.max(nodePos.y, actualTrunkY);
  const bottomY2 = Math.min(nodePos.y, actualTrunkY);
  const yRange2 = Math.max(topY2 - bottomY2, 0.01);

  for (let seg = 0; seg <= segments; seg++) {
    const cp = curvePoints[Math.min(seg, curvePoints.length - 1)];
    const tY = Math.max(0, Math.min(1, (cp.y - bottomY2) / yRange2));
    const taper = tY ** 0.5;
    const scale = (radiusTip + (radiusBase - radiusTip) * taper) / radiusBase;
    const knot = 1.0 + 0.04 * Math.sin(tY * Math.PI * 4 * rng(seg % 6));
    for (let r = 0; r < radialSegs; r++) {
      const idx = seg * radialSegs + r;
      if (idx >= pos.count)
        continue;
      const cp2 = curvePoints[Math.min(seg, curvePoints.length - 1)];
      const rx = pos.getX(idx) - cp2.x;
      const ry = pos.getY(idx) - cp2.y;
      const rz = pos.getZ(idx) - cp2.z;
      pos.setXYZ(idx, cp2.x + rx * scale * knot, cp2.y + ry * scale * knot, cp2.z + rz * scale * knot);
    }
  }
  pos.needsUpdate = true;
  tubeGeo.computeVertexNormals();

  const hueShift = (rng(3) - 0.5) * 0.03;
  scene.add(new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.10 + hueShift, 0.05, 0.01),
    roughness: 0.92,
    metalness: 0.0,
  })));
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function addGroundMound(scene: THREE.Scene, baseY: number, graphSpread: number) {
  const spread = Math.max(40, graphSpread + 22);

  const dirtMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(spread * 0.85, spread * 1.0, 10, 48, 1),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(0.18, 0.10, 0.04), roughness: 0.98, metalness: 0.0 }),
  );
  dirtMesh.position.set(0, baseY - 2, 0);
  scene.add(dirtMesh);

  const motteMesh = new THREE.Mesh(
    new THREE.SphereGeometry(Math.min(spread * 0.35, 55), 32, 16),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(0.22, 0.13, 0.05), roughness: 0.97, metalness: 0.0 }),
  );
  motteMesh.scale.set(1, 0.22, 1);
  motteMesh.position.set(0, baseY + 0.5, 0);
  scene.add(motteMesh);

  const bladeGeo = new THREE.PlaneGeometry(0.5, 3.2);
  bladeGeo.translate(0, 1.6, 0);
  const grassMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.18, 0.32, 0.08), roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide });
  const rng = makeRng(42);
  const numBlades = Math.min(350, Math.floor(160 * (spread / 42)));
  for (let i = 0; i < numBlades; i++) {
    const angle = (i / numBlades) * Math.PI * 2 + rng(i) * 0.35;
    const ring = i % 3 === 0 ? 1.0 : (i % 3 === 1 ? 0.85 : 1.12);
    const radius = (spread * 0.28 + rng(i * 7) * spread * 0.68) * ring;
    const motteY = Math.max(0, 4 * Math.exp(-(radius * radius) / (spread * spread * 0.12)));
    const blade = new THREE.Mesh(bladeGeo, grassMat);
    blade.position.set(Math.cos(angle) * radius, baseY + motteY - 0.5, Math.sin(angle) * radius);
    blade.rotation.y = angle + rng(i * 3) * Math.PI;
    blade.rotation.z = (rng(i * 5) - 0.5) * 0.4;
    blade.scale.set(0.8 + rng(i * 13) * 0.5, 0.6 + rng(i * 11) * 0.8, 1);
    scene.add(blade);
  }

  const bumpMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.20, 0.11, 0.04), roughness: 0.99, metalness: 0.0 });
  const numBumps = Math.min(28, Math.floor(14 * (spread / 42)));
  for (let i = 0; i < numBumps; i++) {
    const angle = rng(i * 17) * Math.PI * 2;
    const r = spread * 0.12 + rng(i * 23) * spread * 0.78;
    const bump = new THREE.Mesh(new THREE.SphereGeometry(1.5 + rng(i * 31) * 2.5, 7, 5), bumpMat);
    bump.scale.set(1 + rng(i) * 0.6, 0.35 + rng(i * 7) * 0.25, 1 + rng(i * 3) * 0.6);
    bump.position.set(Math.cos(angle) * r, baseY + 1.5, Math.sin(angle) * r);
    scene.add(bump);
  }
}

async function addTree(scene: THREE.Scene, yOffset: number, memberCount: number, graphSpread: number) {
  const { Tree } = await import("@dgreenheck/ez-tree");
  const tree = new Tree();
  tree.options.seed = getRandomInt(100);
  tree.options.branch.levels = getTreeBranchLevels(memberCount);
  tree.generate();
  tree.position.y = yOffset;
  tree.scale.setScalar(9);
  tree.traverse((child: any) => {
    if (child.isMesh && child.material) {
      child.material.side = THREE.DoubleSide;
      child.material.needsUpdate = true;
    }
  });
  scene.add(tree);
  addGroundMound(scene, yOffset + 8, graphSpread);
}

function startAutoRotate() {
  const animate = () => {
    if (!autoRotate.value || !myGraphInstance)
      return;
    const camera = myGraphInstance.camera();
    const offset = new THREE.Vector3().subVectors(camera.position, orbitTarget);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += 0.004;
    offset.setFromSpherical(spherical);
    camera.position.copy(orbitTarget).add(offset);
    camera.lookAt(orbitTarget);
    autoRotateFrame = requestAnimationFrame(animate);
  };
  autoRotateFrame = requestAnimationFrame(animate);
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value;
  if (autoRotate.value)
    startAutoRotate();
  else if (autoRotateFrame)
    cancelAnimationFrame(autoRotateFrame);
}

function zoomCamera(factor: number) {
  if (!myGraphInstance)
    return;
  const camera = myGraphInstance.camera();
  const direction = new THREE.Vector3().subVectors(orbitTarget, camera.position).normalize();
  const dist = camera.position.distanceTo(orbitTarget);
  const newDist = Math.max(30, Math.min(1200, dist * factor));
  camera.position.copy(orbitTarget).addScaledVector(direction, -newDist);
  camera.lookAt(orbitTarget);
}

let linkCounter = 0;

function computeDepthNorms(): Map<any, number> {
  const members = membersList.value;
  const depthMap = new Map<any, number>();
  const queue: Array<{ id: any; depth: number }> = [];

  for (const m of members) {
    if (!m.parent1 && !m.parent2) {
      queue.push({ id: m.id, depth: 0 });
      depthMap.set(m.id, 0);
    }
  }

  let maxDepth = 0;
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    for (const m of members) {
      if ((m.parent1 === id || m.parent2 === id) && !depthMap.has(m.id)) {
        depthMap.set(m.id, depth + 1);
        maxDepth = Math.max(maxDepth, depth + 1);
        queue.push({ id: m.id, depth: depth + 1 });
      }
    }
  }

  const normMap = new Map<any, number>();
  for (const [id, d] of depthMap)
    normMap.set(id, maxDepth > 0 ? 1.0 - d / maxDepth : 1.0);

  for (const m of members) {
    if (m.unions) {
      for (const u of m.unions) {
        if (u.partner) {
          const p1 = Math.min(m.id, u.partner);
          const p2 = Math.max(m.id, u.partner);
          const uid = `union_${p1}_${p2}`;
          if (!normMap.has(uid)) {
            normMap.set(uid, ((normMap.get(p1) ?? 0.5) + (normMap.get(p2) ?? 0.5)) / 2);
          }
        }
      }
    }
  }
  return normMap;
}

let depthNormMap = new Map<any, number>();

function isUnionNodeId(id: any): boolean {
  return typeof id === "string" && id.startsWith("union_");
}

async function initGraph() {
  if (import.meta.client && graphContainer.value) {
    const ForceGraph3D = (await import("3d-force-graph")).default;

    depthNormMap = computeDepthNorms();

    myGraphInstance = ForceGraph3D()(graphContainer.value)
      .graphData(graphData.value)
      .nodeLabel("name")
      .width(900)
      .nodeColor((node: any) => node.color)
      .nodeVal((node: any) => node.isUser ? 2.5 : 0.4)
      .nodeOpacity(1.0)
      .nodeResolution(12)
      .nodeThreeObject((node: any) => {
        if (!node.isUser) {
          const geo = new THREE.SphereGeometry(1.2, 6, 6);
          const mat = new THREE.MeshStandardMaterial({ color: "#1a0d04", roughness: 0.95, metalness: 0.0 });
          return new THREE.Mesh(geo, mat);
        }
        const size = (node as any).isRoot ? 6.0 : 4.8;
        const color = (node as any).isRoot ? "#2a1604" : "#180c02";
        const geo = new THREE.SphereGeometry(size, 14, 14);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0.0 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(1, 0.72, 1);
        return mesh;
      })
      .nodeThreeObjectExtend(false)
      .linkThreeObject((link: any) => {
        const seed = linkCounter++;
        const srcId = typeof link.source === "object" ? link.source?.id : link.source;
        const tgtId = typeof link.target === "object" ? link.target?.id : link.target;

        // Pour les liens union, on prend la depthNorm du membre (pas du nœud union)
        let depthNorm: number;
        if (link.isUnion) {
          const memberNodeId = isUnionNodeId(srcId) ? tgtId : srcId;
          depthNorm = depthNormMap.get(memberNodeId) ?? 0.5;
        }
        else {
          const dSrc = depthNormMap.get(srcId) ?? 0.5;
          const dTgt = depthNormMap.get(tgtId) ?? 0.5;
          depthNorm = Math.max(dSrc, dTgt);
        }

        const mesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({
          color: link.isUnion ? "#1a0d04" : "#120802",
          roughness: 0.92,
          metalness: 0.0,
        }));
        (mesh as any).__isUnion = !!link.isUnion;
        (mesh as any).__seed = seed;
        (mesh as any).__depthNorm = depthNorm;
        return mesh;
      })
      .linkThreeObjectExtend(false)
      .linkPositionUpdate((obj: any, { start, end }: { start: any; end: any }) => {
        if (!obj || !start || !end)
          return false;
        buildOrganicRoot(
          obj as THREE.Mesh,
          new THREE.Vector3(start.x ?? 0, start.y ?? 0, start.z ?? 0),
          new THREE.Vector3(end.x ?? 0, end.y ?? 0, end.z ?? 0),
          !!(obj as any).__isUnion,
          (obj as any).__seed ?? 0,
          (obj as any).__depthNorm ?? 0.5,
        );
        return true;
      })
      .showNavInfo(false)
      .enableNodeDrag(false)
      .enableNavigationControls(false)
      .backgroundColor("#ffffff00")
      .dagMode("td")
      .dagLevelDistance(16)
      .onEngineStop(async () => {
        const scene = myGraphInstance.scene();
        const bbox = myGraphInstance.getGraphBbox();
        const topY = bbox?.y?.[1] ?? 80;
        const bottomY = bbox?.y?.[0] ?? -80;
        const totalHeight = (topY - bottomY) + 600;

        const allNodes = myGraphInstance.graphData().nodes;
        let maxXZ = 0;
        for (const node of allNodes) {
          const nx = (node as any).x ?? 0;
          const nz = (node as any).z ?? 0;
          const dist = Math.sqrt(nx * nx + nz * nz);
          if (dist > maxXZ)
            maxXZ = dist;
        }
        const graphSpread = maxXZ + 6;

        // L'arbre est placé au-dessus du nœud le plus haut + marge
        // La motte doit couvrir topY (le Y max des nœuds) + ~15 unités de marge
        await addTree(scene, topY + 18, membersList.value.length, graphSpread);

        const trunkBaseY = topY + 4;
        let rootSeedOffset = 500;
        for (const node of allNodes) {
          if (!(node as any).isRoot)
            continue;
          buildTrunkConnection(
            scene,
            new THREE.Vector3((node as any).x ?? 0, (node as any).y ?? 0, (node as any).z ?? 0),
            trunkBaseY,
            rootSeedOffset++,
          );
        }

        isLoading.value = false;

        const treeTopY = topY + 18 + 90;
        const centerY = (treeTopY + bottomY) / 2;
        orbitTarget.set(0, centerY, 0);

        myGraphInstance.cameraPosition(
          { x: 0, y: centerY, z: totalHeight * 1.2 },
          { x: 0, y: centerY, z: 0 },
          800,
        );
      })
      .onNodeClick((node: any) => {
        if (node.isUser) {
          selectedMember.value = membersList.value.find(m => m.id === node.id);
          if (drawer.value)
            drawer.value.checked = true;
        }
      });

    const chargeForce = myGraphInstance.d3Force("charge");
    if (chargeForce && typeof chargeForce.strength === "function") {
      chargeForce.strength(-8);
    }

    const scene = myGraphInstance.scene();
    scene.add(new THREE.AmbientLight(0xFFE8C8, 0.55));
    const sun = new THREE.DirectionalLight(0xFFF5E0, 1.8);
    sun.position.set(60, 120, 80);
    scene.add(sun);
    const skyFill = new THREE.DirectionalLight(0xC8E0FF, 0.35);
    skyFill.position.set(-80, 80, -60);
    scene.add(skyFill);
    const groundBounce = new THREE.DirectionalLight(0xA0622A, 0.28);
    groundBounce.position.set(0, -60, 0);
    scene.add(groundBounce);
    const pointWarm = new THREE.PointLight(0xFF9944, 0.65, 400);
    pointWarm.position.set(20, 30, 40);
    scene.add(pointWarm);

    const canvas = graphContainer.value?.querySelector("canvas");
    if (canvas) {
      let isDragging = false;
      let lastX = 0;
      canvas.addEventListener("mousedown", (e: MouseEvent) => {
        if (autoRotate.value)
          toggleAutoRotate();
        isDragging = true;
        lastX = e.clientX;
      });
      canvas.addEventListener("mousemove", (e: MouseEvent) => {
        if (!isDragging)
          return;
        const deltaX = e.clientX - lastX;
        lastX = e.clientX;
        const camera = myGraphInstance.camera();
        const offset = new THREE.Vector3().subVectors(camera.position, orbitTarget);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        spherical.theta -= deltaX * 0.005;
        offset.setFromSpherical(spherical);
        camera.position.copy(orbitTarget).add(offset);
        camera.lookAt(orbitTarget);
      });
      window.addEventListener("mouseup", () => {
        isDragging = false;
      });
    }
  }
}

const numberMembers = computed(() => membersList.value.length);
const numberAdoptedValue = computed(() => membersList.value.filter(m => m.isAdopted === true).length);
const numberDeathValue = computed(() => membersList.value.filter(m => isDead(m.deathDate)).length);
const percentAlive = computed(() => {
  const total = membersList.value.length;
  if (total === 0)
    return 0;
  return Math.round(((total - numberDeathValue.value) / total) * 100);
});
const mailtoLink = computed(() => {
  return `mailto:example@exemple.com?subject=Geneasphere&body=${encodeURIComponent(
    `Voici un super arbre généalogique à découvrir : ${pageLink.value}`,
  )}`;
});

onMounted(() => {
  initGraph();
  pageLink.value = window.location.href;
});
onUnmounted(() => {
  if (autoRotateFrame)
    cancelAnimationFrame(autoRotateFrame);
});
watch(graphData, (newData) => {
  if (myGraphInstance)
    myGraphInstance.graphData(newData);
});
</script>

<template>
  <div class="min-h-screen ">
    <div v-if="pending" class="flex justify-center p-24 ">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div v-else-if="treeData" class="content-solo flex flex-1 gap-2">
      <div class="side-informations">
        <NuxtLink class="btn btn-ghost" to="/trufo">
          <Icon name="tabler:arrow-left" /> Retour
        </NuxtLink>
        <header class="max-w-4xl">
          <h1 class="text-5xl font-extrabold text-primary mb-2">
            {{ treeData.name }}
          </h1>
          <p class="user">
            par {{ treeData.user?.name }}
          </p>
          <p class="description-three">
            {{ treeData.description }}
          </p>
        </header>

        <div class="divider" />

        <div class="infos-three">
          <h2>Statistiques</h2>
          <div class="stat-content">
            <span class="stat">Nombre d'adoptions :</span>{{ numberAdoptedValue }}
          </div>
          <div class="stat-content">
            <span class="stat">Pourcentage de la famille en vie :</span>{{ percentAlive }}%
          </div>
          <div class="stat-content">
            <span class="stat">Nombre total de membres de la famille :</span>{{ numberMembers }}
          </div>
        </div>

        <div class="divider" />

        <div class="infos-three">
          <h2>Partager</h2>
          <div class="share-icons">
            <div class="tooltip github" data-tip="Partager par mail">
              <a target="_blank" rel="noopener noreferrer" :href="mailtoLink">
                <Icon name="tabler:mail" size="24" />
              </a>
            </div>
            <div class="tooltip github" data-tip="Copier le lien de l'arbre">
              <button @click="copyPaste">
                <Icon name="tabler:copy" size="24" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="relative canvas-container overflow-hidden">
        <div ref="graphContainer" class="w-full h-full" />

        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-base-100/70 backdrop-blur-sm z-10 pointer-events-none">
          <span class="loading loading-spinner loading-lg text-primary" />
          <p class="mt-4 text-sm opacity-70">
            Génération de l'arbre généalogique...
          </p>
        </div>

        <div v-if="!isLoading" class="absolute button-controls">
          <button
            class="btn btn-sm gap-2"
            :class="autoRotate ? 'btn-primary' : 'btn-ghost btn-outline'"
            @click="toggleAutoRotate"
          >
            <Icon :name="autoRotate ? 'tabler:player-pause' : 'tabler:rotate-clockwise'" size="16" />
            {{ autoRotate ? 'Arrêter' : 'Rotation auto' }}
          </button>
          <div class="zoom-buttons">
            <button class="btn btn-sm btn-ghost btn-outline" title="Zoom in" @click="zoomCamera(0.8)">
              <Icon name="tabler:zoom-in" size="16" />
            </button>
            <button class="btn btn-sm btn-ghost btn-outline" title="Zoom out" @click="zoomCamera(1.25)">
              <Icon name="tabler:zoom-out" size="16" />
            </button>
          </div>
        </div>

        <div class="drawer drawer-end absolute inset-0 pointer-events-none">
          <input id="info-drawer" ref="drawer" type="checkbox" class="drawer-toggle pointer-events-auto">
          <div class="drawer-side pointer-events-auto">
            <label for="info-drawer" class="drawer-overlay" />
            <div class="menu p-8 w-96 min-h-full bg-base-100 text-base-content shadow-2xl">
              <div v-if="selectedMember" class="flex flex-col gap-6">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="tabler:user" size="32" class="text-primary" />
                  </div>
                  <h2 class="text-2xl font-bold">
                    {{ selectedMember.name }}
                  </h2>
                </div>
                <div class="divider">
                  Informations
                </div>
                <div class="flex flex-col gap-3">
                  <div v-if="selectedMember.bornDate" class="flex justify-between">
                    <span class="opacity-60">Date de naissance :</span>
                    <span class="font-medium">{{ new Date(selectedMember.bornDate).toLocaleDateString() }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="opacity-60">Statut :</span>
                    <span :class="isDead(selectedMember.deathDate) ? 'text-error' : 'text-success'">
                      {{ isDead(selectedMember.deathDate) ? 'Décédé' : 'Vivant' }}
                    </span>
                  </div>
                </div>
                <div v-if="selectedMember.description" class="p-4 bg-base-200 rounded-xl mt-4 italic text-sm">
                  "{{ selectedMember.description }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
canvas {
  outline: none;
}

.share-icons {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.infos-three {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;

  h2 {
    font-weight: 600;
    margin-bottom: 12px;
  }
}

.canvas-container {
  margin-top: 2px;
}

.button-controls {
  z-index: 20;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zoom-buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

h1,
.description-three,
.infos-three,
.divider,
.user {
  padding-left: 18px;
}

h1 {
  padding-top: 12px;
}

.description-three {
  font-size: 18px;
  padding-block: 32px;
}

.stat-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.stat {
  margin-right: 12px;
  width: fit-content;
  padding-inline: unset;
  padding-block: unset;
}

.side-informations {
  height: 100vh;
  padding-inline: 32px;
  padding-top: 48px;
  width: 30%;
  margin-bottom: -12px;
  --tw-shadow:
    0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow:
    var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);
}
</style>
