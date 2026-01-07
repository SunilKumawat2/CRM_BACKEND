const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    // Fetch last 50 notifications, newest first
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ status: 200, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error fetching notifications",
    });
  }
};

// Optional: mark all notifications as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({}, { read: true });
    return res.status(200).json({ status: 200, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error updating notifications",
    });
  }
};

module.exports = { getNotifications, markAllRead };
