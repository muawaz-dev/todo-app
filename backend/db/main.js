import mongoose from "mongoose"

await mongoose.connect("mongodb+srv://muawaz8:thegrimreaper2008@cluster0.jmuiufj.mongodb.net/Todo")

const schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,

    },
    important: {
        type: Boolean,
        required: true,
        default: false
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    id:{
        type:Number,
        required:true
    }
}, { timestamps: true })


export const Todo= mongoose.model("Todo",schema)