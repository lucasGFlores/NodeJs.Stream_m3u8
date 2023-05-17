const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true, //isso diz que é obrigatório receber esse valor
    },
    completed:{
        type: Boolean,
        required: true, 
    },
    id:{
        type: String,
        required: true, 
    },
    description:{
        type: String,
        required:false,
    }
});
const TaskModel =  mongoose.model("Task",taskSchema);
module.exports = TaskModel;