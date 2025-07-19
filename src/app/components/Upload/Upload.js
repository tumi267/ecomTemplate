"use client";

import { useState } from "react";

export default function Upload({prod,onImageChange}) {
  const [url, setUrl] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1]; // Remove data URL prefix

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
        
        onImageChange((prev) => ({ ...prev, imagePath: data.url}));
      } else {
        alert("Upload failed");
        console.error(data);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {url && <p>Image uploaded: <a href={url} target="_blank">{url}</a></p>}
    </div>
  );
}
