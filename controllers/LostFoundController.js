const LostFound = require("../models/LostFound");

const createLostFound = async (req, res) => {
  try {
    const { itemName, foundIn, room, description } = req.body;
    if (!itemName) return res.status(400).json({ status: 400, message: "Item name required" });

    const record = await LostFound.create({
      itemName,
      foundIn,
      room,
      description,
      foundBy: req.adminId,
    });

    return res.status(201).json({ status: 201, message: "Lost & Found record created", data: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const getLostFoundItems = async (req, res) => {
  try {
    const { status, room } = req.query;
    const query = {};
    if (status) query.status = status;
    if (room) query.room = room;

    const items = await LostFound.find(query)
      .populate("room", "roomNumber")
      .populate("foundBy", "name")
      .populate("claimedByGuest", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: 200, data: items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const updateLostFoundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, claimedByGuest, claimNotes } = req.body;

    const item = await LostFound.findById(id);
    if (!item) return res.status(404).json({ status: 404, message: "Item not found" });

    if (status) item.status = status;
    if (claimedByGuest) item.claimedByGuest = claimedByGuest;
    if (claimNotes) item.claimNotes = claimNotes;

    await item.save();
    return res.status(200).json({ status: 200, message: "Lost & Found updated", data: item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

module.exports = { createLostFound, getLostFoundItems, updateLostFoundStatus };
