const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [
    {
      label: { type: String, required: true },
      fieldType: { type: String, required: true },
      placeholder: { type: String, required: true },
      options: [String],
      required: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Form", FormSchema);
