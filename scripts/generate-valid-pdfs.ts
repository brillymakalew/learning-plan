
import * as fs from 'fs';
import * as path from 'path';

// Valid minimal PDF (Hello World)
const pdfBase64 = "JVBERi0xLjQKJcFsj6IKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEpezU6NDM4fT4+Pj4vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDQ+PpstreamCkJUIC9GMSAyNCBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iago2IDAgb2JqCjw8L1Byb2R1Y2VyKHBkZm1hZGUuY29tKS9DcmVhdGlvbkRhdGUoRDoyMDI1MDIxOTEwMzY1NiswMCcwMCcpPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxMTcgMDIwMDAgbiAKMDAwMDAwMDI3OCAwMDAwMCBuIAowMDAwMDAwMzcyIDAwMDAwIG4gCjAwMDAwMDA0NjAgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDcvUm9vdCAxIDAgUi9JbmZvIDYgMCBSPj4Kc3RhcnR4cmVmCjU2NAolJUVPRgo=";

const pdfBuffer = Buffer.from(pdfBase64, 'base64');

const simulationDir = path.join(process.cwd(), 'public', 'uploads', 'simulation');

if (fs.existsSync(simulationDir)) {
    const files = fs.readdirSync(simulationDir);
    let count = 0;
    for (const file of files) {
        if (file.endsWith('.pdf')) {
            const filePath = path.join(simulationDir, file);
            fs.writeFileSync(filePath, pdfBuffer);
            console.log(`Fixed: ${file}`);
            count++;
        }
    }
    console.log(`Fixed ${count} PDF files.`);
} else {
    console.log("No simulation directory found.");
}
