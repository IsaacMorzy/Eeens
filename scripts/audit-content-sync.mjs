#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = process.cwd();
const pageSchemaPath = join(root, 'tina/collections/page.ts');
const propertySchemaPath = join(root, 'tina/collections/property.ts');
const blocksPath = join(root, 'src/components/blocks/Blocks.astro');
const pageContentDir = join(root, 'src/content/page');
const propertyContentDir = join(root, 'src/content/property');

const failures = [];
const read = (path) => {
	if (!existsSync(path)) {
		failures.push(`missing ${path.replace(`${root}/`, '')}`);
		return '';
	}
	return readFileSync(path, 'utf8');
};

const pageSchema = read(pageSchemaPath);
const propertySchema = read(propertySchemaPath);
const blocks = read(blocksPath);

const schemaImports = new Map();
for (const match of pageSchema.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+\.template)['"]/g)) {
	const [, names, source] = match;
	const templatePath = resolve(dirname(pageSchemaPath), source.endsWith('.ts') ? source : `${source}.ts`);
	for (const name of names.split(',')) {
		const importedName = name.trim().split(/\s+as\s+/)[0];
		if (importedName) schemaImports.set(importedName, templatePath);
	}
}

const templateMatch = pageSchema.match(/templates:\s*\[([\s\S]*?)\n\s*\]/);
const templateNames = templateMatch
	? [...templateMatch[1].matchAll(/\b([A-Za-z_]\w*Schema)\b/g)].map((match) => match[1])
	: [];

for (const templateName of templateNames) {
	const templatePath = schemaImports.get(templateName);
	if (!templatePath) {
		failures.push(`PageCollection template ${templateName} has no resolvable import`);
		continue;
	}
	const templateSource = read(templatePath);
	const schemaNameMatch = templateSource.match(new RegExp(`export const ${templateName}\\s*:\\s*Template\\s*=\\s*\\{[\\s\\S]*?\\bname:\\s*['"]([^'"]+)['"]`));
	const typeName = schemaNameMatch?.[1];
	if (!typeName) {
		failures.push(`${templateName} has no resolvable Tina schema name`);
		continue;
	}
	const blockTypeName = `PageBlocks${typeName.charAt(0).toUpperCase()}${typeName.slice(1)}`;
	if (!blocks.includes(blockTypeName)) {
		failures.push(`${blockTypeName} is registered in Tina but not dispatched by Blocks.astro`);
	}
}

for (const [templateName, typeName] of [['galleryBlockSchema', 'PageBlocksGallery'], ['careersFormBlockSchema', 'PageBlocksCareersForm']]) {
	if (!templateNames.includes(templateName)) failures.push(`${typeName} is not registered in PageCollection`);
	if (!blocks.includes(typeName)) failures.push(`${typeName} is not dispatched by Blocks.astro`);
}

for (const slug of ['events', 'gallery', 'awards', 'careers']) {
	if (!existsSync(join(pageContentDir, `${slug}.mdx`))) failures.push(`missing page content src/content/page/${slug}.mdx`);
}

if (!propertySchema.includes("path: 'src/content/property'")) failures.push('PropertyCollection does not own src/content/property');
const propertyFiles = existsSync(propertyContentDir)
	? readdirSync(propertyContentDir).filter((file) => file.endsWith('.mdx'))
	: [];
if (propertyFiles.length === 0) failures.push('no property content records found under src/content/property');

if (failures.length > 0) {
	console.error('audit:content-sync: FAIL');
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}

console.log(`audit:content-sync: ${templateNames.length} Tina page templates, ${propertyFiles.length} property records, and required editorial pages are aligned ✓`);
