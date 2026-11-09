const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    year: { type: Number, min: 0, max: new Date().getFullYear() },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// the `||` avoids "OverwriteModelError" if the file is loaded twice
module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);