import { add } from "./math.js";

const evaluated = new Date().toISOString();

export default function tools(): string {
  return `Hello from tools.ts!! ${evaluated} 1 + 2 = ${add(1, 2)}`;
}
