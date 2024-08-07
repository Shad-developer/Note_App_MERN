import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;

const Home = () => {
  const [notes, setNotes] = useState([]);

  // modal
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });


  const getAllNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/note/get-all-notes"
      );
      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };

  // delete note
  const handleDelete = async (noteId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/note/delete-note/${noteId}`
      );
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        getAllNotes();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // pin note
  const handlePinNote = async (noteId, isPinned) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/note/pin-note/${noteId}`,
        { isPinned }
      );
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        getAllNotes();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {

      getAllNotes();
  }, []);

  return (
    <>
      <div className="container px-10">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {notes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdAt}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item._id)}
              onPinNote={() => handlePinNote(item)}
            />
          ))}
        </div>
      </div>
      <button
        className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute bottom-10 right-10  "
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ ...openAddEditModal, isShown: false })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
