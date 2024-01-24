import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { Switch } from "@material-ui/core";
import React from "react";

type KommuneProperties = {
  kommunenummer: string;
  navn: {
    sprak: string;
    navn: string;
  }[];
};

type KommuneFeature = Feature<Polygon> & {
  getProperties(): KommuneProperties;
};

const kommuneSource = new VectorSource<KommuneFeature>({
  url: "/KartbaserteF2/kommuner.json",
  format: new GeoJSON(),
});
const kommuneLayer = new VectorLayer({
  source: kommuneSource,
});

export function KommuneLayerCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);
  const [selectedKommune, setSelectedKommune] = useState<
    KommuneFeature | undefined
  >();
  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommune = kommuneSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as KommuneFeature[];
    if (clickedKommune.length === 1) {
      setSelectedKommune(clickedKommune[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedKommune(undefined);
      overlay.setPosition(undefined);
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      map.un("click", handleClick);
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <Switch
          checked={checked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setChecked(e.target.checked)
          }
          name="checked"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />
        {checked ? "Hide" : "Show"} kommune layer
      </label>
      <div ref={overlayRef} className={"kommune-overlay"}>
        {selectedKommune && (
          <>
            {
              (selectedKommune.getProperties() as KommuneProperties).navn.find(
                (n) => n.sprak === "nor",
              )!.navn
            }
          </>
        )}
      </div>
    </div>
  );
}
