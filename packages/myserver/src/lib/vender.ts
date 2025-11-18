const evaluated = new Date().toISOString();
console.log(`vender.ts evaluated: ${evaluated}`);

export default function vender(): string {
  return `Hello from vender.ts!! ${evaluated}`;
}

