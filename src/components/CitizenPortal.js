import React, { useState, useRef } from "react";
import "./CitizenPortal.css";

const CitizenPortal = ({ showNotification }) => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportText, setReportText] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Pothole Repair",
      status: "In Progress",
      description: "A large pothole on Main St. causing traffic issues.",
      timeAgo: "2 days ago",
      department: "Roads",
      statusClass: "status-in-progress",
    },
    {
      id: 2,
      title: "Streetlight Repair",
      status: "Pending",
      description: "Streetlight #27 is not working near market area.",
      timeAgo: "5 hours ago",
      department: "Electricity",
      statusClass: "status-pending",
    },
    {
      id: 3,
      title: "Water Leakage",
      status: "Resolved",
      description: "Leakage fixed near High Street pipe.",
      timeAgo: "1 day ago",
      department: "Water Supply",
      statusClass: "status-resolved",
    },
  ]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);

  // Submit report
  const handleSubmitReport = () => {
    if ((reportTitle.trim() !== "" && reportText.trim() !== "") || capturedImage) {
      const newReport = {
        id: reports.length + 1,
        title: reportTitle || "Citizen Report",
        status: "Pending",
        description: reportText,
        timeAgo: "Just now",
        department: "Citizen",
        statusClass: "status-pending",
        image: capturedImage || null,
      };

      setReports((prev) => [...prev, newReport]);
      setReportTitle("");
      setReportText("");
      setCapturedImage(null);
      showNotification("Report submitted successfully!");
    } else {
      showNotification("Please enter a title, description, or attach a photo.");
    }
  };

  // 🎙️ Voice Report
  const toggleVoiceReport = () => {
    if (!("webkitSpeechRecognition" in window)) {
      showNotification("Voice recognition not supported in this browser.");
      return;
    }

    if (!isRecording) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
        showNotification("🎙️ Listening...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setReportText((prev) => prev + " " + transcript);
      };

      recognition.onerror = (event) => {
        showNotification("❌ Error: " + event.error);
        setIsRecording(false);
      };

      recognition.onend = () => setIsRecording(false);

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
      showNotification("🛑 Voice recording stopped.");
    }
  };

  // 📸 Open Camera (tries back camera first)
  const openCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }, // 👈 back camera
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      try {
        // fallback to default camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        showNotification("Camera access denied or unavailable.");
      }
    }
  };

  // 📸 Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop camera stream
    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setCameraOpen(false);

    showNotification("📷 Photo captured!");
  };

  return (
    <div className="portal-section fade-in">
      <h2 className="section-title">Report an Issue</h2>

      <div className="card">
        {/* Small Title Input */}
        <input
          type="text"
          className="form-input"
          placeholder="Title (e.g., Water Leakage)"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
        />

        <textarea
          className="form-textarea"
          placeholder="Describe the issue..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />

        <div className="button-group">
          <label className="btn btn-secondary">
            📂 Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setCapturedImage(URL.createObjectURL(e.target.files[0]))
              }
            />
          </label>

          <button className="btn btn-secondary" onClick={openCamera}>
            📸 Open Camera
          </button>

          <button className="btn btn-secondary" onClick={toggleVoiceReport}>
            {isRecording ? "🛑 Stop Voice" : "🎙️ Start Voice"}
          </button>
        </div>

        {cameraOpen && (
          <div className="camera-modal">
            <video ref={videoRef} autoPlay style={{ width: "100%" }} />
            <button className="btn btn-primary mt-2" onClick={capturePhoto}>
              Capture
            </button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        {capturedImage && (
          <div className="preview mt-2">
            <h4>Captured Image Preview:</h4>
            <img
              src={capturedImage}
              alt="captured"
              style={{
                width: "150px",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <button className="btn btn-primary mt-4" onClick={handleSubmitReport}>
          Submit Report
        </button>
      </div>

      <div className="mt-8">
        <h2 className="section-title">Your Reported Issues</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="issue-card">
              <h3 className="issue-title">{report.title}</h3>
              <span className={`status-badge ${report.statusClass}`}>
                {report.status}
              </span>
              <p className="issue-description">{report.description}</p>
              {report.image && (
                <img
                  src={report.image}
                  alt="report"
                  style={{
                    width: "120px",
                    borderRadius: "6px",
                    marginTop: "4px",
                  }}
                />
              )}
              <div className="issue-meta">
                <span>{report.timeAgo}</span>
                <span>{report.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;
