import openapiTS, { astToString } from 'openapi-typescript';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specPath = resolve(__dirname, '../openapi.yaml');
const outDir = resolve(__dirname, '../src/generated');
const outFile = resolve(outDir, 'api.d.ts');

const ast = await openapiTS(new URL(`file://${specPath}`));
const content = astToString(ast);

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, content);
console.log(`Generated: ${outFile}`);
