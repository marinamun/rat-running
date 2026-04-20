import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import RunForm from "../components/RunForm";
import { auth, db } from "../firebase";
import Navbar from "../components/Navabar";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Dashboard = () => {
  const user = auth.currentUser;
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRun, setEditingRun] = useState(null);
  const [formData, setFormData] = useState({
    distance: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "runs"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleEdit = (run) => {
    setEditingRun(run);
    setFormData({
      distance: run.distance,
      time: run.time,
      note: run.note || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "runs", id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRun) {
      await updateDoc(doc(db, "runs", editingRun.id), formData);
      setEditingRun(null);
    } else {
      await addDoc(collection(db, "runs"), {
        ...formData,
        date: new Date().toLocaleDateString(),
        userId: user.uid,
        createdAt: new Date(),
      });
    }
    setFormData({ distance: "", time: "", note: "" });
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRun(null);
    setFormData({ distance: "", time: "", note: "" });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Navbar />

      <section className="welcome-section">
        <h3>Past Entries</h3>
        <button className="btn-add-entry" onClick={() => setShowForm(true)}>
          +
        </button>
      </section>

      {showForm && (
        <RunForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          setShowForm={handleCloseForm}
          isEditing={!!editingRun}
        />
      )}

      <div className="entries-list">
        {entries.map((run) => (
          <div key={run.id} className="entry-card">
            <div className="card-header">
              <span className="card-date">{run.date}</span>
            </div>
            <div className="card-metrics">
              <div className="card-metric">
                <span className="card-metric-value">{run.distance}</span>
                <span className="card-metric-label">km</span>
              </div>
              <div className="metric-divider" />
              <div className="card-metric">
                <span className="card-metric-value">{run.time}</span>
                <span className="card-metric-label">min</span>
              </div>
            </div>
            {run.note && <p className="card-note">{run.note}</p>}
            <div className="card-actions">
              <button
                className="card-action-btn edit"
                onClick={() => handleEdit(run)}
              >
                Edit
              </button>
              <button
                className="card-action-btn delete"
                onClick={() => handleDelete(run.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
