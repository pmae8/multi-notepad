import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    const newNote = { id: uuidv4(), title: "", tasks: [] };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, updatedNote) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}
