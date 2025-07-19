import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") //accents 
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// // pour utiliser cette fonction, faut absolument que le paramètre soit au format "label-id". 
// // par exemple [labelAndId]/page.tsx

export function parseParamsUrlFromId(param: string) {
  const parts = param.split('-');
  const id = parts.pop() ?? '';
  const label = parts.join('-');

  if (!id || id.length < 5) {
    throw new Error('ID invalide dans l’URL');
  }

  return { id, label };
}


export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD") // enleve accents
    .replace(/[\u0300-\u036f]/g, '') // enleve caractères diacritiques
    .replace(/[^a-z0-9]+/g, '-') // remplace tout sauf lettres/chiffres par -
    .replace(/^-+|-+$/g, ''); // trim les tirets en trop
}