export function urlBuilder(property: string, value: string, separator: string) {
  if (value) {
    return `${property}${separator}${value}`;
  }

  return null;
}

export function locationBuilder(location: AnyObject): string {
  const urlParts = [];

  if (Array.isArray(location)) {
    const arrParts = location.map((val: AnyObject) => locationBuilder(val));
    urlParts.push(...arrParts);
  }

  if (typeof location === 'string' || typeof location === 'number') {
    urlParts.push(location);
  }

  if (typeof location === 'object' && location.lat && location.lng) {
    urlParts.push(`${location.lat},${location.lng}`);
  }

  return urlParts.join('%7C');
}
