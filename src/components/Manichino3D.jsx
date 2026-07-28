import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function Manichino3D({ proporzioni, coloreHex }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  // setup della scena, una sola volta al montaggio del componente
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
    mount.appendChild(renderer.domElement);

    const luceAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
    const luceDirezionale = new THREE.DirectionalLight(0xffffff, 0.8);
    luceDirezionale.position.set(2, 4, 3);
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

    // geometrie "unitarie" (raggio/altezza 1): le rendiamo grandi o
    // piccole cambiando solo la scala, non la geometria stessa
    const geoSfera = new THREE.SphereGeometry(1, 24, 24);
    const geoCilindro = new THREE.CylinderGeometry(1, 1, 1, 20);

    const testa = new THREE.Mesh(geoSfera, materialeCorpo);
    const busto = new THREE.Mesh(geoCilindro, materialeCapo);
    const bacino = new THREE.Mesh(geoCilindro, materialeCorpo);
    const braccioSx = new THREE.Mesh(geoCilindro, materialeCapo);
    const braccioDx = new THREE.Mesh(geoCilindro, materialeCapo);
    const gambaSx = new THREE.Mesh(geoCilindro, materialeCorpo);
    const gambaDx = new THREE.Mesh(geoCilindro, materialeCorpo);

    scene.add(testa, busto, bacino, braccioSx, braccioDx, gambaSx, gambaDx);

    sceneRef.current = {
      materialeCapo,
      mesh: { testa, busto, bacino, braccioSx, braccioDx, gambaSx, gambaDx },
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

  // ogni volta che cambiano le misure, ridimensioniamo i pezzi del manichino
  useEffect(() => {
    if (!sceneRef.current) return;
    const { mesh } = sceneRef.current;

    const altezza = proporzioni.scalaAltezza;
    const raggioTorace = (proporzioni.larghezzaTorace / 64) * 0.55;
    const raggioFianchi = (proporzioni.larghezzaFianchi / 66) * 0.5;
    const raggioSpalle = proporzioni.larghezzaSpalle / 70;

    mesh.testa.scale.set(0.32, 0.32, 0.32);
    mesh.testa.position.set(0, 1.55 * altezza, 0);

    mesh.busto.scale.set(raggioTorace, 0.75 * altezza, raggioTorace);
    mesh.busto.position.set(0, 1.05 * altezza, 0);

    mesh.bacino.scale.set(raggioFianchi, 0.3 * altezza, raggioFianchi);
    mesh.bacino.position.set(0, 0.6 * altezza, 0);

    const offsetBraccio = raggioSpalle * 0.75;
    mesh.braccioSx.scale.set(0.16, 0.6 * altezza, 0.16);
    mesh.braccioSx.position.set(-offsetBraccio, 0.95 * altezza, 0);
    mesh.braccioDx.scale.set(0.16, 0.6 * altezza, 0.16);
    mesh.braccioDx.position.set(offsetBraccio, 0.95 * altezza, 0);

    mesh.gambaSx.scale.set(0.22, 0.85 * altezza, 0.22);
    mesh.gambaSx.position.set(-0.22, -0.05 * altezza, 0);
    mesh.gambaDx.scale.set(0.22, 0.85 * altezza, 0.22);
    mesh.gambaDx.position.set(0.22, -0.05 * altezza, 0);
  }, [proporzioni]);

  // il colore del capo cambia dal vivo, senza ricostruire la scena
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.materialeCapo.color.set(coloreHex);
  }, [coloreHex]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "480px", cursor: "grab" }}
    />
  );
}

export default Manichino3D;
