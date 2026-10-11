// server.js - LuvTools Main Gateway Server
import http from 'http';
import { URL } from 'url';
import { handlePdfExtraction } from './tools/pdfExtractor.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // 1. Serve the Main LuvTools Dashboard UI
    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>LuvTools - Developer Utility Suite</title>
                <style>
                    body { font-family: monospace; background: #0f172a; color: #f8fafc; margin: 0; display: flex; height: 100vh; }
                    .sidebar { width: 260px; background: #1e293b; border-right: 1px solid #334155; padding: 20px; display: flex; flex-direction: column; }
                    h1 { font-size: 20px; color: #38bdf8; margin-top: 0; }
                    .nav-btn { background: transparent; color: #cbd5e1; border: none; padding: 12px; text-align: left; font-family: monospace; font-size: 14px; cursor: pointer; border-radius: 6px; margin-bottom: 5px; }
                    .nav-btn:hover, .nav-btn.active { background: #334155; color: #38bdf8; }
                    .content { flex: 1; padding: 40px; overflow-y: auto; }
                    .tool-panel { display: none; }
                    .tool-panel.active { display: block; }
                    .card { background: #1e293b; border: 1px solid #334155; padding: 30px; border-radius: 8px; max-width: 700px; }
                    h2 { color: #38bdf8; margin-top: 0; }
                    input[type="file"] { margin: 15px 0; color: #cbd5e1; }
                    button.action-btn { background: #38bdf8; color: #0f172a; border: none; padding: 10px 20px; font-weight: bold; cursor: pointer; border-radius: 4px; }
                    button.action-btn:hover { background: #0ea5e9; }
                    pre { background: #0f172a; border: 1px solid #334155; padding: 15px; max-height: 350px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; color: #34d399; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="sidebar">
                    <h1>🛠️ LuvTools</h1>
                    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 30px;">Modular Utility Suite</p>
                    <button class="nav-btn active" onclick="switchTool(event, 'pdf')">📄 PDF Extractor</button>
                    <button class="nav-btn" onclick="switchTool(event, 'image')">🖼️ Image Converter (Soon)</button>
                    <button class="nav-btn" onclick="switchTool(event, 'markdown')">📝 Markdown Viewer (Soon)</button>
                </div>

                <div class="content">
                    <!-- PDF Extractor Panel -->
                    <div id="panel-pdf" class="tool-panel active">
                        <div class="card">
                            <h2>PDF Text Extractor</h2>
                            <p>Extract raw text streams instantly from any uploaded PDF file.</p>
                            <input type="file" id="pdfFile" accept=".pdf">
                            <br>
                            <button class="action-btn" onclick="extractPdf()">Extract Text</button>
                            <pre id="pdfOutput">Extracted text will appear here...</pre>
                        </div>
                    </div>

                    <!-- Image Converter Placeholder -->
                    <div id="panel-image" class="tool-panel">
                        <div class="card">
                            <h2>Image Converter</h2>
                            <p>This module is staged for your next tool integration!</p>
                        </div>
                    </div>

                    <!-- Markdown Viewer Placeholder -->
                    <div id="panel-markdown" class="tool-panel">
                        <div class="card">
                            <h2>Markdown Viewer</h2>
                            <p>This module is staged for live Markdown rendering!</p>
                        </div>
                    </div>
                </div>

                <script>
                    function switchTool(evt, toolId) {
                        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                        document.querySelectorAll('.tool-panel').forEach(panel => panel.classList.remove('active'));
                        
                        evt.currentTarget.classList.add('active');
                        document.getElementById('panel-' + toolId).classList.add('active');
                    }

                    async function extractPdf() {
                        const fileInput = document.getElementById('pdfFile');
                        const output = document.getElementById('pdfOutput');

                        if (fileInput.files.length === 0) {
                            alert('Please select a PDF file first!');
                            return;
                        }

                        const file = fileInput.files[0];
                        output.innerText = 'Extracting text streams... Please wait...';

                        try {
                            const response = await fetch('/api/pdf-extract', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/pdf' },
                                body: file
                            });

                            const result = await response.json();
                            if (response.ok) {
                                output.innerText = result.text || 'No text found in this PDF.';
                            } else {
                                output.innerText = 'Error: ' + (result.error || 'Failed to parse PDF');
                            }
                        } catch (err) {
                            output.innerText = 'Network Error: ' + err.message;
                        }
                    }
                </script>
            </body>
            </html>
        `);
    }

    // 2. API Route Dispatcher for PDF Extraction
    else if (req.method === 'POST' && pathname === '/api/pdf-extract') {
        await handlePdfExtraction(req, res);
    } 
    
    // 3. Fallback for Unknown Routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 LuvTools Gateway running at http://localhost:${PORT}`);
});