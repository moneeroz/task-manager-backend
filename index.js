const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const config = require("./config");
const Task = require("./models/task");
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// Test DB connection
config
  .authenticate()
  .then(() => {
    console.log("Databae is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Retrieve all tasks from our DB
app.get("/tasks", (req, res) => {
  Task.findAll()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Create a new task
app.post("/tasks", (req, res) => {
  const id = uuidv4();
  const {
    tittle,
    descreption,
    catagory,
    task_date,
    priority_level,
    progress_level,
  } = req.body;

  Task.create(
    id,
    tittle,
    descreption,
    catagory,
    task_date,
    priority_level,
    progress_level,
  )
    .then((result) => {
      res.status(200).send(result); // result is the item that was created
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Update task progress level
app.patch("/tasks/update-progress-level/:task_id", (req, res) => {
  const taskId = parseInt(req.params.task_id);

  // Find the task based on the id
  Task.findByPk(taskId)
    .then((result) => {
      // Check if task exists in the database table
      if (!result) {
        res.status(404).send("Task was not found");
        return;
      }
      result.progress_level = req.body.progress_level; // updating the task progress
      // Save the update into the database
      result
        .save()
        .then(() => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Delete a task
app.delete("/tasks/:task_id", (req, res) => {
  const taskId = parseInt(req.params.task_id);

  // Find the task based on the id
  Task.findByPk(taskId)
    .then((result) => {
      // Check if task exists in the database table
      if (!result) {
        res.status(404).send("Task was not found");
        return;
      }

      // Deletes task from database
      result
        .destroy()
        .then(() => {
          res.status(200).send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
