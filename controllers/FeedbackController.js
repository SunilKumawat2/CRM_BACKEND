const Feedback = require("../models/Feedback");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const createFeedback = async (req, res) => {
  try {
    const {
      bookingId,
      guestId,
      roomId,
      roomRating,
      roomComment,
      serviceRating,
      serviceComment,
      staffRatings,
      isAnonymous
    } = req.body;

    if (!bookingId || !guestId || !roomId || !roomRating) {
      return res.status(400).json({ status: 400, message: "Missing required fields" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ status: 404, message: "Booking not found" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ status: 404, message: "Room not found" });

    // Optional: calculate overall rating
    const totalRatings = [roomRating, serviceRating || 0];
    if (staffRatings && staffRatings.length > 0) {
      staffRatings.forEach(s => totalRatings.push(s.rating));
    }
    const overallRating = totalRatings.filter(r => r > 0).reduce((a,b)=>a+b,0) / totalRatings.filter(r=>r>0).length;

    const feedback = await Feedback.create({
      booking: booking._id,
      guest: guestId,
      room: room._id,
      roomRating,
      roomComment,
      serviceRating,
      serviceComment,
      staffRatings,
      overallRating,
      createdByAdmin: req.adminId || null,
      isAnonymous: isAnonymous || false,
    });

    return res.status(201).json({ status: 201, message: "Feedback submitted", data: feedback });
  } catch (err) {
    console.error("Create Feedback Error:", err);
    return res.status(500).json({ status: 500, message: "Server error creating feedback" });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const { roomId, bookingId, guestId } = req.query;
    const query = {};
    if (roomId) query.room = roomId;
    if (bookingId) query.booking = bookingId;
    if (guestId) query.guest = guestId;

    const feedbacks = await Feedback.find(query)
      .populate("guest", "name email")
      .populate("room", "roomNumber roomType")
      .populate("staffRatings.staffId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: 200, data: feedbacks });
  } catch (err) {
    console.error("Get Feedbacks Error:", err);
    return res.status(500).json({ status: 500, message: "Server error fetching feedbacks" });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id)
      .populate("guest", "name email")
      .populate("room", "roomNumber roomType")
      .populate("staffRatings.staffId", "name");
    if (!feedback) return res.status(404).json({ status: 404, message: "Feedback not found" });

    return res.status(200).json({ status: 200, data: feedback });
  } catch (err) {
    console.error("Get Feedback Error:", err);
    return res.status(500).json({ status: 500, message: "Server error fetching feedback" });
  }
};

module.exports = {
    getFeedbackById,getFeedbacks,createFeedback
}