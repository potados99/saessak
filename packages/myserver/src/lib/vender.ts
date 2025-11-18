const evaluated = new Date().toISOString();

export default function vender(): string {
  return `Hello from vender.ts!! ${evaluated}`;
}

