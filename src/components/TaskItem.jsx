import React from "react";

function TaskItem({ task, onUpdate, onDelete }) {
  const handleTextChange = (e) => {
    onUpdate({ ...task, text: e.target.value });
  };

  const handleCheckboxChange = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCheckboxChange}
      />
      <input
        type="text"
        value={task.text}
        onChange={handleTextChange}
        placeholder="Task description"
      />
      <button onClick={onDelete}>🗑️</button>
    </div>
  );
}

export default TaskItem;