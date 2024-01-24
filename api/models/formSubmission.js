const mongoose = require("mongoose");
const formSubmissionSchema = new mongoose.Schema(
  {
    problemDescription: { type: String, required: true,},
    email: { type: String, required: true,},
  },{ timestamps: true }
);
const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);
module.exports = FormSubmission;


