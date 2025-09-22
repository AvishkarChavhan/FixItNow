import React, { useState, useRef } from "react";
import "./TaskModal.css";

const TaskModal = ({ task, onClose, onUpdate, showNotification }) => {
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [proofImage, setProofImage] = useState(task.proof || null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const statusOptions = ["Pending", "In Progress", "Resolved"];

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "status-in-progress";
      case "Pending":
        return "status-pending";
      case "Resolved":
        return "status-resolved";
      default:
        return "";
    }
  };

  const handleUpdate = () => {
    const updatedTask = {
      ...task,
      status: selectedStatus,
      statusClass: getStatusClass(selectedStatus),
      proof: proofImage,
    };
    onUpdate(updatedTask);
  };

  const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      showNotification("Camera access denied or unavailable.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setProofImage(imageData);

    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setCameraOpen(false);
    showNotification("📷 Proof captured!");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProofImage(reader.result);
    reader.readAsDataURL(file);
    showNotification("📂 Proof uploaded!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">{task.title}</h3>
        <p><strong>Location:</strong> {task.location}</p>
        <p><strong>Details:</strong> {task.details}</p>

        {/* Status */}
        <div className="mt-2">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Proof Upload */}
        <div className="mt-4">
          <label className="btn btn-secondary">
            📂 Upload Proof
            <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
          </label>
          <button className="btn btn-secondary ml-2" onClick={openCamera}>
            📸 Open Camera
          </button>
        </div>

        {cameraOpen && (
          <div className="camera-modal mt-2">
            <video ref={videoRef} autoPlay />
            <button className="btn btn-primary mt-2" onClick={capturePhoto}>
              Capture
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {proofImage && (
          <div className="preview mt-2">
            <h4>Proof Preview:</h4>
            <img src={proofImage} alt="proof" />
          </div>
        )}

        <div className="modal-buttons mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary ml-2" onClick={handleUpdate}>
            Update Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
