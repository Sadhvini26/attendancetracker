const express = require("express");
const router = express.Router();
const Permission = require("../models/Permission");

// Create new request
router.post("/", async (req, res) => {
  try {
    const newRequest = new Permission(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// Get all requests (for a student)
router.get("/:rollno", async (req, res) => {
  try {
    const rollno=req.params.rollno;
    const requests = await Permission.find({name:rollno});
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
router.get("/", async (req, res) => {
  try {
    const requests = await Permission.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!["approved", "rejected", "new"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const updatedRequest = await Permission.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }
    
    res.status(200).json(updatedRequest);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update request" });
  }
});
module.exports = router;
