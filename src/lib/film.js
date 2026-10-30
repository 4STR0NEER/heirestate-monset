// A film's file for this screen: phones get the 960px cut, everything wider the 1080p one.
const small = typeof matchMedia === "function" && matchMedia("(max-width: 767px)").matches;
export const film = (base) => `${base}${small ? "-sm" : ""}.mp4`;
