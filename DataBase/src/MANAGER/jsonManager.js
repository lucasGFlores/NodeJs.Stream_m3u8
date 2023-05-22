//O trabalho desse arquivo é organizar o Json e a conexão  
const { Console } = require("console")
const { json } = require("express/lib/response")
const fs = require("fs")

  const writeJs = async (json) =>{
        const jsonAnti =  require('../videos.json')
        //old code
        // const {titulo,downloadURL,imagemURL} = json
        // jsonAnti.video.push({titulo,downloadURL,imagemURL})
        //----------
        jsonAnti.video.push(json)
        fs.writeFileSync("./src/videos.json",JSON.stringify(jsonAnti))
    }
    const updateJson = async({titulo,caminho}) =>{
        const json =  require('../videos.json')
        json.video.forEach(obj => {
            console.log(`${obj.titulo}      ${titulo}`)
            if(obj.titulo === titulo){
                obj.caminho = caminho
            }
        })
        fs.writeFileSync("./src/videos.json",JSON.stringify(json))
    }
module.exports= {writeJs,updateJson}