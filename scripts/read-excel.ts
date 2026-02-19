import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'Brilly_PhD_Learning_Roadmap.xlsx';

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0]; // Assume first sheet
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

fs.writeFileSync('excel-dump.json', JSON.stringify(data, null, 2));
console.log('Done writing excel-dump.json');
