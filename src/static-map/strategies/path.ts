import { urlBuilder, locationBuilder } from './utils';

const pathStrategy = (props: AnyObject, mapProps: AnyObject = {}) => {
  const { weight, color, fillcolor, geodesic, points } = props;

  if (!points) {
    throw new Error('Path expects a valid points prop');
  }

  const urlParts = [];

  urlParts.push(urlBuilder('color', color, ':'));
  urlParts.push(urlBuilder('weight', weight, ':'));
  urlParts.push(urlBuilder('fillcolor', fillcolor, ':'));
  urlParts.push(urlBuilder('geodesic', geodesic, ':'));
  urlParts.push(urlBuilder('', locationBuilder(points), ''));

  const url = urlParts.filter(x => x).join('%7C');

  return `path=${url}`;
};

export default pathStrategy;
