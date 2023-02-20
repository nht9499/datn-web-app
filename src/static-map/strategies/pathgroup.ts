import pathStrategy from "./path";

const pathGroupStrategy = (props: AnyObject, mapProps: AnyObject) => {
  const { weight, color, fillcolor, geodesic, paths } = props;

  const points = paths.map((path: AnyObject) => path.points);

  return pathStrategy({ weight, color, fillcolor, geodesic, points });
};

export default pathGroupStrategy;
