import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );
      setResult(res.data);
      console.log(res.data); // debug
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Predict</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction: {result.prediction}</h3>
          <p><strong>Plant:</strong> {result.details.Plant}</p>
          <p><strong>Disease:</strong> {result.details.Disease}</p>
          <p><strong>Root Cause:</strong> {result.details["Root Cause"]}</p>
          <p><strong>Symptoms:</strong></p>
          <ul>
            {result.details.Symptoms.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
          <p><strong>Treatment:</strong></p>
          <ul>
            {result.details.Treatment.map((t, idx) => <li key={idx}>{t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
