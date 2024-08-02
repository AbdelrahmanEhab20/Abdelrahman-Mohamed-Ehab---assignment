import React, { useState } from "react";
import Tesseract from "tesseract.js";
// import "../";

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
    processImage(file);
  };

  const processImage = (file) => {
    setLoading(true);

    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        const extractedData = processText(text);
        setData(extractedData);
      })
      .catch((err) => {
        console.error(err);
        setError("Error processing image.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const processText = (text) => {
    const extractedData = {};
    const lines = text.split("\n");
    let foundExpireDate = false;

    lines.forEach((line) => {
      console.log("Processing line:", line);

      let match;

      // Match and clean NAME field
      match = line.match(/\bname\b\s*[:=]?\s*(.+)/i);
      if (match) {
        console.log("Matched Name:", match[1]);
        extractedData["Name"] = cleanText(match[1], /[^a-zA-Z\s]/g);
      }
      // Match and clean ID field
      match = line.match(/\b(?:id|id number|student id)\b\s*[:=]?\s*(.+)/i);
      if (match) {
        console.log("Matched ID:", match[1]);
        extractedData["ID"] = cleanText(match[1], /[^0-9-]/g);
      }
      // Match and clean D.O.B. field
      match = line.match(/D.O.B\s*[:=]\s*(.+)/i);
      if (match) {
        console.log("Matched D.O.B.:", match[1]);
        extractedData["D.O.B."] = cleanDateText(match[1]);
      }

      // Match and clean GRADE/YEAR field
      match = line.match(/\b(?:grade|year|grade\/year)\b\s*[:=]?\s*(.+)/i);
      if (match) {
        console.log("Matched Grade/Year:", match[1]);
        extractedData["Grade/Year"] = formatGradeYear(match[1]);
      }
      // Match and clean ISSUED ON field
      match = line.match(/\b(?:issued on|issue date)\b\s*[:=]?\s*(.+)/i);
      if (match) {
        console.log("Matched Issued On:", match[1]);
        extractedData["Issued On"] = cleanDateText(match[1]);
      }

      // Match and clean ADDRESS field
      match = line.match(/\b(?:address)\b\s*[:=]?\s*(.+)/i);
      if (match) {
        console.log("Matched Address:", match[1]);
        extractedData["Address"] = cleanText(match[1], /[^a-zA-Z0-9\s,]/g);
      }

      // Match and clean EXPIRE DATE field
      match = line.match(/(?:expire date|valid until|valid to)\s*[:=]\s*(.+)/i);
      if (match) {
        console.log("Matched Expire Date:", match[1]);
        extractedData["Expire Date"] = cleanDateText(match[1]);
        foundExpireDate = true;
      }
      // Match and clean DATE OF BIRTH field
      match = line.match(/date of birth\s*[:=]\s*(.+)/i);
      if (match) {
        console.log("Matched Date of Birth:", match[1]);
        extractedData["Date of Birth"] = cleanDateText(match[1]);
      } else if (!foundExpireDate) {
        // Match and clean DATE field only if not already matched as "Expire Date"
        match = line.match(/date\s*[:=]\s*(.+)/i);
        if (match) {
          console.log("Matched Date:", match[1]);
          extractedData["Date"] = cleanDateText(match[1]);
        }
      }
    });

    return extractedData;
  };

  const cleanText = (text, pattern) => {
    return text.replace(pattern, "").trim();
  };

  const cleanDateText = (text) => {
    return text.replace(/[^a-zA-Z0-9\s,/-]/g, "").trim();
  };

  const formatGradeYear = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "").trim();
    if (cleanedText.length === 6) {
      return cleanedText.slice(0, 2) + "/" + cleanedText.slice(2);
    }
    return cleanedText;
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
