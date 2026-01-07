const Maintenance = require("../models/Maintenance");

const createMaintenanceTask = async (req, res) => {
  try {
    const { room, issue, category, priority, assignedTo, notes } = req.body;
    if (!room || !issue) {
      return res.status(400).json({ status: 400, message: "Room and issue are required" });
    }

    const task = await Maintenance.create({
      room,
      reportedBy: req.adminId,
      issue,
      category,
      priority,
      assignedTo,
      notes,
    });

    return res.status(201).json({ status: 201, message: "Maintenance task created", data: task });
  } catch (err) {
    console.error("Create Maintenance Task Error:", err);
    return res.status(500).json({ status: 500, message: "Server error creating maintenance task" });
  }
};

const getMaintenanceTasks = async (req, res) => {
  try {
    const { status, room } = req.query;
    const query = {};
    if (status) query.status = status;
    if (room) query.room = room;

    const tasks = await Maintenance.find(query)
      .populate("room", "roomNumber roomType")
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: 200, data: tasks });
  } catch (err) {
    console.error("Get Maintenance Tasks Error:", err);
    return res.status(500).json({ status: 500, message: "Server error fetching tasks" });
  }
};

const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const task = await Maintenance.findById(id);
    if (!task) return res.status(404).json({ status: 404, message: "Task not found" });

    if (status) task.status = status;
    if (notes) task.notes = notes;
    if (assignedTo) task.assignedTo = assignedTo;
    if (status === "completed") task.resolvedAt = new Date();

    await task.save();
    return res.status(200).json({ status: 200, message: "Task updated", data: task });
  } catch (err) {
    console.error("Update Maintenance Task Error:", err);
    return res.status(500).json({ status: 500, message: "Server error updating task" });
  }
};

module.exports = { createMaintenanceTask, getMaintenanceTasks, updateMaintenanceStatus };
