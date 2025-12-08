import express from "express";
import { Todo } from "../db/main.js";
import cors from "cors"
const app = express();
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json());

app.get("/list",async(req,res)=>{
    try {
        const list=await Todo.find({})
        res.status(200).json(list)        
    } catch (error) {
        res.status(500).json({ error: error.message })       
    }
})

app.post("/", async (req, res) => {
    try {
        await Todo.create(req.body)
        res.status(200).json({ message: "Added successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete("/all", async (req, res) => {
    try {
        await Todo.deleteMany({});
        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete("/:id", async (req, res) => {
    try {
        await Todo.deleteOne({ id: req.params.id })
        res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



app.put("/complete/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ id: req.params.id })
        todo.completed = !todo.completed;
        await todo.save();
        res.status(200).json({ message: "Toggle Completed" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.put("/important/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ id: req.params.id })
        todo.important = !todo.important;
        await todo.save();
        res.status(200).json({ message: "Toggle Important" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.put("/text/:id/:text", async (req, res) => {
    try {
        await Todo.updateOne(
            { id: req.params.id },
            { $set: { text: req.params.text } }
        )
        res.status(200).json({ message: "Updated text" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(3000, () => {
    console.log("The server is listening.")
})