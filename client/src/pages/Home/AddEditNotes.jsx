import React, { useEffect, useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;

const AddEditNotes = ({ noteData, getAllNotes, type, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const { id } = useParams();

  const addNewNote = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/note/add-note",
        {
          title,
          content,
          tags,
          userId: id,
          isPinned: false,
        }
      );

      if (response.data && response.data.note) {
        toast.success("Note added successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      }
    }
  };

  // edit notes
  const editNote = async () => {
    try {
      const id = noteData._id;
      const response = await axios.put(
        `http://localhost:5000/api/v1/note/edit-note/${id}`,
        {
          title,
          content,
          tags,
        }
      );

      if (response.data && response.data.note) {
        toast.success("Note updated successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    if (!content) {
      toast.error("Please enter content");
      return;
    }
    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-sm border p-2 rounded text-slate-950 outline-none"
          placeholder="Go to Gym At 5"
          value={title}
          //   onChange={(e) => setTitle(e.target.value)}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className="mt-3">
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update" : "Add"}
      </button>
    </div>
  );
};

export default AddEditNotes;
