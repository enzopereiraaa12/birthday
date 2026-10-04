export function defaultPasswordFor(firstName: string) {
  return `${firstName.trim().toLowerCase()}2000`;
}

export function normalizeFirstName(firstName: string) {
  return firstName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
