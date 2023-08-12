import { useEffect, useRef, useState } from "react";
import BabylonCanvas from "./components/BabylonCanvas";
import styles from "./App.module.css";
import mapboxgl, { type Map } from "mapbox-gl";
import { MapboxService } from "./services/mapbox";

mapboxgl.accessToken = MapboxService.token;

function App() {
  const isCaptureDisabled = useCaptureFlag();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const { lng, lat, zoom, mapContainer } = useMap();

  return (
    <div className={`${styles.app}`}>
      <span style={isMapVisible ? {} : { display: "none" }}>
        <div className={`${styles.sidebar}`}>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <button
        style={{cursor: isCaptureDisabled ? "not-allowed" : "pointer"}}
          disabled={isCaptureDisabled}
          onClick={() => {
            MapboxService.image.bounds = [lng, lat, zoom];
            MapboxService.image.getBlobUrl().then(() => {
              setIsMapVisible(false);
            });
          }}
          className={`${styles.captureButton}`}
        >
          {isCaptureDisabled ? "Loading..." : "Capture"}
        </button>
        <div ref={mapContainer} className={`${styles.mapContainer}`} />
      </span>
      <BabylonCanvas />
    </div>
  );
}

export default App;

const useMap = () => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [lng, setLng] = useState(82.9965);
  const [lat, setLat] = useState(25.2902);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.on("move", () => {
      setLng(+map.current!.getCenter().lng.toFixed(4));
      setLat(+map.current!.getCenter().lat.toFixed(4));
      setZoom(+map.current!.getZoom().toFixed(2));
    });
  });

  return { lng, lat, zoom, mapContainer };
};

const useCaptureFlag = () => {
  const [isCaptureDisabled, setIsCaptureDisabled] = useState(true);

  useEffect(() => {
    const handleSceneLoaded = () => {
      setIsCaptureDisabled(false);
    };
    document.addEventListener("scene_loaded", handleSceneLoaded);
    return () => {
      document.removeEventListener("scene_loaded", handleSceneLoaded);
    };
  }, []);

  return isCaptureDisabled;
};
