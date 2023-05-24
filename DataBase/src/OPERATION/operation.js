const { getInfoRecent, download } = require("../DAO/videoDao");

const base = ({titulo,downloadURL}) =>{
    getInfoRecent();
    setTimeout(5000);
    download();
}
//função assincrona com timeout
const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  