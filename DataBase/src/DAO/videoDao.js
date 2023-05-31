//O objetivo disso é pegar os .m3u8 e instalar
const { spawn } = require("child_process");
const fs = require("fs");
const { updateJson, writeJs } = require("../MANAGER/jsonManager.js");
const res = require("express/lib/response.js");
const download = async () => {
  const json = require("../videos.json");
  if (!fs.existsSync("./src/videos/")) {
    fs.mkdirSync("./src/videos/");
  }
  const jsonFiltrado = json.video.filter((obj) => obj.caminho === undefined);
  jsonFiltrado.forEach((obj) => {
    console.log("começando a conversão de: ", obj.titulo);
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
    console.log("terminou a conversão de: ", obj.titulo);
    ffmpegProcess.stdout;
    updateJson({
      titulo: obj.titulo,
      caminho: `./src/videos/${obj.titulo}.mp4`,
    });
  });
};

const getInfoRecent = (blackList = ["rape"], whiteList = [""]) => {
  const json = require("../videos.json");
  const jsonRecent = require("../recent.json");

  const results = jsonRecent.results.filter((obj) => {

    const whiteListStatus = whiteList.includes("")
      ? true
      : whiteList.some((tag) => obj.tags.includes(tag)) ?? "deu undefined";
    return (
      !blackList.some((tag) => obj.tags.includes(tag)) &&
      !json.video.some((video) => video.titulo === obj.slug) &&
      whiteListStatus
    );
  });

  // results.forEach(async (info) => {
  //   const { slug, cover_url: imagemURL, id } = info;
  //   const jsonGetVideo = await fetch(
  //     `http://127.0.0.1:8080/getVideo/${slug}`
  //   ).then((req) => req.json());
  //   const { url } = jsonGetVideo.streams[1];
  //   writeJs({ titulo: slug, downloadURL: url, imagemURL, id ,tags:info.tags});
  // });
};
module.exports = { download, getInfoRecent };
