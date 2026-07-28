import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { coloraSvg } from "../utils/coloraSvg";
import { creaTessuto, aggiornaTessuto, COLONNE, RIGHE } from "../utils/tessuto";

const ZONE_TESSUTO = {
  Camicie: { centroY: 0.975, altezza: 0.95 },
  Magliette: { centroY: 0.975, altezza: 0.8 },
  Cardigan: { centroY: 0.975, altezza: 1.0 },
  Giacche: { centroY: 0.975, altezza: 1.0 },
  Completi: { centroY: 0.975, altezza: 1.0 },
  Abiti: { centroY: 0.775, altezza: 1.35 },
  Gonne: { centroY: 0.55, altezza: 0.4 },
};

const CATEGORIE_GAMBE_COLORATE = ["Pantaloni", "Completi"];
const CATEGORIE_BACINO_NASCOSTO = ["Abiti", "Gonne"];
const CATEGORIE_BACINO_COLORATO = ["Completi"];

function Manichino3D({ proporzioni, coloreHex, immagineCapo, categoria }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#100f0d");

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const luceAmbiente = new THREE.AmbientLight(0xffffff, 0.45);
    const luceDirezionale = new THREE.DirectionalLight(0xffffff, 1.0);
    luceDirezionale.position.set(2, 4, 3);
    luceDirezionale.castShadow = true;
    luceDirezionale.shadow.mapSize.set(1024, 1024);
    scene.add(luceAmbiente, luceDirezionale);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3;
    controls.maxDistance = 8;
    controls.target.set(0, 1, 0);

    const materialeCorpo = new THREE.MeshStandardMaterial({
      color: "#d8c9ad",
    });
    const materialeCapo = new THREE.MeshStandardMaterial({
      color: coloreHex,
    });
    const materialeGambe = new THREE.MeshStandardMaterial({
      color: coloreHex,
    });
    const materialeTessuto = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      side: THREE.DoubleSide,
      transparent: true,
    });

    // forme con rastremazione ed estremità arrotondate invece di cilindri
    // dritti: danno una sagoma molto più simile a un corpo
    const geoTesta = new THREE.SphereGeometry(1, 24, 24);
    const geoCollo = new THREE.CylinderGeometry(0.7, 0.65, 1, 16);
    const geoTorso = new THREE.CylinderGeometry(1, 0.78, 1, 24); // largo alle spalle, stretto in vita
    const geoBacino = new THREE.CylinderGeometry(1, 0.75, 1, 24); // largo ai fianchi, stretto verso le gambe

    const testa = new THREE.Mesh(geoTesta, materialeCorpo);
    const collo = new THREE.Mesh(geoCollo, materialeCorpo);
    const busto = new THREE.Mesh(geoTorso, materialeCapo);
    const bacino = new THREE.Mesh(geoBacino, materialeCorpo);
    // braccia e gambe useranno CapsuleGeometry ricostruita a ogni cambio di
    // misure (per non deformare le estremità arrotondate con uno scale non
    // uniforme): qui creiamo solo un placeholder minimo
    const braccioSx = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.4, 8, 16),
      materialeCapo,
    );
    const braccioDx = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.4, 8, 16),
      materialeCapo,
    );
    const gambaSx = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.6, 8, 16),
      materialeCorpo,
    );
    const gambaDx = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.6, 8, 16),
      materialeCorpo,
    );

    [
      testa,
      collo,
      busto,
      bacino,
      braccioSx,
      braccioDx,
      gambaSx,
      gambaDx,
    ].forEach((m) => {
      m.castShadow = true;
      m.receiveShadow = true;
    });

    // geometria del tessuto: una griglia di punti che deformeremo ogni
    // frame con la simulazione fisica
    const geoTessuto = new THREE.BufferGeometry();
    const posizioni = new Float32Array(COLONNE * RIGHE * 3);
    const uv = new Float32Array(COLONNE * RIGHE * 2);
    for (let riga = 0; riga < RIGHE; riga++) {
      for (let colonna = 0; colonna < COLONNE; colonna++) {
        const i = riga * COLONNE + colonna;
        uv[i * 2] = colonna / (COLONNE - 1);
        uv[i * 2 + 1] = 1 - riga / (RIGHE - 1);
      }
    }
    geoTessuto.setAttribute(
      "position",
      new THREE.BufferAttribute(posizioni, 3),
    );
    geoTessuto.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

    const indici = [];
    for (let riga = 0; riga < RIGHE - 1; riga++) {
      for (let colonna = 0; colonna < COLONNE - 1; colonna++) {
        const a = riga * COLONNE + colonna;
        const b = a + 1;
        const c = a + COLONNE;
        const d = c + 1;
        indici.push(a, c, b);
        indici.push(b, c, d);
      }
    }
    geoTessuto.setIndex(indici);

    const meshTessuto = new THREE.Mesh(geoTessuto, materialeTessuto);
    meshTessuto.visible = false;
    meshTessuto.castShadow = true;
    meshTessuto.receiveShadow = true;

    const geoPavimento = new THREE.PlaneGeometry(6, 6);
    const materialePavimento = new THREE.ShadowMaterial({ opacity: 0.35 });
    const pavimento = new THREE.Mesh(geoPavimento, materialePavimento);
    pavimento.rotation.x = -Math.PI / 2;
    pavimento.position.y = -0.9;
    pavimento.receiveShadow = true;

    scene.add(
      pavimento,
      testa,
      collo,
      busto,
      bacino,
      braccioSx,
      braccioDx,
      gambaSx,
      gambaDx,
      meshTessuto,
    );

    sceneRef.current = {
      materialeCorpo,
      materialeCapo,
      materialeGambe,
      materialeTessuto,
      geoTessuto,
      meshTessuto,
      tessuto: null,
      raggioTorace: 0.55,
      raggioFianchi: 0.5,
      altezzaCorrente: 1,
      mesh: {
        testa,
        collo,
        busto,
        bacino,
        braccioSx,
        braccioDx,
        gambaSx,
        gambaDx,
      },
    };

    let frameId;
    function anima() {
      const s = sceneRef.current;
      if (s.tessuto) {
        aggiornaTessuto(
          s.tessuto,
          s.altezzaCorrente,
          s.raggioTorace,
          s.raggioFianchi,
        );
        const posArray = s.geoTessuto.attributes.position.array;
        s.tessuto.particelle.forEach((p, i) => {
          posArray[i * 3] = p.x;
          posArray[i * 3 + 1] = p.y;
          posArray[i * 3 + 2] = p.z;
        });
        s.geoTessuto.attributes.position.needsUpdate = true;
        s.geoTessuto.computeVertexNormals();
      }
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(anima);
    }
    anima();

    function alRidimensionamento() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", alRidimensionamento);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", alRidimensionamento);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // ridimensiona corpo/arti (ricostruendo le capsule di braccia e gambe
  // per non deformarne le estremità arrotondate) e la zona del tessuto
  useEffect(() => {
    if (!sceneRef.current) return;
    const { mesh, meshTessuto } = sceneRef.current;

    const altezza = proporzioni.scalaAltezza;
    const raggioTorace = (proporzioni.larghezzaTorace / 64) * 0.55;
    const raggioFianchi = (proporzioni.larghezzaFianchi / 66) * 0.5;
    const raggioSpalle = proporzioni.larghezzaSpalle / 70;

    mesh.testa.scale.set(0.3, 0.34, 0.3);
    mesh.testa.position.set(0, 1.55 * altezza, 0);

    mesh.collo.scale.set(
      raggioTorace * 0.4,
      0.12 * altezza,
      raggioTorace * 0.4,
    );
    mesh.collo.position.set(0, 1.42 * altezza, 0);

    mesh.busto.scale.set(raggioTorace, 0.75 * altezza, raggioTorace);
    mesh.busto.position.set(0, 1.05 * altezza, 0);

    mesh.bacino.scale.set(raggioFianchi, 0.3 * altezza, raggioFianchi);
    mesh.bacino.position.set(0, 0.6 * altezza, 0);

    const offsetBraccio = raggioSpalle * 0.75;
    const raggioBraccio = 0.085 * raggioSpalle;
    const lunghezzaBraccio = 0.5 * altezza;
    mesh.braccioSx.geometry.dispose();
    mesh.braccioSx.geometry = new THREE.CapsuleGeometry(
      raggioBraccio,
      lunghezzaBraccio,
      8,
      16,
    );
    mesh.braccioSx.position.set(-offsetBraccio, 0.95 * altezza, 0);
    mesh.braccioDx.geometry.dispose();
    mesh.braccioDx.geometry = new THREE.CapsuleGeometry(
      raggioBraccio,
      lunghezzaBraccio,
      8,
      16,
    );
    mesh.braccioDx.position.set(offsetBraccio, 0.95 * altezza, 0);

    const raggioGamba = 0.11 * (raggioFianchi / 0.5);
    const lunghezzaGamba = 0.75 * altezza;
    mesh.gambaSx.geometry.dispose();
    mesh.gambaSx.geometry = new THREE.CapsuleGeometry(
      raggioGamba,
      lunghezzaGamba,
      8,
      16,
    );
    mesh.gambaSx.position.set(-0.22, -0.05 * altezza, 0);
    mesh.gambaDx.geometry.dispose();
    mesh.gambaDx.geometry = new THREE.CapsuleGeometry(
      raggioGamba,
      lunghezzaGamba,
      8,
      16,
    );
    mesh.gambaDx.position.set(0.22, -0.05 * altezza, 0);

    const zona = ZONE_TESSUTO[categoria];
    if (zona) {
      sceneRef.current.tessuto = creaTessuto(
        zona.altezza * altezza,
        zona.centroY * altezza,
        altezza,
        raggioTorace,
        raggioFianchi,
      );
    } else {
      sceneRef.current.tessuto = null;
      meshTessuto.visible = false;
    }

    sceneRef.current.raggioTorace = raggioTorace;
    sceneRef.current.raggioFianchi = raggioFianchi;
    sceneRef.current.altezzaCorrente = altezza;
  }, [proporzioni, categoria]);

  // carica e colora la bozza scelta, gestisce gambe/bacino in base alla
  // categoria, oppure torna al cilindro colorato semplice
  useEffect(() => {
    if (!sceneRef.current) return;
    const { mesh, meshTessuto, materialeCapo, materialeCorpo, materialeGambe } =
      sceneRef.current;

    const zona = ZONE_TESSUTO[categoria];
    const gambeColorate = CATEGORIE_GAMBE_COLORATE.includes(categoria);
    const bacinoNascosto = CATEGORIE_BACINO_NASCOSTO.includes(categoria);
    const bacinoColorato = CATEGORIE_BACINO_COLORATO.includes(categoria);

    mesh.gambaSx.material = gambeColorate ? materialeGambe : materialeCorpo;
    mesh.gambaDx.material = gambeColorate ? materialeGambe : materialeCorpo;
    if (gambeColorate) {
      materialeGambe.color.set(coloreHex);
    }

    mesh.bacino.visible = !bacinoNascosto;
    mesh.bacino.material = bacinoColorato ? materialeGambe : materialeCorpo;

    if (!immagineCapo || !zona) {
      meshTessuto.visible = false;
      mesh.busto.visible = true;
      mesh.braccioSx.visible = true;
      mesh.braccioDx.visible = true;
      materialeCapo.color.set(coloreHex);
      return;
    }

    let annullato = false;

    fetch(immagineCapo)
      .then((r) => r.text())
      .then((testoSvg) => {
        if (annullato) return;
        const { svgColorato } = coloraSvg(testoSvg, coloreHex);

        const immagine = new Image();
        immagine.onload = () => {
          if (annullato || !sceneRef.current) return;
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 768;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(immagine, 0, 0, canvas.width, canvas.height);

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;

          sceneRef.current.materialeTessuto.map = texture;
          sceneRef.current.materialeTessuto.needsUpdate = true;
          sceneRef.current.meshTessuto.visible = true;
          mesh.busto.visible = false;
          mesh.braccioSx.visible = false;
          mesh.braccioDx.visible = false;
        };
        immagine.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgColorato);
      })
      .catch((errore) => {
        console.error("Errore nel caricare la bozza sul manichino:", errore);
      });

    return () => {
      annullato = true;
    };
  }, [immagineCapo, coloreHex, categoria]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "480px", cursor: "grab" }}
    />
  );
}

export default Manichino3D;
