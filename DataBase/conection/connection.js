const mongoose = require("mongoose");
const connectToDatabase = async () => {
    await mongoose.connect(
      `mongodb+srv://adm:123@cluster0.o0hxtou.mongodb.net/?retryWrites=true&w=majority`
      ).then(()=>{
          console.log("conecxão um sucesso na db");
      }).catch((error)=>{
          return console.log("aconteceu um erro no data base");
      })  
      }
  module.exports = connectToDatabase;