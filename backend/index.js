const express = require("express")
const app = express()
const tasksRoutes = require("./routes/tasks.js")

app.use(express.json())

app.use("/tasks",tasksRoutes)


app.get("/",(req,res) => {
    res.send("Merhaba")
})

app.listen(3000)