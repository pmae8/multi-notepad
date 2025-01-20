import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotesContext } from "../context/NotesContext";
import TaskItem from "./TaskItem";

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, updateNote, deleteNote } = useContext(NotesContext);
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title || "");
  const [text, setText] = useState(note?.text || ""); // Note textbox content
  const [tasks, setTasks] = useState(note?.tasks || []);

  const handleAddTask = () => {
    setTasks([...tasks, { id: Date.now(), text: "", completed: false }]);
  };

  const handleSave = () => {
    updateNote(id, { title, text, tasks });
    navigate("/");
  };

  const handleDelete = () => {
    deleteNote(id);
    navigate("/");
  };

  return (
    <div className="note-page">
      <h2>Note Editor</h2>
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
        <h3>Tasks</h3>
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
        <button onClick={handleAddTask}>+ Add Task</button>
      </div>
      <div className="actions">
        <button onClick={handleSave}>Save Note</button>
        <button onClick={handleDelete} style={{ backgroundColor: "red" }}>
          Delete Note
        </button>
      </div>
    </div>
  );
}

export default NotePage;
