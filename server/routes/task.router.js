const express = require('express');
const taskRouter = express.Router();

const pool = require('./pool');

taskRouter.get('/', (req, res) => {

    pool.query('SELECT * FROM "to-dos" ORDER BY "id";')
        .then((result) => {

            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error getting all tasks`, error);
            res.sendStatus(500);
        })
})

taskRouter.post('/', (req, res)=> {
    let tasks = req.body;
    console.log('adding task', tasks);
    let sqlText = `INSERT INTO "to-dos" ("task", "complete") 
                    VALUES ($1, $2);`;
    pool.query(sqlText, [tasks.task, tasks.complete])
    
    
        .then((response) => {
            
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('Could not add task', tasks);
            console.log(error);
            res.sendStatus(500);
        })
    
})

taskRouter.delete('/:id', (req, res)=> {
    let id = req.params.id;
    console.log('deleting task with id', id);
    let sqlText = `DELETE FROM "to-dos" WHERE "id"=$1`;
    pool.query(sqlText, [id])
    .then( (result) => {
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log(`Failed to delete task with id=${id}`, error);
        res.sendStatus(500);
    })
})
taskRouter.put('/:id', (req, res) => {
    let compId = req.params.id;
    let compData = req.body;
    console.log(`updating task id=${compId} with data`, compData);
    let sqlText = `UPDATE "to-dos" SET "complete"=$1 WHERE "id"=$2;`
    pool.query(sqlText, [compData.complete, compId])
        .then((result) => {
            res.sendStatus(200)
        })
        .catch((error) => {
            console.log(`failed to update task with id=${compId},
            setting rank to ${compData.complete}.`, error);
                res.sendStatus(500);
            
        })
})

module.exports = taskRouter;