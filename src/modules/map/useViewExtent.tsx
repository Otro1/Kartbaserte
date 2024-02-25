import { useContext, useEffect, useState } from "react";
import { MapContext } from "./MapContext";

export function useViewExtent() {
  const { map } = useContext(MapContext);
  const [extent, setExtent] = useState(
    () => map.getView().getViewStateAndExtent().extent,
  );

  function setExtentFromView() {
    setExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    map.getView().on("change", setExtentFromView);
    setTimeout(setExtentFromView, 200);
    return () => {
      map.getView().un("change", setExtentFromView);
    };
  }, [map.getView()]);

  return extent;
}
