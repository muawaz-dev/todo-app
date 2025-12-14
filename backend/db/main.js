import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"

await mongoose.connect(`mongodb+srv://${process.env.DB_PASSWORD}@cluster0.jmuiufj.mongodb.net/${process.env.DB_NAME}`)
.catch((err)=>
    {   
        console.log(err)
        process.exit(1)
    }
)
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