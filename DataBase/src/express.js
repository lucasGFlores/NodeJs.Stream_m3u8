

const express = require('express');
const cors = require('cors');
const session = require('express-session')
const app = express();
const { error } = require('console');
const TaskModel = require('../models/task.model');
const { createReadStream, fsync } = require('fs');
const { request } = require('http');
const {spawn} = require('child_process')
const fs = require('fs')
const ffmpeg = require('ffmpeg.js');
const { type } = require('express/lib/response');
const {writeJs} = require("./MANAGER/jsonManager.js")
// const {writeJs,updateJson} = require("./MANAGER/fileManager.js")
const {download, getInfoRecent} = require('./DAO/videoDao')
const port = 5000;

app.use(session({secret: 'djasiofhndiodhnigoqh'}));
// evita conflito de requisições
app.use(cors());


app.use(express.json());
app.get('/noticias/:sexo', (req,res) => {
getInfoRecent()
download()
    res.json([{
        titulo:'uma noticias mutcho cu'
    },
    {
        titulo:'indianos foram encontrados no porão de uma e-girl'
    },
    {
        titulo:"um grupo neo nazista foi preso.'O QUE TEM DE ERRADO EM MATAR JUDEU!!???' diz bola um dos integrantes"
    },
    {
        titulo:"Aluno do Senai realiza um atentado terrorista nos USA e China anunciando 'ESSES MERDAS QUE ME OBRIGAM A LIGAR MEU VENTILADOR NO 3'"
    },
    {
        titulo:`${req.params.sexo}`
    }
]
    
    )
})






app.get('/videos/:path', async (req,res) =>{
    let path = "./src/videos/isekai-kita-no-de-special-skill-2.mp4"
    let stat2 = fs.statSync(path)
    let total = stat2.size
    
if(req.headers.range){
    console.log("TRUE TRUE TRUE")
    let range = req.headers.range
    let parts = range.replace(/bytes=/, "").split("-");
    let partialstart = parts[0];
    let partialend = parts[1];
console.log(`parts\n${parts}`)
    let start = parseInt(partialstart, 10);
    let end = partialend ? parseInt(partialend, 10) : total-1;
    let chunksize = (end-start)+1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    let file = fs.createReadStream(path, {start: start, end: end});
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + 
        end + '/' + total, 'Accept-Ranges': 'bytes', 
        'Content-Length': chunksize, 'Content-Type': 'video/mp4' });


//     const blob = new Blob([file],{type:"video/mp4"})
// res.status(200).write(new Uint8Array(await blob.arrayBuffer()))

    file.pipe(res);
    // res.send(blob)
    // ffmpegProcess.stdout.pipe(res)


    // res.writeHead(206,{'Content-Range' : `bytes${start}-${end}/${total}`,'Accept-Ranges' : 'bytes', 'Content-Length' : chunksize,'Content-Type' : 'video/mp4'})
} else {
    
    res.writeHead(200, { 'Content-Length': total, 
    'Content-Type': 'video/mp4' });
fs.createReadStream(path).pipe(res);
}

//-----------------------------------------------------------------------------------------------


// if(req.method ==='OPTIONS' ){
//     res.writeHead(204,headers)
//     res.writeHead('Content-Type', 'video/mp4')
//     res.writeHead('Accept-Ranges', 'bytes')
//     res.end()
//     return;
// }

//     const link = `https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/${req.params.nomeDoarquivo}.m3u8`
//     const url = 'https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/7xf19wb9krmslqdlA20xc9qx1yZ2spvrfll07937p125l1nvc2p67.m3u8';
//     const url2 = "https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/k72dlAsslkrctb841xyvym0gg3ZAd940tkf39wgg87ft3qzn3ycq3.m3u8"
//     const ffmpegProcess = spawn('ffmpeg',[
//         '-i',`${url}`
//         // '-i',`pipe:0`
//         // , '-f',"mp4"
//          ,"-vcodec", "h264"
//          , "-acodec", "aac"
//          , "-movflags", "frag_keyframe+empty_moov+default_base_moof"
//          , "-b:v", "1500k"
//          , "-maxrate", "1500k"
//          , "-f", "mp4"
//          , "-c", "copy"
//          , "-bsf:a", "aac_adtstoasc"
//          ,"-hls_flags","single_file"
        
//          , "pipe:1"
//     ],{
//         stdio: ['pipe','pipe','pipe']
//     })
    
//     const headers ={
//         'Acess-Control-Allow-Origin': "*",
//         'Acess-Control-Allow-Methods': "*"
//     }
  
 
//     ffmpegProcess.stdout.pipe(res)
//     ffmpegProcess.stderr.on('data',msg => console.log(msg.toString()))

//   const out = result.MEMFS[0]
//   fs.writeFileSync(`./src/videos/${out.name}`, Buffer(out.data));
});

app.listen(port,() =>{
    console.log(`rodando na porta ${port}`)})
