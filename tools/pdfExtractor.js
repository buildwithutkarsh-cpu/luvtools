import pdfParse from 'pdf-parse' ;

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
            const data = await pdfParse(pdfBuffer);
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({
                numPages: data.numpages,
                text: data.text
            }))
        }catch(error){
            res.writeHead(500,{'Content-Type':'application/json'});
            res.end(JSON.stringify({error:'Failed to extract text from PDF'}));
        }

    })
}