const GuestRequest = require("../models/GuestRequest");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const createGuestRequest = async (req, res) => {
    try {
      const { bookingId, roomId, requestType, title, description, priority } = req.body;
  
      if (!bookingId || !roomId || !requestType || !title) {
        return res.status(400).json({
          status: 400,
          message: "Missing required fields",
        });
      }
  
      // Validate booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ status: 404, message: "Booking not found" });
      }
  
      // Validate room
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ status: 404, message: "Room not found" });
      }
  
      // Admin is creating manually → no need for guest login
      const request = await GuestRequest.create({
        booking: booking._id,
        room: room._id,
        roomNumber: room.roomNumber,
        requestType,
        title,
        description,
        priority: priority || "medium",
        requestedBy: null,  // Admin added
        assignedTo: req.adminId, // Optionally assign to the admin creating
        status: "pending", // default
      });
  
      return res.status(201).json({
        status: 201,
        message: "Guest request created by admin",
        data: request,
      });
  
    } catch (err) {
      console.error("Create Guest Request Error:", err);
      return res.status(500).json({
        status: 500,
        message: "Server error creating guest request",
      });
    }
  };

const getGuestRequests = async (req, res) => {
    try {
        const { status, requestType, roomNumber } = req.query;

        const q = {};
        if (status) q.status = status;
        if (requestType) q.requestType = requestType;
        if (roomNumber) q.roomNumber = roomNumber;

        const requests = await GuestRequest.find(q)
            .populate("room", "roomNumber roomType")
            .populate("booking", "bookingNumber guestName")
            .populate("assignedTo", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 200,
            message: "Guest requests fetched",
            data: requests,
        });
    } catch (err) {
        console.error("Get Guest Requests Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Server error fetching requests",
        });
    }
};

const updateGuestRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        const request = await GuestRequest.findById(id);
        if (!request)
            return res.status(404).json({ status: 404, message: "Request not found" });

        request.status = status || request.status;
        request.remarks = remarks || request.remarks;

        if (status === "in_progress") {
            request.assignedTo = req.adminId;
        }

        if (status === "completed") {
            request.completedAt = new Date();
        }

        await request.save();

        return res.status(200).json({
            status: 200,
            message: "Request updated",
            data: request,
        });
    } catch (err) {
        console.error("Update Guest Request Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Server error updating request",
        });
    }
};

const getRequestsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const requests = await GuestRequest.find({ booking: bookingId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 200,
            data: requests,
        });
    } catch (err) {
        console.error("Get Booking Requests Error:", err);
        return res.status(500).json({
            status: 500,
            message: "Server error fetching booking requests",
        });
    }
};

module.exports = {
    createGuestRequest,
    getRequestsByBooking,
    updateGuestRequestStatus,
    getGuestRequests
}