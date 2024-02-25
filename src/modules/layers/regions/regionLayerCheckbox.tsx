import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContext } from "../../map/MapContext";
import { Feature, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { regionLayer, selectedStyle } from "./RegionLayer";
import { useFeatures } from "../../map/useFeatures";

type RegionProperties = {
  navn: string;
  url: string;
};

type RegionFeature = Feature<Polygon> & {
  getProperties(): RegionProperties;
};

export function RegionLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<
    RegionFeature | undefined
  >();

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  const { setLayers, map } = useContext(MapContext);

  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<RegionFeature>((l) => l.getClassName() === "region");

  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const source = regionLayer.getSource();
    if (source) {
      const region = source.getFeaturesAtCoordinate(e.coordinate) as
        | RegionFeature[]
        | null;
      if (region && region.length === 1) {
        setActiveFeature(region[0]);
      } else {
        setActiveFeature(undefined);
      }
    }
  }

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const source = regionLayer.getSource();
    if (source) {
      const clickedRegion = source.getFeaturesAtCoordinate(e.coordinate) as
        | RegionFeature[]
        | null;
      if (clickedRegion && clickedRegion.length === 1) {
        setSelectedRegion(clickedRegion[0]);
        overlay.setPosition(e.coordinate);
      } else {
        setSelectedRegion(undefined);
        overlay.setPosition(undefined);
      }
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, regionLayer]);
      map.on("click", handleClick);
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== regionLayer));
      map.un("click", handleClick);
      map.un("pointermove", handlePointerMove);
    };
  }, [checked]);

  return (
    <>
      <span className="regionCheckbox">
        <button
          className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
          onClick={() => setChecked(!checked)}
        >
          {checked ? "Hide" : "Show"} Regions
        </button>
        <div ref={overlayRef} className="info">
          {selectedRegion && (
            <>
              <strong>{selectedRegion.getProperties().navn}</strong>
              <br />
              <a href={selectedRegion.getProperties().url}>
                {selectedRegion.getProperties().url}
              </a>
            </>
          )}
        </div>
      </span>
    </>
  );
}
