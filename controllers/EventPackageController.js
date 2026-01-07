const EventPackage = require("../models/EventPackage");


const createEventPackage = async (req, res) => {
    try {
        const { name, description, pricePerPerson, itemsIncluded } = req.body;


        if (!name || !pricePerPerson)
            return res.status(400).json({ status: 400, message: "Name & pricePerPerson required" });


        const pkg = await EventPackage.create({
            name,
            description,
            pricePerPerson,
            itemsIncluded,
            createdBy: req.adminId
        });


        res.status(201).json({ status: 201, message: "Package created", data: pkg });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "Server error" });
    }
};


const getPackages = async (req, res) => {
    try {
      let { page = 1, limit = 20 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;
  
      // Total count for pagination
      const total = await EventPackage.countDocuments();
  
      // Pagination data
      const packages = await EventPackage.find()
        .sort({ createdAt: -1 }) // Sort FIRST
        .skip(skip)              // Then skip
        .limit(limit);           // Then limit
  
      return res.status(200).json({
        status: 200,
        message: "Packages fetched successfully",
        total,                   // <-- Use this in frontend
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: packages,          // <-- Paginated response
      });
  
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Server error fetching packages",
      });
    }
  };
  
  


const updatePackage = async (req, res) => {
    try {
        const pkg = await EventPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pkg) return res.status(404).json({ status: 404, message: "Package not found" });
        res.status(200).json({ status: 200, message: "Package updated", data: pkg });
    } catch (err) {
        res.status(500).json({ status: 500, message: "Server error" });
    }
};


const deletePackage = async (req, res) => {
    try {
        const pkg = await EventPackage.findByIdAndDelete(req.params.id);
        if (!pkg) return res.status(404).json({ status: 404, message: "Package not found" });
        res.status(200).json({ status: 200, message: "Package deleted" });
    } catch (err) {
        res.status(500).json({ status: 500, message: "Server error" });
    }
};

module.exports = {
    createEventPackage,
    getPackages,
    updatePackage,
    deletePackage
}