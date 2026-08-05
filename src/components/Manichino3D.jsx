import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { coloraSvg } from "../utils/coloraSvg";

const SCALA_MM_A_METRI = 0.001;
const COLORE_PELLE = "#b5aea3";
const COLORE_SFONDO = "#dcd3c0"; // sabbia del sito, aggiusta se serve

function percorsoModello(genere) {
  return genere === "Uomo"
    ? "/modelli/manichinoUomo3D.fbx"
    : "/modelli/manichinoDonna3D.fbx";
}

const MAPPA_OSSA = {
  collo: ["mixamorigNeck"],
  spalle: ["mixamorigLeftShoulder", "mixamorigRightShoulder"],
  torace: ["mixamorigSpine2"],
  busto: ["mixamorigSpine1"],
  vita: ["mixamorigSpine"],
  fianchi: ["mixamorigHips"],
  bicipite: ["mixamorigLeftArm", "mixamorigRightArm"],
  polso: ["mixamorigLeftForeArm", "mixamorigRightForeArm"],
  coscia: ["mixamorigLeftUpLeg", "mixamorigRightUpLeg"],
  ginocchio: ["mixamorigLeftLeg", "mixamorigRightLeg"],
};

function deformaConOssa(oggetto, proporzioni) {
  const scale = {
    collo: proporzioni.scalaCollo,
    spalle: proporzioni.scalaSpalle,
    torace: proporzioni.scalaTorace,
    busto: proporzioni.scalaBusto,
    vita: proporzioni.scalaVita,
    fianchi: proporzioni.scalaFianchi,
    bicipite: proporzioni.scalaBicipite,
    polso: proporzioni.scalaPolso,
    coscia: proporzioni.scalaCoscia,
    ginocchio: proporzioni.scalaGinocchio,
  };

  Object.entries(MAPPA_OSSA).forEach(([chiave, nomiOssa]) => {
    const fattore = scale[chiave] ?? 1;
    nomiOssa.forEach((nome) => {
      const osso = oggetto.getObjectByName(nome);
      if (osso) osso.scale.set(fattore, 1, fattore);
    });
  });
}

// zona verticale (frazioni 0-1, piedi->testa) coperta dal disegno del capo
function zonaCapo(categoria, genere, proporzioni) {
  const {
    frazioneCollo,
    frazioneVita,
    frazioneFianchi,
    frazioneGinocchio,
    frazioneCaviglia,
  } = proporzioni;

  switch (categoria) {
    case "Camicie":
    case "Cardigan":
    case "Giacche":
    case "Completi":
      return { da: frazioneFianchi - 0.03, a: frazioneCollo };
    case "Magliette":
      return { da: frazioneVita + 0.08, a: frazioneCollo - 0.01 };
    case "Abiti":
      return genere === "Uomo"
        ? { da: frazioneFianchi - 0.04, a: frazioneCollo }
        : { da: frazioneGinocchio, a: frazioneCollo };
    case "Gonne":
      return { da: frazioneGinocchio, a: frazioneVita + 0.03 };
    case "Pantaloni":
      return { da: frazioneCaviglia + 0.02, a: frazioneVita + 0.02 };
    default:
      return null;
  }
}

function Manichino3D({
  proporzioni,
  coloreHex,
  immagineCapo,
  categoria,
  genere,
  modello,
  chiusura,
  vestibilita,
  tasche,
  spacco,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const proporzioniRef = useRef(proporzioni);
  const categoriaRef = useRef(categoria);
  const modelloRef = useRef(modello);
  const genereRef = useRef(genere);
  useEffect(() => {
    proporzioniRef.current = proporzioni;
    categoriaRef.current = categoria;
    modelloRef.current = modello;
    genereRef.current = genere;
  });
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
    scene.background = new THREE.Color(COLORE_SFONDO);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const luceAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
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

    const gruppoManichino = new THREE.Group();
    scene.add(gruppoManichino);

    const geoPavimento = new THREE.PlaneGeometry(6, 6);
    const materialePavimento = new THREE.ShadowMaterial({ opacity: 0.25 });
    const pavimento = new THREE.Mesh(geoPavimento, materialePavimento);
    pavimento.rotation.x = -Math.PI / 2;
    pavimento.position.y = -0.9;
    pavimento.receiveShadow = true;
    scene.add(pavimento);

    // il disegno piatto del capo, mostrato pulito davanti al manichino
    const materialeOverlay = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const geoOverlay = new THREE.PlaneGeometry(1, 1);
    const meshOverlay = new THREE.Mesh(geoOverlay, materialeOverlay);
    meshOverlay.visible = false;
    meshOverlay.renderOrder = 1;
    scene.add(meshOverlay);

    sceneRef.current = {
      gruppoManichino,
      controls,
      meshOverlay,
      modelloCorrente: null,
      genereCaricato: null,
      altezzaCorrente: 1,
    };

    let frameId;
    function anima() {
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

  // carica il modello FBX giusto per il genere
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
          if (figlio.isMesh && figlio.name === "body") {
            figlio.material = Array.isArray(figlio.material)
              ? figlio.material.map((m) => m.clone())
              : figlio.material.clone();
            const materiali = Array.isArray(figlio.material)
              ? figlio.material
              : [figlio.material];
            materiali.forEach((m) => {
              m.map = null;
              m.color.set(COLORE_PELLE);
              m.needsUpdate = true;
            });
          }
        });

        const bbox = new THREE.Box3().setFromObject(oggetto);
        const dimensioni = new THREE.Vector3();
        bbox.getSize(dimensioni);

        oggetto.updateMatrixWorld(true);
        [
          "mixamorigHips",
          "mixamorigSpine",
          "mixamorigSpine1",
          "mixamorigSpine2",
          "mixamorigNeck",
          "mixamorigLeftUpLeg",
          "mixamorigLeftLeg",
          "mixamorigLeftFoot",
        ].forEach((nome) => {
          const osso = oggetto.getObjectByName(nome);
          if (osso) {
            const pos = new THREE.Vector3();
            osso.getWorldPosition(pos);
            const frazione = (pos.y - bbox.min.y) / dimensioni.y;
            console.log(nome, "->", frazione.toFixed(3));
          }
        });

        oggetto.position.y = -bbox.min.y;
        oggetto.position.x = -(bbox.min.x + bbox.max.x) / 2;
        oggetto.position.z = -(bbox.min.z + bbox.max.z) / 2;

        s.altezzaNativaMM = dimensioni.y;
        deformaConOssa(oggetto, proporzioniRef.current);

        if (s.controls) {
          const altezzaModelloReale =
            dimensioni.y * SCALA_MM_A_METRI * s.altezzaCorrente;
          s.controls.target.set(0, -0.9 + altezzaModelloReale * 0.55, 0);
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

  // scala il corpo con le ossa e riposiziona la sovraimpressione del capo
  useEffect(() => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;

    const altezza = proporzioni.scalaAltezza;
    const scalaTotale = SCALA_MM_A_METRI * altezza;
    s.gruppoManichino.scale.set(scalaTotale, scalaTotale, scalaTotale);
    s.gruppoManichino.position.set(0, -0.9, 0);

    if (s.modelloCorrente) {
      deformaConOssa(s.modelloCorrente, proporzioni);
    }

    const yPiedi = -0.9;
    const altezzaModello =
      (s.altezzaNativaMM || 1900) * SCALA_MM_A_METRI * altezza;
    if (s.controls) {
      s.controls.target.set(0, yPiedi + altezzaModello * 0.55, 0);
    }

    const zona = zonaCapo(categoria, genere, proporzioni);
    if (zona && s.meshOverlay) {
      const yAlto = yPiedi + zona.a * altezzaModello;
      const yBasso = yPiedi + zona.da * altezzaModello;
      const centroY = (yAlto + yBasso) / 2;
      const altezzaOverlay = yAlto - yBasso;
      const fattoreVestibilita = vestibilita === "Oversize" ? 1.15 : 1;
      const aspetto = s.aspettoCapo || 0.6;
      const scalaLarghezza =
        categoria === "Gonne" || categoria === "Pantaloni"
          ? proporzioni.scalaFianchi * 1.6
          : proporzioni.scalaTorace;
      const larghezzaOverlay =
        altezzaOverlay * aspetto * scalaLarghezza * fattoreVestibilita;

      s.meshOverlay.position.set(0, centroY, altezzaModello * 0.06);
      s.meshOverlay.scale.set(larghezzaOverlay, altezzaOverlay, 1);
      s.meshOverlay.visible = !!s.meshOverlay.material.map;
    } else if (s.meshOverlay) {
      s.meshOverlay.visible = false;
    }

    s.altezzaCorrente = altezza;
  }, [proporzioni, categoria, modello, vestibilita]);

  // costruisce la texture del capo (trasparente, non deformata) per la
  // sovraimpressione
  useEffect(() => {
    if (!sceneRef.current) return;
    const s = sceneRef.current;

    if (!immagineCapo) {
      s.meshOverlay.visible = false;
      return;
    }

    let annullato = false;

    fetch(immagineCapo)
      .then((r) => r.text())
      .then((testoSvg) => {
        if (annullato) return;
        const { svgColorato, aspetto } = coloraSvg(testoSvg, coloreHex);
        s.aspettoCapo = aspetto;

        const immagine = new Image();
        immagine.onload = () => {
          if (annullato) return;
          const canvas = document.createElement("canvas");
          canvas.width = 1024;
          canvas.height = 1536;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(immagine, 0, 0, 1024, 1536);

          if (chiusura === "Bottoni") {
            ctx.fillStyle = "#2b2620";
            const numeroBottoni = 7;
            for (let i = 0; i < numeroBottoni; i++) {
              const y =
                canvas.height * (0.1 + i * (0.78 / (numeroBottoni - 1)));
              ctx.beginPath();
              ctx.arc(canvas.width / 2, y, canvas.width * 0.01, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (chiusura === "Zip") {
            ctx.strokeStyle = "#2b2620";
            ctx.lineWidth = canvas.width * 0.01;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height * 0.1);
            ctx.lineTo(canvas.width / 2, canvas.height * 0.88);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
              canvas.width / 2,
              canvas.height * 0.1,
              canvas.width * 0.016,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "#2b2620";
            ctx.fill();
          }

          if (tasche === "Toppa" || tasche === "A filo") {
            const y = canvas.height * 0.28;
            const larghezzaTasca = canvas.width * 0.14;
            const altezzaTasca = canvas.height * 0.09;
            const offsetX = canvas.width * 0.2;

            [-1, 1].forEach((lato) => {
              const x = canvas.width / 2 + lato * offsetX - larghezzaTasca / 2;

              if (tasche === "Toppa") {
                ctx.strokeStyle = "#2b2620";
                ctx.lineWidth = canvas.width * 0.004;
                ctx.strokeRect(x, y, larghezzaTasca, altezzaTasca);
              } else {
                ctx.strokeStyle = "#2b2620";
                ctx.lineWidth = canvas.width * 0.004;
                ctx.beginPath();
                ctx.moveTo(x, y + altezzaTasca);
                ctx.lineTo(x + larghezzaTasca, y + altezzaTasca);
                ctx.stroke();
              }
            });
          }

          if (spacco === "Laterale" || spacco === "Centrale") {
            const altezzaSpacco = canvas.height * 0.22;
            const yFine = canvas.height * 0.98;
            const yInizio = yFine - altezzaSpacco;
            const x =
              spacco === "Centrale"
                ? canvas.width / 2
                : canvas.width / 2 + canvas.width * 0.16;

            ctx.strokeStyle = "#2b2620";
            ctx.lineWidth = canvas.width * 0.006;
            ctx.beginPath();
            ctx.moveTo(x, yInizio);
            ctx.lineTo(x, yFine);
            ctx.stroke();
          }

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;

          s.meshOverlay.material.map = texture;
          s.meshOverlay.material.needsUpdate = true;
          s.meshOverlay.visible = true;

          const yPiedi2 = -0.9;
          const altezzaModello2 =
            (s.altezzaNativaMM || 1900) * SCALA_MM_A_METRI * s.altezzaCorrente;
          const zona2 = zonaCapo(
            categoriaRef.current,
            genereRef.current,
            proporzioniRef.current,
          );
          if (zona2) {
            const yAlto2 = yPiedi2 + zona2.a * altezzaModello2;
            const yBasso2 = yPiedi2 + zona2.da * altezzaModello2;
            const altezzaOverlay2 = yAlto2 - yBasso2;
            const fattoreVestibilita2 = vestibilita === "Oversize" ? 1.15 : 1;
            const scalaLarghezza2 =
              categoriaRef.current === "Gonne" ||
              categoriaRef.current === "Pantaloni"
                ? proporzioniRef.current.scalaFianchi * 1.6
                : proporzioniRef.current.scalaTorace;
            s.meshOverlay.scale.set(
              altezzaOverlay2 * aspetto * scalaLarghezza2 * fattoreVestibilita2,
              altezzaOverlay2,
              1,
            );
          }
        };
        immagine.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgColorato);
      })
      .catch((errore) => {
        console.error("Errore nel caricare la bozza:", errore);
      });

    return () => {
      annullato = true;
    };
  }, [immagineCapo, coloreHex, chiusura, tasche, spacco]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "480px", cursor: "grab" }}
    />
  );
}

export default Manichino3D;
