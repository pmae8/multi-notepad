import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { NotesContext } from "../context/NotesContext";
import TaskItem from "./TaskItem";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useContext(NotesContext);
  const note = notes.find((note) => note.id === id);

  const [title, setTitle] = useState(note?.title || "");
  const [text, setText] = useState(note?.text || "");
  const [tasks, setTasks] = useState(note?.tasks || []);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const textareaRef = useRef(null);

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
    [updateNote] // Keep updateNote as a dependency
  );

  useEffect(() => {
    debouncedUpdateNote(id, { title, text, tasks });
  }, [id, note, title, text, tasks, debouncedUpdateNote]);

  const handleAddTask = () => {
    const newTask = { id: uuidv4(), text: "", completed: false };
    setTasks([...tasks, newTask]);
    debouncedUpdateNote(id, { tasks });
  };

  const handleDelete = () => {
    deleteNote(id);
    navigate("/");
  };

  const handleUpdateTask = (index, updatedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);
    debouncedUpdateNote(id, { tasks });
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    debouncedUpdateNote(id, { tasks });
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  if (!note) {
    return <div>Note not found</div>;
  }

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
              <li key={note.id} onClick={() => navigate(`/note/${note.id}`)}> 
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
          onChange={(e) => {
            setText(e.target.value);
            adjustHeight();
          }}
          placeholder="Write your note here..."
          className="note-textarea"
          rows={6}
          ref={textareaRef}
        ></textarea>
        <div className="tasks-section">
          {/* <h3>Tasks</h3> */}
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={(updatedTask) => handleUpdateTask(index, updatedTask)}
              onDelete={() => handleDeleteTask(index)}
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