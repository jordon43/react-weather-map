import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styles from "./styles/app.module.sass";
import { observer } from "mobx-react-lite";
import WeatherInfo from "./stores/weather-info";

const generateMaterials = (texts) => {
  return texts.map((text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 256;

    context.fillStyle = "#81adff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "18px Arial";
    context.lineWidth = "bold";
    context.fillStyle = "#000000";
    context.textAlign = "center";

    const centerX = canvas.width / 2;
    context.fillText(text.date, centerX, 30);
    context.fillText("Днем: " + text.temperature_day + "°C", centerX, 80);
    context.fillText("Ночью: " + text.temperature_night + "°C", centerX, 100);
    context.fillText("Погода: " + text.weather, centerX, 170);
    context.fillText(text.day, centerX, 230);

    const texture = new THREE.CanvasTexture(canvas);

    return new THREE.MeshBasicMaterial({ map: texture });
  });
};

const App = observer(() => {
  const { listWeatherData, getWeatherData } = WeatherInfo;
  const cubeRef = useRef();

  useEffect(() => {
    getWeatherData();
  }, []);

  return (
    <div className={"app"}>
      {listWeatherData !== null ? (
        <div className={styles.blockCube}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            <group ref={cubeRef}>
              <mesh material={generateMaterials(listWeatherData)}>
                <boxGeometry args={[3, 3, 3]} />
              </mesh>
            </group>

            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      ) : (
        <div className={styles.waitDownload}>
          <p>Загрузка прогноза погоды ...</p>
        </div>
      )}
    </div>
  );
});

export default App;
