const fs = require('fs');
const path = require('path');
const { writeFile } = require('../utils');

const todosFilePath = path.join(__dirname, '../todos.json');

// middleware to read todos & add to req
const readTodos = (req, res, next) => {
  fs.readFile(todosFilePath, 'utf8', (err, todosString) => {
    if (err) return next(err);

    req.todos = JSON.parse(todosString);
    next();
  });
};

const getTodos = (req, res) => {
  res.json(req.todos);
};

// middleware to validate todo creation
const validateCreateTodo = (req, res, next) => {
  // check for required data
  const { title, username } = req.body;
  if (!title || !username)
    return res
      .status(400)
      .json({ error: 'Title & Username must be provided! 😠' });

  next();
};

const createTodo = (req, res, next) => {
  const { title, username } = req.body;
  const id = req.todos.length > 0 ? req.todos[req.todos.length - 1].id + 1 : 1;

  const todos = req.todos.concat({ id, title, username });
  const todosJSON = JSON.stringify(todos, 0, 2);

  writeFile(todosFilePath, todosJSON)
    .then(() =>
      res.status(201).json({ message: 'Todo created Successfully ✌' })
    )
    .catch(next);
};

const deleteTodo = (req, res, next) => {
  const { id } = req.params;

  const updatedTodos = req.todos.filter((todo) => todo.id !== +id);

  if (updatedTodos.length === req.todos.length) return res.sendStatus(404);

  writeFile(todosFilePath, JSON.stringify(updatedTodos, null, 2))
    .then(() =>
      res.status(201).json({ message: 'Todo deleted Successfully ✌' })
    )
    .catch(next);
};

const validateEditTodo = (req, res, next) => {
  const { title, status } = req.body;

  if (!title && !status)
    return res
      .status(400)
      .json({ error: 'Title or Status must be provided! 😠' });

  next();
};

const editTodo = (req, res, next) => {
  const { id } = req.params;

  const validTodoid = req.todos.some((todo) => todo.id === +id);

  if (!validTodoid) return res.sendStatus(404);

  const updatedTodos = req.todos.map((todo) =>
    todo.id !== +id
      ? todo
      : {
          id: todo.id,
          title: req.body.title || todo.title,
          status: req.body.status || todo.status,
        }
  );

  writeFile(todosFilePath, JSON.stringify(updatedTodos, null, 2))
    .then(() =>
      res.status(201).json({ message: 'Todo Updated Successfully ✌' })
    )
    .catch(next);
};

module.exports = {
  readTodos,
  getTodos,
  deleteTodo,
  createTodo,
  validateCreateTodo,
  editTodo,
  validateEditTodo,
};
