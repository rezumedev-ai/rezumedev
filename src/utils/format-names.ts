
export function getInitials(name: string): string {
  if (!name) return "?";
  
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
