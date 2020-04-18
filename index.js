const express = require('express');
const morgan = require('morgan');

const {
  readTodos,
  getTodos,
  deleteTodo,
  createTodo,
  validateCreateTodo,
  editTodo,
  validateEditTodo,
} = require('./controllers/todoController');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan(':url :method :status :date'));

app.get('/', (req, res) => {
  res.json('hi');
});

/**
 * -Todos routes handlers
 */

app.get('/todos', readTodos, getTodos);

app.post('/todos', validateCreateTodo, readTodos, createTodo);

app.delete('/todos/:id', readTodos, deleteTodo);

app.patch('/todos/:id', validateEditTodo, readTodos, editTodo);

// global express eror handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error 😭' });
});

app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
