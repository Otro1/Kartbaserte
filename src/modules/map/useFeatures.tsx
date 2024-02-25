import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { MouseEvent, useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./MapContext";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

export function useFeatures<T extends Feature>(
  layerPredicate: (layer: Layer) => boolean,
) {
  const { vectorLayers, map } = useContext(MapContext);

  const viewExtent = useViewExtent();

  const layer = useMemo(
    () => vectorLayers.find(layerPredicate) as VectorLayer<any>,
    [vectorLayers],
  );

  const [features, setFeatures] = useState<T[]>([]);

  const visibleFeatures = useMemo(
    () => features.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );
  const [activeFeature, setActiveFeature] = useState<T>();

  // @ts-ignore TODO Should probably somehow fix this
  function handlePointermove(e: MapBrowserEvent<MouseEvent>) {
    const features = layer?.getSource().getFeaturesAtCoordinate(e.coordinate);
    setActiveFeature(features?.length === 1 ? features[0] : undefined);
  }

  useEffect(() => {
    if (layer) {
      map.on("pointermove", handlePointermove);
    }
    return () => map.un("pointermove", handlePointermove);
  }, [map, layer]);

  function loadFeatures() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }

  useEffect(() => {
    layer?.on("change", loadFeatures);
    loadFeatures();
    return () => {
      layer?.un("change", loadFeatures);
      setFeatures([]);
    };
  }, [layer]);
  return { features, visibleFeatures, activeFeature, setActiveFeature };
}
