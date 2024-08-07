const express = require("express");
const router = express.Router();
const noteController = require("../controllers/notes.controller");
const authenticateToken = require("../utils/authenticateToken");

router.get("/get-all-notes", authenticateToken, noteController.getNotes);
router.get("/search-notes", authenticateToken, noteController.searchNote);
router.post("/add-note", authenticateToken, noteController.addNote);
router.put("/edit-note/:noteId", authenticateToken, noteController.editNote);
router.put("/pin-note/:noteId", authenticateToken, noteController.updatePinNote);
router.delete(
  "/delete-note/:noteId",
  authenticateToken,
  noteController.deleteNote
);

module.exports = router;
