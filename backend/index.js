const express = require("express")
const app = express()
const tasksRoutes = require("./routes/tasks.js")
const cors = require("cors")
const { connectDB } = require("./config/db.js")


app.use(cors())
app.use(express.json())
connectDB()

app.use("/tasks",tasksRoutes)


app.get("/",(req,res) => {
    res.send("Merhaba")
})

//! GLOBAL HATA YAKALAYICI
app.use((err,req,res,next) => {
    console.error("Sunucuda bir hata oluştu", err.stack)

    res.status(500).json({
        hata : "Sunucu Hatası!!!",
        mesaj : "Beklenmeyen Bir Sorun Oluştu"
    })
})


app.listen(5000)
