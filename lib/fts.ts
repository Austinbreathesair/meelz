export function normalize(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu, '');
}

