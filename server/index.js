import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("db.db");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    db.all("SELECT * FROM notes;", (err, rows) => {
        if (err) {
            res.status(500).send();
            throw new Error(err);
        } else res.status(200).json(rows);
    });
});

app.post("/", (req, res) => {
    db.run(
        `
        INSERT INTO notes(title, contents, creation_date)
        VALUES(?, ?, DATE('now'))
    `,
        [req.body.title, req.body.contents],
        (dbRes, err) => {
            if (err) {
                res.status(500).send();
                throw new Error(err);
            } else {
                res.status(200).send();
                console.log(`add note "${req.body.title}" result:`, dbRes);
            }
        }
    );
});

app.get("/:id", (req, res) => {
    const id = req.params.id;
    db.all("SELECT * FROM notes WHERE id = ?", [id], (err, rows) => {
        if (err) {
            res.status(500).send();
            throw new Error(err);
        } else if (rows.length == 1) {
            res.status(200).json(rows[0]);
        } else {
            res.status(200).send();
            throw new Error(
                `get note id ${id} err, rows.length == ${rows.length} (should be 1)`
            );
        }
    });
});

app.post("/:id", (req, res) => {
    const id = req.params.id;
    db.run(
        "UPDATE notes SET title=?, contents=? WHERE id=?",
        [req.body.title, req.body.contents, id],
        (dbRes, err) => {
            if (err) {
                res.status(500).send();
                throw new Error(err);
            } else {
                res.status(200).send();
                console.log(`update note id ${id} result:`, dbRes);
            }
        }
    );
});

app.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM notes WHERE id = ?", [id], (dbRes, err) => {
        if (err) {
            res.status(500).send();
            throw new Error(err);
        } else {
            res.status(200).send();
            console.log(`delete note id ${id} result:`, dbRes);
        }
    });
});

app.listen(8800);

// db.close();
