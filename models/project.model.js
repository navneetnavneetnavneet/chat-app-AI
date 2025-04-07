const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, "projectName is required !"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", projectSchema);
