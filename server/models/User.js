const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, auto: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneno: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
