// Runs at client startup, before any app chunk (incl. three.js / R3F) loads.
// Silences three.js' harmless THREE.Clock deprecation notice — R3F 9's render
// loop still constructs a THREE.Clock, which logs once it mounts. We drop ONLY
// that exact line and pass every other warning through untouched.
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock") &&
    args[0].includes("deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};
