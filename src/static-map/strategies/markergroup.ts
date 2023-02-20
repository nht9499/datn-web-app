import markerStrategy from "./marker";

const markerGroupStrategy = (props: AnyObject, mapProps: AnyObject) => {
  const { size, color, label, anchor, iconURL, markers, scale } = props;

  const location = markers.map((marker: AnyObject) => marker.location);

  return markerStrategy(
    { size, color, label, anchor, iconURL, location, scale },
    mapProps
  );
};

export default markerGroupStrategy;
