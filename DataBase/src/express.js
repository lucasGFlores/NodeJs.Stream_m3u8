const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const { error } = require("console");
const TaskModel = require("../models/task.model");
const { createReadStream, fsync } = require("fs");
const { request } = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const ffmpeg = require("ffmpeg.js");
const { type } = require("express/lib/response");
const { writeJs } = require("./MANAGER/jsonManager.js");
// const {writeJs,updateJson} = require("./MANAGER/fileManager.js")
const { download, getInfoRecent } = require("./DAO/videoDao");
const port = 5000;

app.use(session({ secret: "djasiofhndiodhnigoqh" }));
// evita conflito de requisições
app.use(cors());

app.use(express.json());
app.get("/noticias/:sexo", (req, res) => {
  getInfoRecent()
  // download()
  res.json([
    {
      titulo: "uma noticias mutcho cu",
    },
    {
      titulo: "indianos foram encontrados no porão de uma e-girl",
    },
    {
      titulo:
        "um grupo neo nazista foi preso.'O QUE TEM DE ERRADO EM MATAR JUDEU!!???' diz bola um dos integrantes",
    },
    {
      titulo:
        "Aluno do Senai realiza um atentado terrorista nos USA e China anunciando 'ESSES MERDAS QUE ME OBRIGAM A LIGAR MEU VENTILADOR NO 3'",
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
