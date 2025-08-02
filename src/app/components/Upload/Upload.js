"use client";

import { useState } from "react";

export default function Upload({ prod, onImageChange }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Add loading state

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    setLoading(true); // 🔹 Start loading

    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1]; // Remove data URL prefix

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileBase64: base64String,
            fileName: `${prod.id}/${file.name}`,
          }),
        });

        const data = await res.json();

        if (data.url) {
          setUrl(data.url); // 🔹 Save uploaded URL locally
          onImageChange((prev) => ({ ...prev, imagePath: data.url }));
        } else {
          alert("Upload failed");
          console.error(data);
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("An error occurred during upload.");
      } finally {
        setLoading(false); // 🔹 Stop loading
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}

    </div>
  );
}
