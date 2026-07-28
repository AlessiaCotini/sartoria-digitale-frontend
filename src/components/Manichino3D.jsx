import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { coloraSvg } from "../utils/coloraSvg";
import { fattoreScalaPerAltezza } from "../utils/sagomaCorpo";
import { creaTessuto, aggiornaTessuto, COLONNE, RIGHE } from "../utils/tessuto";
import {
  lunghezzaManica,
  creaManica,
  FRAZIONE_SPALLA,
  creaToppaSpalla,
} from "../utils/maniche";

const ZONE_TESSUTO = {
  Camicie: { da: 0.58, a: 0.82 },
  Magliette: { da: 0.55, a: 0.8 },
  Cardigan: { da: 0.5, a: 0.84 },
  Giacche: { da: 0.48, a: 0.84 },
  Completi: { da: 0.48, a: 0.84 },
  Abiti: { da: 0.08, a: 0.84 },
  Gonne: { da: 0.3, a: 0.58 },
};

// il file è esportato in millimetri, la nostra scena ragiona in "metri"
const SCALA_MM_A_METRI = 0.001;

function percorsoModello(genere) {
  return genere === "Uomo"
    ? "/modelli/manichinoUomo.fbx"
    : "/modelli/manichino.fbx";
}

function deformaCorpo(meshCorpo, proporzioni) {
  const { posizioniOriginali, frazioniAltezza } = meshCorpo.geometry.userData;
  if (!posizioniOriginali || !frazioniAltezza) {
    console.warn("deformaCorpo: dati originali mancanti");
    return;
  }

  const posAttr = meshCorpo.geometry.attributes.position;
  const numVertici = posAttr.count;

  for (let i = 0; i < numVertici; i++) {
    const ox = posizioniOriginali[i * 3];
    const oy = posizioniOriginali[i * 3 + 1];
    const oz = posizioniOriginali[i * 3 + 2];
    const fattore = fattoreScalaPerAltezza(frazioniAltezza[i], proporzioni);

    posAttr.setXYZ(i, ox * fattore, oy, oz * fattore);
  }
  posAttr.needsUpdate = true;
  meshCorpo.geometry.computeVertexNormals();
}

function trovaXSpallaReale(meshCorpo, proporzioni) {
  const { posizioniOriginali, frazioniAltezza } = meshCorpo.geometry.userData;
  if (!posizioniOriginali || !frazioniAltezza) return null;

  const tolleranza = 0.015;
  let massimoX = 0;
  for (let i = 0; i < frazioniAltezza.length; i++) {
    if (Math.abs(frazioniAltezza[i] - FRAZIONE_SPALLA) < tolleranza) {
      const fattore = fattoreScalaPerAltezza(frazioniAltezza[i], proporzioni);
      const x = Math.abs(posizioniOriginali[i * 3] * fattore);
      if (x > massimoX) massimoX = x;
    }
  }
  return massimoX > 0 ? massimoX : null;
}

function aggiornaManiche(
  s,
  corpo,
  proporzioni,
  categoria,
  modello,
  scalaTotale,
) {
  const lunghezza = lunghezzaManica(categoria, modello);
  const xSpallaLocale = s.meshCorpo
    ? trovaXSpallaReale(s.meshCorpo, proporzioni)
    : null;

  if (lunghezza === "nessuna" || !xSpallaLocale) {
    s.meshManicaSx.visible = false;
    s.meshManicaDx.visible = false;
    s.meshToppaSx.visible = false;
    s.meshToppaDx.visible = false;
    return;
  }

  const xSpallaMetri = xSpallaLocale * scalaTotale;
  [
    [s.meshManicaSx, s.meshToppaSx, -xSpallaMetri],
    [s.meshManicaDx, s.meshToppaDx, xSpallaMetri],
  ].forEach(([meshManica, meshToppa, xSpalla]) => {
    const { posizioni, uv, indici } = creaManica(
      corpo,
      proporzioni,
      xSpalla,
      lunghezza,
    );
    meshManica.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posizioni, 3),
    );
    meshManica.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    meshManica.geometry.setIndex(indici);
    meshManica.geometry.computeVertexNormals();
    meshManica.visible = true;

    const toppa = creaToppaSpalla(corpo, proporzioni, xSpalla);
    meshToppa.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(toppa.posizioni, 3),
    );
    meshToppa.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(toppa.uv, 2),
    );
    meshToppa.geometry.setIndex(toppa.indici);
    meshToppa.geometry.computeVertexNormals();
    meshToppa.visible = true;
  });
}

function Manichino3D({
  proporzioni,
  coloreHex,
  immagineCapo,
  categoria,
  genere,
  modello,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const proporzioniRef = useRef(proporzioni);
  const categoriaRef = useRef(categoria);
  const modelloRef = useRef(modello);
  useEffect(() => {
    proporzioniRef.current = proporzioni;
    categoriaRef.current = categoria;
    modelloRef.current = modello;
  });

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

    const luceAmbiente = new THREE.AmbientLight(0xffffff, 0.55);
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

    // il manichino vero e proprio (FBX) viene caricato dentro questo
    // gruppo vuoto: così possiamo scalarlo/spostarlo e sostituirlo senza
    // toccare il resto della scena
    const gruppoManichino = new THREE.Group();
    scene.add(gruppoManichino);

    const materialeTessuto = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      side: THREE.DoubleSide,
      transparent: true,
    });

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

    scene.add(pavimento, meshTessuto);

    const meshManicaSx = new THREE.Mesh(
      new THREE.BufferGeometry(),
      materialeTessuto,
    );
    const meshManicaDx = new THREE.Mesh(
      new THREE.BufferGeometry(),
      materialeTessuto,
    );
    meshManicaSx.visible = false;
    meshManicaDx.visible = false;
    meshManicaSx.castShadow = true;
    meshManicaDx.castShadow = true;
    scene.add(meshManicaSx, meshManicaDx);

    const meshToppaSx = new THREE.Mesh(
      new THREE.BufferGeometry(),
      materialeTessuto,
    );
    const meshToppaDx = new THREE.Mesh(
      new THREE.BufferGeometry(),
      materialeTessuto,
    );
    meshToppaSx.visible = false;
    meshToppaDx.visible = false;
    meshToppaSx.castShadow = true;
    meshToppaDx.castShadow = true;
    scene.add(meshToppaSx, meshToppaDx);

    sceneRef.current = {
      gruppoManichino,
      controls,
      modelloCorrente: null,
      genereCaricato: null,
      materialeTessuto,
      geoTessuto,
      meshTessuto,
      meshManicaSx,
      meshManicaDx,
      meshToppaSx,
      meshToppaDx,
      tessuto: null,
      proporzioni: null,
      altezzaCorrente: 1,
    };

    let frameId;
    function anima() {
      const s = sceneRef.current;
      if (s.tessuto) {
        aggiornaTessuto(s.tessuto, s.corpo, s.proporzioni);
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

  // carica il modello FBX giusto (uomo/donna) quando cambia il genere
  useEffect(() => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;
    const percorso = percorsoModello(genere);

    if (s.genereCaricato === percorso) return;

    const caricatore = new FBXLoader();
    let annullato = false;

    caricatore.load(
      percorso,
      (oggetto) => {
        if (annullato) return;

        if (s.modelloCorrente) {
          s.gruppoManichino.remove(s.modelloCorrente);
        }

        oggetto.traverse((figlio) => {
          if (figlio.isMesh) {
            figlio.castShadow = true;
            figlio.receiveShadow = true;
          }
        });

        const bbox = new THREE.Box3().setFromObject(oggetto);
        const dimensioni = new THREE.Vector3();
        bbox.getSize(dimensioni);

        oggetto.updateMatrixWorld(true);

        let meshCorpo = null;
        oggetto.traverse((figlio) => {
          if (figlio.isMesh && figlio.name === "body") meshCorpo = figlio;
        });

        if (meshCorpo) {
          const posAttr = meshCorpo.geometry.attributes.position;
          const numVertici = posAttr.count;
          const posizioniOriginali = new Float32Array(numVertici * 3);
          const frazioniAltezza = new Float32Array(numVertici);
          const v = new THREE.Vector3();

          for (let i = 0; i < numVertici; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const z = posAttr.getZ(i);
            posizioniOriginali[i * 3] = x;
            posizioniOriginali[i * 3 + 1] = y;
            posizioniOriginali[i * 3 + 2] = z;

            v.set(x, y, z);
            v.applyMatrix4(meshCorpo.matrixWorld);
            frazioniAltezza[i] = (v.y - bbox.min.y) / dimensioni.y;
          }

          meshCorpo.geometry.userData.posizioniOriginali = posizioniOriginali;
          meshCorpo.geometry.userData.frazioniAltezza = frazioniAltezza;
          s.meshCorpo = meshCorpo;
          deformaCorpo(meshCorpo, proporzioniRef.current);
        }

        oggetto.position.y = -bbox.min.y;
        oggetto.position.x = -(bbox.min.x + bbox.max.x) / 2;
        oggetto.position.z = -(bbox.min.z + bbox.max.z) / 2;

        s.altezzaNativaMM = dimensioni.y;
        if (s.controls) {
          const altezzaModelloReale =
            dimensioni.y * SCALA_MM_A_METRI * s.altezzaCorrente;
          s.controls.target.set(0, -0.9 + altezzaModelloReale * 0.55, 0);
        }

        if (meshCorpo) {
          const corpoAttuale = {
            yPiedi: -0.9,
            altezzaModello: dimensioni.y * SCALA_MM_A_METRI * s.altezzaCorrente,
          };
          aggiornaManiche(
            s,
            corpoAttuale,
            proporzioniRef.current,
            categoriaRef.current,
            modelloRef.current,
            SCALA_MM_A_METRI * s.altezzaCorrente,
          );
        }

        s.gruppoManichino.add(oggetto);
        s.modelloCorrente = oggetto;
        s.genereCaricato = percorso;
      },
      undefined,
      (errore) => {
        console.error("Errore nel caricare il manichino FBX:", errore);
      },
    );

    return () => {
      annullato = true;
    };
  }, [genere]);

  // scala/posiziona il manichino e ricrea la zona del tessuto sulle misure
  useEffect(() => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;

    const altezza = proporzioni.scalaAltezza;

    const scalaTotale = SCALA_MM_A_METRI * altezza;
    s.gruppoManichino.scale.set(scalaTotale, scalaTotale, scalaTotale);
    s.gruppoManichino.position.set(0, -0.9, 0);

    if (s.meshCorpo) {
      deformaCorpo(s.meshCorpo, proporzioni);
    }

    const yPiedi = -0.9;
    const altezzaModello =
      (s.altezzaNativaMM || 1900) * SCALA_MM_A_METRI * altezza;
    const corpo = { yPiedi, altezzaModello };
    if (s.controls) {
      s.controls.target.set(0, yPiedi + altezzaModello * 0.55, 0);
    }

    const zona = ZONE_TESSUTO[categoria];
    if (zona) {
      const yAlto = yPiedi + zona.a * altezzaModello;
      const yBasso = yPiedi + zona.da * altezzaModello;
      s.tessuto = creaTessuto(
        yAlto - yBasso,
        (yAlto + yBasso) / 2,
        corpo,
        proporzioni,
      );
      s.corpo = corpo;
      s.proporzioni = proporzioni;
      s.corpo = corpo;
    } else {
      s.tessuto = null;
      s.meshTessuto.visible = false;
    }

    aggiornaManiche(s, corpo, proporzioni, categoria, modello, scalaTotale);

    s.altezzaCorrente = altezza;
  }, [proporzioni, categoria, modello]);

  // carica e colora la bozza scelta, la disegna sopra il manichino
  useEffect(() => {
    if (!sceneRef.current) return;
    const { meshTessuto } = sceneRef.current;
    const zona = ZONE_TESSUTO[categoria];

    if (!immagineCapo || !zona) {
      meshTessuto.visible = false;
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
