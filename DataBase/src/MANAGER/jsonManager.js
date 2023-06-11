//O trabalho desse arquivo é organizar o Json e o diretório  

const fs = require("fs");
const { exec } = require('child_process');
class JsonManager {
  static json; 
   static instance;
 
  static getInstance() {
    if (JsonManager.instance === undefined){
      JsonManager.instance = new JsonManager();
    }
    if(JsonManager.json === undefined){
      JsonManager.json = require("../videos.json");
    }
    this.proxy = new Proxy(JsonManager.instance, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return function (...args) {
            const result = target[prop].apply(target, args);
            target.push();
            return result;
          };
        } else {
          return target[prop];
        }
      }
    });
   return JsonManager.proxy;
  }
  
  constructor() {

  }
  
    
  writeJs(json) {
    if(JsonManager.json.some((obj) => obj.titulo === json.titulo)){
      return;
    }
    JsonManager.json.push(json);
    
  }

  editJson({ titulo, ...rest }) {
    JsonManager.json.forEach((obj) => {
      if (obj.titulo === titulo) {
        obj = { ...obj, ...rest };
      }
      
    });
    
  }
  
   filerDuplicateJson() {
    JsonManager.json = JsonManager.json.filter((obj, index, array) => {
      return array.findIndex(
        (obj2) => 
        obj2.titulo === obj.titulo      
        ) === index;
    });
    
    }
    deleteJson(titulo) {
    const {passaram, naoPassaram} = JsonManager.json.reduce((acc,elemento) => {
      if(elemento.titulo !== titulo){
      acc.passaram.push(elemento);
      }else{
        acc.naoPassaram.push(elemento);
      }
      return acc;
    },{passaram: [], naoPassaram: []});

    JsonManager.json = passaram;
    return naoPassaram;
    }

    videosNeedDownload() {
      return JsonManager.json.filter((obj) => {
        if(obj.caminho === undefined || obj.caminho === null){
          return false;
        }
        const comando = `ffmpeg -v error -i ${obj.caminho} -f null - 2>&1`;
      exec(comando, (error, stdout, stderr) => {
        if (error) {
          return false;
        }
      });
    return true;
      } );

    }
  push() {
    fs.writeFileSync("./src/videos.json", JSON.stringify(JsonManager.json));
  }
}

module.exports = JsonManager;
