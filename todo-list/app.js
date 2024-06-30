const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data', 'todo.json');

const readData = () => {
    const jsonData = fs.readFileSync(dataFilePath);
    return JSON.parse(jsonData);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/todo', (req, res) => {
    const todo = readData();
    res.json(todo);
});

app.post('/todo', (req, res) => {
    const todo = readData();
    const newTodo = {
        id: todo.length ? todo[todo.length - 1].id + 1 : 1,
        task: req.body.task,
        isSucess: false,
    };
    todo.push(newTodo);
    writeData(todo);
    res.status(201).json(newTodo);
});

app.put('/todo/:id', (req, res) => {
    const todo = readData();
    const todoIndex = todo.findIndex(todo => todo.id === parseInt(req.params.id));

    if (todoIndex !== -1) {
        todo[todoIndex].isSucess = req.body.isSucess;
        writeData(todo);
        res.json(todo[todoIndex]);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/todo/:id', (req, res) => {
    const todo = readData();
    const newtodo = todo.filter(todo => todo.id !== parseInt(req.params.id));

    if (todo.length !== newtodo.length) {
        writeData(newtodo);
        res.status(200).json({ message: 'Todo deleted' });
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
