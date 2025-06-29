import express from "express";
import Task from "../models/taskModel.js";
import verifyToken from "../auth/verifyToken.js";

const router = express.Router();

//New Task
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy,
      sharedWith,
    } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.userId,
      sharedWith,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating Task:", error: error.message });
  }
});

//Fetch All Tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ createdBy: req.user.userId }, { sharedWith: req.user.userId }],
    }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

//Update Task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: taskId,
        createdBy: req.user.userId,
      },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating Task", error: error.message });
  }
});

//Delete Task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleteTask = await Task.findOneAndDelete({
      _id: taskId,
      createdBy: req.user.userId,
    });

    if (!deleteId) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting Task", error: error.message });
  }
});

export default router;
