import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NotesContext } from "../context/NotesContext";

function Homepage() {
  const { notes, addNote } = useContext(NotesContext);

  return (
    <div className="homepage">
      <h1>Multi-Notepad</h1>
      <button onClick={addNote}>+ Add New Note</button>
      <ul className="note-list">
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/note/${note.id}`}>{note.title || "Untitled Note"}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;
