import React from "react";
import "./Form.css";

const RunForm = ({
  formData,
  setFormData,
  handleSubmit,
  setShowForm,
  isEditing,
}) => {
  return (
    <div className="modal-overlay">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="form-title">New Run</h3>

        <input
          type="number"
          placeholder="Distance (km)"
          step="0.1"
          required
          value={formData.distance}
          onChange={(e) =>
            setFormData({ ...formData, distance: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Time (min)"
          required
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />

        <textarea
          placeholder="Notes..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />

        <div className="form-actions">
          <button type="submit" className="btn-save">
            {isEditing ? "Save changes" : "Save"}
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RunForm;
