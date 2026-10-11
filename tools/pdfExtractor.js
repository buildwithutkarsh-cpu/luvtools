import {createRequire} from 'module';
import { PDFParse } from 'pdf-parse';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function handlePdfExtraction(req, res){
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', async () => {
        try{
            const pdfBuffer = Buffer.concat(chunks);
            if(pdfBuffer.length ===0){
                res.writeHead(400,{'Content-Type':'applocation/json'});
                res.end(JSON.stringify({error:'Empty File Uploaded'}));
                return;
            }
            parser = new PDFParse({data : pdfBuffer});
            const result = await parser.getText();
            
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({
                numPages: result.total,
                text: result.text
            }))
        }catch(error){
            console.error('PDF Parse Error Details',error)
            res.writeHead(500,{'Content-Type':'application/json'});
            res.end(JSON.stringify({ error: error.message ||'Failed to extract text from PDF'}));
        }

    })
}