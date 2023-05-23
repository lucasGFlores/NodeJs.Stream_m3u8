//O objetivo disso é pegar os .m3u8 e instalar
const { spawn } = require("child_process");
const fs = require("fs");
const { updateJson, writeJs } = require("../MANAGER/jsonManager.js");
const download = async () => {
  const json = require("../videos.json");
  if (!fs.existsSync("./src/videos/")) {
    fs.mkdirSync("./src/videos/");
  }
  const jsonFiltrado = json.video.filter((obj) => obj.caminho === undefined);
  jsonFiltrado.forEach((obj) => {
    const ffmpegProcess = spawn(
      "ffmpeg",
      [
        "-i",
        `${obj.downloadURL}`,
        "-f",
        "mp4",
        "-c",
        "copy",
        "-bsf:a",
        "aac_adtstoasc",

        `./src/videos/${obj.titulo}.mp4`,
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    obj.caminho = `./src/videos/${obj.titulo}.mp4`;
    ffmpegProcess.stdout;
    updateJson({
      titulo: obj.titulo,
      caminho: `./src/videos/${obj.titulo}.mp4`,
    });
  });
};

const getInfoRecent = (blackList = ["rape"]) => {
  const json = require("../videos.json");
  const jsonRecent = require("../recent.json");
    const results = jsonRecent.results.filter((obj) => { 
      return json.video.some((video) => {
        //se o nome do video não existir no json video e não tiver nenhuma tag da blacklist irá passar 
       !( obj.slug === video.titulo) && !(obj.tags.some((tag) => blackList.includes(tag)))  
      })
    })

  results.forEach(async (info) => {
    const { slug, cover_url: imagemURL, id } = info;
    const jsonGetVideo = await fetch(
      `http://127.0.0.1:8080/getVideo/${slug}`
    ).then((req) => req.json());
    const { url } = jsonGetVideo.streams[1];
    writeJs({ titulo: slug, downloadURL: url, imagemURL, id });
  });
};
module.exports = { download, getInfoRecent };
