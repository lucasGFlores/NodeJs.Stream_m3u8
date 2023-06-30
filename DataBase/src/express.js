const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { download, getInfoRecent } = require("./DAO/videoDao");
const JsonManager = require("./MANAGER/jsonManager");
const port = 5000;

app.use(session({ secret: "djasiofhndiodhnigoqh" }));
// evita conflito de requisições
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
 JsonManager.getInstance().filerDuplicateJson();
JsonManager.getInstance().writeJs({titulo: "teste", downloadURL: "teste", tags: ["teste"]});
const json = require("./videos.json")
res.status(200).json(JsonManager.getInstance().json);
});


app.get("/noticias/:sexo", async (req, res) => {
  getInfoRecent()
 
  res.json([
    {
      titulo: "uma noticias mutcho cu",
    },
    {
      titulo: "indianos foram encontrados no porão de uma e-girl",
    },

  ]);
});

app.get("/videos/:path", async (req, res) => {
  let path = "./src/videos/isekai-kita-no-de-special-skill-2.mp4";
  let stat2 = fs.statSync(path);
  let total = stat2.size;

  if (req.headers.range) {
    let range = req.headers.range;
    let parts = range.replace(/bytes=/, "").split("-");
    let partialstart = parts[0];
    let partialend = parts[1];
    let start = parseInt(partialstart, 10);
    let end = partialend ? parseInt(partialend, 10) : total - 1;
    let chunksize = end - start + 1;
    let file = fs.createReadStream(path, { start: start, end: end });
    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": total,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(port, () => {
  console.log(`rodando na porta ${port}`);
});
