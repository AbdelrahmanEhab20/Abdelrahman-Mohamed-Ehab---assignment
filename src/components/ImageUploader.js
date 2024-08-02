import React, { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setData(null);
    setError(null);
    uploadImage(file);
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);

    axios
      .post("http://localhost:3400/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="app-container">
      <h1 className="headline">OCR ID Card Reader</h1>
      <input type="file" onChange={handleImageUpload} className="file-input" />
      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}
      {loading && <p className="loader">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="data-container">
          <h2 style={{ textAlign: "center" }}>Extracted Data</h2>
          <form>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="data-field">
                <label>{key}</label>
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="data-input"
                />
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
