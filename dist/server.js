import http from "http";
import { readFile } from "fs/promises";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = 9991;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

http
  .createServer(async (req, res) => {
    const filePath =
      req.url === "/"
        ? join(__dirname, "index.html")
        : join(__dirname, req.url);

    try {
      const data = await readFile(filePath);
      const type = MIME[extname(filePath)] ?? "application/octet-stream";

      res.writeHead(200, { "Content-Type": type });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(PORT, () => {
  });
