const express = require("express")
const router = express.Router()
const { pool } = require("../config/db.js")

router.get("/", (req, res) => {
    pool.query("SELECT * FROM tasks ORDER BY id ASC", (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: "Veritabanı hatası" })
        }
        res.json(results.rows)
    })
})

router.post("/", async (req, res) => {
    const { client_name, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (client_name, description, status) VALUES ($1, $2, 'Todo') RETURNING *",
            [client_name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
})

router.get("/:id", async (req, res) => {
    const taskID = parseInt(req.params.id);
    try {
        // Postgres placeholder kullanımı: $1
        const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskID]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Görev bulunamadı" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
})

router.put("/:id", async (req, res) => {
    const taskID = parseInt(req.params.id);
    const { client_name, description, status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE tasks SET client_name = $1, description = $2, status = $3 WHERE id = $4 RETURNING *",
            [client_name, description, status, taskID]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Görev bulunamadı" });
        }
        res.json({ message: "Görev başarıyla güncellendi", updated: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
})


router.delete("/:id", async (req, res) => {
    const taskID = parseInt(req.params.id);
    try {
        const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [taskID]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Görev bulunamadı" });
        }
        res.json({ message: "Görev başarıyla silindi", silinen: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Veritabanı hatası" });
    }
})



module.exports = router

