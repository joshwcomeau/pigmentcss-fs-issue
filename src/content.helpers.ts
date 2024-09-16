import fs from 'fs/promises';

export async function loadContent() {
  const data = await fs.readFile('./data.txt', 'utf-8');
  return data;
}
