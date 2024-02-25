import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { Map } from "ol";
import { Layer } from "ol/layer";

type MapContextType = {
  map: Map;
  vectorLayers: Layer[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  setBaseLayer: Dispatch<SetStateAction<Layer>>;
  setVectorLayers: Dispatch<SetStateAction<Layer[]>>; // Add this line
};

export const MapContext = createContext<MapContextType | undefined>(undefined);

export function useLayer(layer: Layer, checked: boolean) {
  const mapContext = useContext(MapContext);
  const { map, setVectorLayers } = mapContext || {};

  useEffect(() => {
    if (checked && setVectorLayers) {
      setVectorLayers((old: any) => [...old, layer]);
      map?.addLayer(layer); // Add the layer to the map
    } else {
      map?.removeLayer(layer); // Remove the layer from the map
    }
    return () => {
      if (setVectorLayers) {
        setVectorLayers((old: any[]) => old.filter((l: Layer) => l !== layer));
      }
      map?.removeLayer(layer); // Remove the layer from the map when the component unmounts
    };
  }, [checked, setVectorLayers, map]);
}
