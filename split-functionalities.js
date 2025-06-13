const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'memory-bank', 'functionalityMap.md');
const outputDirPath = path.join(__dirname, 'memory-bank', 'funcionalidades');

// Ensure output directory exists
if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
}

// Function to convert string to kebab-case
function toKebabCase(str) {
    return str
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase(); // Convert to lowercase
}

try {
    const content = fs.readFileSync(inputFilePath, 'utf8');

    // Split the content by the functionality header
    const sections = content.split(/(?=^## ✅ Funcionalidad: )/gm);

    sections.forEach(section => {
        if (section.trim() === '') return;

        const lines = section.split('\n');
        const firstLine = lines[0];

        if (firstLine.startsWith('## ✅ Funcionalidad: ')) {
            const functionalityName = firstLine.replace('## ✅ Funcionalidad: ', '').trim();
            const fileName = toKebabCase(functionalityName) + '.md';
            const filePath = path.join(outputDirPath, fileName);

            // Change header from ## to #
            const newContent = '#' + section.substring(2); // Remove first two '#'

            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Created: ${filePath}`);
        }
    });

    console.log('Phase 1: Functionalities migrated successfully. Original file not deleted yet.');

} catch (error) {
    console.error('Error during file processing:', error);
}
