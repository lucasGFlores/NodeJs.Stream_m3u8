//O objetivo disso é pegar os .m3u8 e instalar
const { spawn } = require("child_process");

const { updateJson, writeJs } = require("../MANAGER/jsonManager.js");
const download = async () => {
  const json = require("../videos.json");
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
const getInfoRecent = () => {
  const json = require("../videos.json");
  //depois colocar o fetch bonitinho
  // epga os newes ou trending
  // seria o feacth com o id do baguio ou o slug dos trending
  //pega titulo dos trending(tipo de requisição da API) e pega o link do getvideo

  const jsonRecent = require("../recent.json");
  const results = jsonRecent.results.filter((obj) =>
    json.video.reduce((accumulator, currentValue) => {
      if (accumulator) {
        return obj.slug !== currentValue.titulo;
      }
    }, true)
  );
  results.forEach(async info => {
    const {slug, cover_url :imagemURL,id } = info
    const jsonGetVideo = await fetch(`http://127.0.0.1:8080/getVideo/${slug}`).then(req => req.json())
    const {url} = jsonGetVideo.streams[1]
    writeJs({titulo:slug,downloadURL:url,imagemURL,id})

  })
};
module.exports = { download, getInfoRecent };
