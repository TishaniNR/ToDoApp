const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/react-todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

// Define a Todo model schema
const TodoSchema = new mongoose.Schema({
  text: String,
  complete: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todo/new', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      complete: false, // Initialize as incomplete
    });

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error creating a new TODO:', error);
    res.status(500).json({ error: 'Failed to create a new TODO' });
  }
});

app.delete('/todo/delete/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);

    if (!result) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    res.json({ result });
  } catch (error) {
    console.error('Error deleting TODO:', error);
    res.status(500).json({ error: 'Failed to delete TODO' });
  }
});

app.get('/todo/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    todo.complete = !todo.complete;

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error updating TODO:', error);
    res.status(500).json({ error: 'Failed to update TODO' });
  }
});

app.put('/todo/update/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'TODO not found' });
      return;
    }

    todo.text = req.body.text;

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error updating TODO:', error);
    res.status(500).json({ error: 'Failed to update TODO' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
