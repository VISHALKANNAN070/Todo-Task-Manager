import express from "express";
import Task from "../models/taskModel.js";
import verifyToken from "../auth/verifyToken.js";
import mongoose from "mongoose";

const router = express.Router();

// Create New Task
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Mongoose Save Error:", error);
    res
      .status(500)
      .json({ message: "Error creating Task", error: error.message });
  } finally {
    console.log("Payload received:", req.body);
    console.log("User from token:", req.user);
  }
});

// Fetch All Tasks for Logged-in User
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

// Update Task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: taskId,
        createdBy: req.user._id,
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
    res
      .status(500)
      .json({ message: "Error updating Task", error: error.message });
  }
});

// Delete Task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleteTask = await Task.findOneAndDelete({
      _id: taskId,
      createdBy: req.user._id,
    });

    if (!deleteTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Task", error: error.message });
  }
});

export default router;
