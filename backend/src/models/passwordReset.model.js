import mongoose from "mongoose";
const passwordResetSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const passwordResetModel = mongoose.model("PasswordLink", passwordResetSchema);
export default passwordResetModel;
