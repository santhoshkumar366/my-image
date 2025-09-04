import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [resolution, setResolution] = useState("512x512");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("style", style);
      formData.append("resolution", resolution);

      const response = await fetch("https://b415d878a438.ngrok-free.app/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to generate image");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("image")) {
        const text = await response.text();
        throw new Error(text || "Invalid response from server");
      }

      const blob = await response.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Prompt-to-Image Generator</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "300px", marginRight: "10px", padding: "5px" }}
        />
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="realistic">Realistic</option>
          <option value="digital art">Digital Art</option>
          <option value="fantasy">Fantasy</option>
          <option value="cinematic">Cinematic</option>
          <option value="painting">Painting</option>
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Resolution (e.g., 512x512)"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          style={{ width: "150px", padding: "5px" }}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ padding: "5px 15px" }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={imageUrl}
            alt="Generated"
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          />
        </div>
      )}
    </div>
  );
}
