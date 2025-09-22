import React, { useState } from "react";
import TaskModal from "./TaskModal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./StaffPortal.css";

const StaffPortal = ({ showNotification }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Repair Streetlight",
      status: "In Progress",
      location: "Kharadi",
      details: "Streetlight #15 requires a bulb replacement.",
      statusClass: "status-in-progress",
    },
    {
      id: 2,
      title: "Fix Water Leak",
      status: "Pending",
      location: "High Street",
      details: "Major water leakage from main pipe.",
      statusClass: "status-pending",
    },
    {
      id: 3,
      title: "Garbage Collection Delay",
      status: "Resolved",
      location: "MG Road",
      details: "Garbage pickup delayed for 2 days.",
      statusClass: "status-resolved",
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask({ ...task }); // create copy for modal
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? { ...task, status: updatedTask.status, statusClass: updatedTask.statusClass }
          : task
      )
    );
    showNotification("Status updated successfully!");
    handleModalClose();
  };

  // Chart data
  const data = [
    { name: "Pending", value: tasks.filter((t) => t.status === "Pending").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { name: "Resolved", value: tasks.filter((t) => t.status === "Resolved").length },
  ];

  const COLORS = ["#e74c3c", "#f39c12", "#27ae60"];

  return (
    <div className="portal-section fade-in">
      <h2 className="section-title">Your Assigned Tasks</h2>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => handleTaskClick(task)}
          >
            <h3 className="issue-title">{task.title}</h3>
            <p className="issue-description">Location: {task.location}</p>
            <span className={`status-badge ${task.statusClass}`}>{task.status}</span>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleModalClose}
          onUpdate={handleTaskUpdate}
          showNotification={showNotification} // pass notification function
        />
      )}

      {/* Analytics */}
      <div className="mt-10 card p-4">
        <h2 className="section-title mb-4">📊 Task Status Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffPortal;
