const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const config = require("./config");
const Task = require("./models/task");
const cors = require("cors");

// Middleware
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
app.get("/api/tasks", (req, res) => {
  Task.findAll()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Find a task based on their id
app.get("/api/tasks/:task_id", (req, res) => {
  const taskId = req.params.task_id;
  // Find by primary key
  Task.findByPk(taskId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Create a new task
app.post("/api/tasks", (req, res) => {
  const id = uuidv4();
  const {
    title,
    description,
    catagory,
    task_date,
    priority_level,
    progress_level,
  } = req.body;

  Task.create({
    id,
    title,
    description,
    catagory,
    task_date,
    priority_level,
    progress_level,
  })
    .then((result) => {
      res.status(200).send(result); // result is the Task that was created
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Update task progress level
app.patch("/api/tasks/update-progress-level/:task_id", (req, res) => {
  const taskId = req.params.task_id;

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

// Complete update of a Task record
app.put("/api/tasks/update-task/:task_id", (req, res) => {
  const taskId = req.params.task_id;
  const taskData = req.body;
  // Find the Task
  Task.findByPk(taskId)
    .then((result) => {
      if (!result) {
        res.status(404).send("Task not found");
      } else {
        // Here we are doing a full update but we can do a partial update using PUT
        result.title = taskData.title;
        result.description = taskData.description;
        result.catagory = taskData.catagory;
        result.task_date = taskData.task_date;
        result.priority_level = taskData.priority_level;
        result.progress_level = taskData.progress_level;

        // Save changes to database
        result
          .save()
          .then(() => {
            res.status(200).send(result);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Delete a task
app.delete("/api/tasks/:task_id", (req, res) => {
  const taskId = req.params.task_id;

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

// Server
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
