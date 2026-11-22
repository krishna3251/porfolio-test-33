export function tiltSurface(event) {
  if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
  const { currentTarget, clientX, clientY } = event;
  const bounds = currentTarget.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const x = (clientX - bounds.left) / bounds.width - 0.5;
  const y = (clientY - bounds.top) / bounds.height - 0.5;
  currentTarget.style.setProperty("--depth-x", `${(-y * 7).toFixed(2)}deg`);
  currentTarget.style.setProperty("--depth-y", `${(x * 9).toFixed(2)}deg`);
}

export function resetSurface(event) {
  event.currentTarget.style.removeProperty("--depth-x");
  event.currentTarget.style.removeProperty("--depth-y");
}
