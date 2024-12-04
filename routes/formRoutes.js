const express = require("express");
const mongoose = require("mongoose");
const Form = require("../models/Form");

const router = express.Router();

// Create a new form
router.post("/create", async (req, res) => {
  try {
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a form by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a form
router.put("/:id", async (req, res) => {
  try {
    const { fields, ...formData } = req.body;

    // Ensure all fields have valid _id
    const updatedFields = fields.map((field) => {
      if (!field._id || !mongoose.Types.ObjectId.isValid(field._id)) {
        // Generate a new _id if it's missing or invalid
        return {
          ...field,
          _id: new mongoose.Types.ObjectId(),
        };
      }
      return field;
    });

    // Find the form and update its fields
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      {
        ...formData,
        fields: updatedFields,
      },
      { new: true, runValidators: true } 
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a form
router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
