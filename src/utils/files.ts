// Files picked from different folders can share a name, which would overwrite each other
// in the zip, so later ones become e.g. "photo (1).jpg"
export const uniqueName = (name: string, taken: Set<string>) => {
  const dot = name.lastIndexOf('.')
  const [base, extension] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
  let unique = name
  for (let i = 1; taken.has(unique.toLowerCase()); i++) unique = `${base} (${i})${extension}`
  taken.add(unique.toLowerCase())
  return unique
}
