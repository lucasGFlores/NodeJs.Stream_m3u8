

const express = require('express');
const cors = require('cors');
const session = require('express-session')
const app = express();
const { error } = require('console');
const TaskModel = require('../models/task.model');
const { createReadStream } = require('fs');
const { request } = require('http');
const {spawn} = require('child_process')
const port = 5000;

app.use(session({secret: 'djasiofhndiodhnigoqh'}));
// evita conflito de requisições
// app.use(cors());


app.use(express.json());
app.get('/noticias/:sexo', (req,res) => {
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
app.patch("/listaDeAfazeres/:id", async(req,res) =>{
    try{
        const taskList = await TaskModel.find({})
        const taskDB = taskList.filter(task => task.id == req.params.id);
        const {_id}  = (taskDB[0])

        const task = await TaskModel.findByIdAndUpdate(_id,req.body,{new: true})
       res.status(200).json(task) 
    }catch(err){
        console.log(err.message)
        res.status(500).send(error.message)
    }
})
app.get('/video/:nomeDoarquivo', async (req,res) =>{
    console.log("entrou")
    const link = `https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/${req.params.nomeDoarquivo}.m3u8`
    const url = 'https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/7xf19wb9krmslqdlA20xc9qx1yZ2spvrfll07937p125l1nvc2p67.m3u8';
    const url2 = "https://m3u8s.highwinds-cdn.com/api/v9/m3u8s/k72dlAsslkrctb841xyvym0gg3ZAd940tkf39wgg87ft3qzn3ycq3.m3u8"
    const ffmpegProcess = spawn('ffmpeg',[
        '-i',`${url}`
        // '-i',`pipe:0`
        // , '-f',"mp4"
         ,"-vcodec", "h264"
         , "-acodec", "aac"
         , "-movflags", "frag_keyframe+empty_moov+default_base_moof"
         , "-b:v", "1500k"
         , "-maxrate", "1500k"
         , "-f", "mp4"
         , "-c", "copy"
         , "-bsf:a", "aac_adtstoasc"
         ,"-hls_flags","single_file"
         , "pipe:1"
    ],{
        stdio: ['pipe','pipe','pipe']
    })
    
    res.writeHead(200,{'Content-Type': 'video/mp4'})
    const headers ={
        'Acess-Control-Allow-Origin': "*",
        'Acess-Control-Allow-Methods': "*"
    }
    if(req.method ==='OPTIONS' ){
        res.writeHead(204,headers)
        res.end()
        return;
    }
    ffmpegProcess.stdout.pipe(res)
    ffmpegProcess.stderr.on('data',msg => console.log(msg.toString()))
});

app.listen(port,() =>{
    console.log(`rodando na porta ${port}`)})
