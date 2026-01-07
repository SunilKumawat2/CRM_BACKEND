const Asset = require("../models/Asset");

const createAsset = async (req, res) => {
  try {
    const { name, category, quantity, minQuantityAlert, location, notes } = req.body;
    if (!name) return res.status(400).json({ status: 400, message: "Asset name required" });

    const asset = await Asset.create({ name, category, quantity, minQuantityAlert, location, notes });
    return res.status(201).json({ status: 201, message: "Asset created", data: asset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ name: 1 });
    return res.status(200).json({ status: 200, data: assets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

const updateAssetQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ status: 404, message: "Asset not found" });

    asset.quantity = quantity;
    await asset.save();

    return res.status(200).json({ status: 200, message: "Asset updated", data: asset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

module.exports = { createAsset, getAssets, updateAssetQuantity };
