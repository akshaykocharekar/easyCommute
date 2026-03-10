const SupportRequest = require("../models/SupportRequest");
const Bus = require("../models/Bus");

exports.createSupportRequest = async (req, res) => {
  try {
    const operatorId = req.user._id;
    const { category, subject, message } = req.body;

    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanSubject || !cleanMessage) {
      return res.status(400).json({ message: "subject and message are required" });
    }

    const bus = await Bus.findOne({ operator: operatorId });

    const request = await SupportRequest.create({
      operator: operatorId,
      bus: bus?._id || null,
      category,
      subject: cleanSubject,
      message: cleanMessage,
    });

    res.status(201).json({ message: "Request submitted", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMySupportRequests = async (req, res) => {
  try {
    const operatorId = req.user._id;
    const requests = await SupportRequest.find({ operator: operatorId })
      .sort({ createdAt: -1 })
      .populate("bus", "busNumber");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSupportRequests = async (req, res) => {
  try {
    const requests = await SupportRequest.find()
      .sort({ createdAt: -1 })
      .populate("operator", "name email phone role operatorVerificationStatus")
      .populate("bus", "busNumber");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSupportRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const allowed = ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update = {};
    if (status) update.status = status;
    if (typeof adminNote === "string") update.adminNote = adminNote.trim();
    if (status === "RESOLVED") update.resolvedAt = new Date();

    const request = await SupportRequest.findByIdAndUpdate(id, update, { new: true })
      .populate("operator", "name email phone")
      .populate("bus", "busNumber");

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

