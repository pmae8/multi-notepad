import React, { useContext, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { NotesContext } from "../context/NotesContext";
import TaskItem from "./TaskItem";
import { debounce } from "lodash";

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useContext(NotesContext);
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title || "");
  const [text, setText] = useState(note?.text || "");
  const [tasks, setTasks] = useState(note?.tasks || []);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
      setTasks(note.tasks);
    }
  }, [id, note]);

  const debouncedUpdateNote = useCallback(
    debounce((id, updatedNote) => {
      updateNote(id, updatedNote);
    }, 500),
    [updateNote]
  );

  useEffect(() => {
    debouncedUpdateNote(id, { title, text, tasks });
  }, [id, note, title, text, tasks, debouncedUpdateNote]);

  const handleAddTask = () => {
    setTasks([...tasks, { id: Date.now(), text: "", completed: false }]);
  };

  const handleDelete = () => {
    deleteNote(id);
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="note-page">
      <button className="toggle-sidebar-button" onClick={toggleSidebar}>
        <i className={`fas ${isSidebarVisible ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      {isSidebarVisible && (
        <div className="sidebar">
          <h3>Notes</h3>
          <ul className="note-list">
            {notes.map((note) => (
              <li key={note.id}>
                <Link to={`/note/${note.id}`}>{note.title || "Untitled Note"}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={`note-editor ${isSidebarVisible ? "with-sidebar" : ""}`}>
        <h2>{note.title}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="note-title-input"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here..."
          className="note-textarea"
          rows={6}
        ></textarea>
        <div className="tasks-section">
          {/* <h3>Tasks</h3> */}
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={(updatedTask) => {
                const newTasks = tasks.map((t, i) =>
                  i === index ? updatedTask : t
                );
                setTasks(newTasks);
              }}
              onDelete={() => setTasks(tasks.filter((_, i) => i !== index))}
            />
          ))}
          <button onClick={handleAddTask}>+ CheckBox </button>
        </div>
        <div className="actions">
          <button onClick={handleDelete} style={{ backgroundColor: "red" }}>
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotePage;