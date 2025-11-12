export function formatIsoDateToBR(iso?: string): string {
  if (!iso) return ''
  // iso pode ser 'YYYY', 'YYYY-MM' ou 'YYYY-MM-DD'
  const parts = iso.split('-')
  if (parts.length === 1) {
    return `01/01/${parts[0]}`
  }
  if (parts.length === 2) {
    const [y, m] = parts
    return `01/${m.padStart(2, '0')}/${y}`
  }
  const [y, m, d] = parts
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}


