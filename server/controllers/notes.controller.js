const Note = require("../models/notes.model");

// add notes
module.exports.addNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title || !content || !tags) {
      return res
        .status(400)
        .send({ error: true, message: "All fields are required" });
    }

    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();
    res
      .status(201)
      .send({ error: false, message: "Note added successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

// get notes by user id
module.exports.getNotes = async (req, res) => {
  try {
    const { user } = req.user;
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    res.status(200).send({ error: false, notes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

// edit/update notes
module.exports.editNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title || !content || !tags) {
      return res
        .status(400)
        .send({ error: true, message: "No Changes Happened" });
    }

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    res
      .status(200)
      .send({ error: false, message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

// update note pins
module.exports.updatePinNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }
    note.isPinned = isPinned;

    await note.save();

    res
      .status(200)
      .send({ error: false, message: "Note pinned successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

// delete notes
module.exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { user } = req.user;

    const note = await Note.findOneAndDelete({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).send({ error: true, message: "Note not found" });
    }

    res
      .status(200)
      .send({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

module.exports.searchNote = async (req, res) => {
  try {
    const { query } = req.query;
    const { user } = req.user;

    const notes = await Note.find({
      title: { $regex: query, $options: "i" },
      userId: user._id,
    });

    res.status(200).send({ error: false, notes });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
