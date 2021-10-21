// The export is needed here to generate a valid polyfills.metadata.json file
export function eycChartsPolyfills() {
  // IE11 fix
  if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype.contains === 'undefined') {
    SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
  }
}
