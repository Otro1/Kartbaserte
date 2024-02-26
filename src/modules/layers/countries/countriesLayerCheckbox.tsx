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
import { countriesLayer, selectedStyle } from "./countriesLayer";
import { useFeatures } from "../../map/useFeatures";

type CountryProperties = {
  ADMIN: string;
  ISO_A3: string;
};

type CountryFeature = Feature<Polygon> & {
  getProperties(): CountryProperties;
};

export function CountriesLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<
    CountryFeature | undefined
  >();

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  const { setLayers, map } = useContext(MapContext);

  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<CountryFeature>((l) => l.getClassName() === "country");

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
    const source = countriesLayer.getSource();
    if (source) {
      const country = source.getFeaturesAtCoordinate(e.coordinate) as
        | CountryFeature[]
        | null;
      if (country && country.length === 1) {
        setActiveFeature(country[0]);
      } else {
        setActiveFeature(undefined);
      }
    }
  }

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const source = countriesLayer.getSource();
    if (source) {
      const clickedCountry = source.getFeaturesAtCoordinate(e.coordinate) as
        | CountryFeature[]
        | null;
      if (clickedCountry && clickedCountry.length === 1) {
        setSelectedCountry(clickedCountry[0]);
        overlay.setPosition(e.coordinate);
      } else {
        setSelectedCountry(undefined);
        overlay.setPosition(undefined);
      }
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, countriesLayer]);
      map.on("click", handleClick);
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== countriesLayer));
      map.un("click", handleClick);
      map.un("pointermove", handlePointerMove);
    };
  }, [checked]);

  return (
    <>
      <span className="countriesCheckbox">
        <button
          className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
          onClick={() => setChecked(!checked)}
        >
          {checked ? "Hide" : "Show"} Countries
        </button>
        <div ref={overlayRef} className="info">
          {selectedCountry && (
            <>
              <strong>{selectedCountry.getProperties().ADMIN}</strong>
              <br />
              <span>{selectedCountry.getProperties().ISO_A3}</span>
            </>
          )}
        </div>
      </span>
    </>
  );
}
