const express = require("express")

const router = express.Router()

let tasks = [{
    "id" : 1 ,
    "clientName" : "Tarkan" ,
    "description" : "Vokal Kaydı Alınıcak",
    "status" : "In Progress"
},
{
       "id" : 2 ,
    "clientName" : "Duman" ,
    "description" : "Bateri Mixi Alınıcak",
    "status" : "To Do"   
}]

router.get("/", (req, res) => {
    res.json(tasks)
})

router.post("/",(req,res) => {
    const newTask = req.body
    newTask.id = tasks.length + 1
    tasks.push(newTask)
    res.status(201).json(newTask)
})

router.get("/:id",(req,res) => {
    const taskID = parseInt(req.params.id)
    const task = tasks.find(t => t.id === taskID)
    if (!task) return res.status(404).send("Böyle Bir Task Yok veya Silinmiş!")
        res.json(task)
})
router.put("/:id",(req,res) => {
    const taskID = parseInt(req.params.id)
    const task = tasks.find(t => t.id === taskID)
    if(!task){ return res.status(404).send("Bu ID ile güncellenebilir bir task bulamadık")}
    task.clientName = req.body.clientName || task.clientName
    task.description = req.body.description || task.description
    task.status = req.body.status || task.status
    res.json(task)
})
router.delete("/:id",(req,res) => {
    const taskID = parseInt(req.params.id)
    const taskIndex = tasks.findIndex(t => t.id === taskID)
    if(taskIndex === -1) return res.status(404).send("Bu ID'ye Ait Silinecek Task Bulunumadı")
        const deletedTask = tasks.splice(taskIndex,1)
    res.json({ mesaj: "Görev başarıyla silindi", silinen: deletedTask[0] })

})





module.exports = router

