import React, { useState } from "react";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("Java");
  const [code, setCode] = useState("");
  const [modification, setModification] = useState("");
  const [modifiedCode, setModifiedCode] = useState("");

  const generateCode = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_code/", {
        prompt,
        language,
      });
      setCode(response.data.code);
      setModifiedCode(""); // Clear previous modified code
    } catch (error) {
      setCode("Error generating code.");
    }
  };

  const modifyCode = async () => {
    if (!code) {
      setModifiedCode("Generate code first before modifying.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/modify_code/", {
        code,
        modification,
      });
      setModifiedCode(response.data.modified_code);
    } catch (error) {
      setModifiedCode("Error modifying code.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Conversational Code Generator</h1>

      {/* Prompt Input */}
      <input
        type="text"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: "8px", margin: "10px", width: "60%" }}
      />

      {/* Language Selection */}
      <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "8px", margin: "10px" }}>
        <option value="Python">Python</option>
        <option value="JavaScript">JavaScript</option>
        <option value="Java">Java</option>
      </select>

      <button onClick={generateCode} style={{ padding: "10px 15px", margin: "10px", cursor: "pointer" }}>
        Generate Code
      </button>

      {/* Code Display */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <div style={{ textAlign: "left", backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px", overflowX: "auto", width: "80%", maxWidth: "600px" }}>
          <h3>Generated Code:</h3>
          <pre>
            <code>{code || "No code generated yet."}</code>
          </pre>
        </div>
      </div>

      {/* Code Modification */}
      <input
        type="text"
        placeholder="Describe modification (e.g., 'Make it recursive')"
        value={modification}
        onChange={(e) => setModification(e.target.value)}
        style={{ padding: "8px", margin: "10px", width: "60%" }}
      />

      <button onClick={modifyCode} style={{ padding: "10px 15px", margin: "10px", cursor: "pointer" }}>
        Modify Code
      </button>

      {/* Modified Code Display */}
      {modifiedCode && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <div style={{ textAlign: "left", backgroundColor: "#dff4d4", padding: "10px", borderRadius: "5px", overflowX: "auto", width: "80%", maxWidth: "600px" }}>
            <h3>Modified Code:</h3>
            <pre>
              <code>{modifiedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
