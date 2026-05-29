import React, { useState } from "react";

const API ="https://5qv9mx49dw7ai5-7860.proxy.runpod.net";

export default function App() {

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loadingPreview, setLoadingPreview] =
    useState(false);

  const [loadingGenerate, setLoadingGenerate] =
    useState(false);

  const [result, setResult] = useState(null);

  // AUTO REMBG PREVIEW
  const previewRemoveBG = async (
    selectedFiles
  ) => {

    setLoadingPreview(true);

    const formData = new FormData();

    for (
      let i = 0;
      i < selectedFiles.length;
      i++
    ) {
      formData.append(
        "files",
        selectedFiles[i]
      );
    }

    try {

      const response = await fetch(
        `${API}/preview-removebg`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (data.success) {
        setPreviews(
          data.previews || []
        );
      }

    } catch (e) {
      console.log(e);
      alert(
        "Background removal failed"
      );
    }

    setLoadingPreview(false);
  };

  // UPLOAD EVENT
  const onFiles = (e) => {

    const selected =
      [...e.target.files];

    setFiles(selected);
    setResult(null);

    // AUTO PREVIEW
    previewRemoveBG(selected);
  };

  // GENERATE 3D
  const generate = async () => {

    if (!files.length) {
      alert(
        "Upload images first"
      );
      return;
    }

    setLoadingGenerate(true);

    const formData = new FormData();

    files.forEach((f) => {
      formData.append(
        "files",
        f
      );
    });

    formData.append(
      "seed",
      0
    );

    formData.append(
      "ss_guidance_strength",
      7.5
    );

    formData.append(
      "ss_sampling_steps",
      12
    );

    formData.append(
      "slat_guidance_strength",
      3
    );

    formData.append(
      "slat_sampling_steps",
      12
    );

    formData.append(
      "multiimage_algo",
      "stochastic"
    );

    formData.append(
      "mesh_simplify",
      0.95
    );

    formData.append(
      "texture_size",
      1024
    );

    try {

      const response =
        await fetch(
          `${API}/generate`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      setResult(data);

    } catch (e) {
      console.log(e);
      alert(
        "Generation failed"
      );
    }

    setLoadingGenerate(false);
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily:
          "Arial"
      }}
    >

      <h2>
        TRELLIS 3D Generator
      </h2>

      {/* Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFiles}
      />

      {/* BG Preview */}
      <h3>
        Background Removed
      </h3>

      {loadingPreview && (
        <p>
          Removing background...
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap:
            "wrap",
        }}
      >
        {previews.map(
          (img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              width="180"
              style={{
                border:
                  "1px solid #ccc",
                borderRadius:
                  "8px",
              }}
            />
          )
        )}
      </div>

      <br />

      {/* Generate */}
      {files.length > 0 && (
        <button
          onClick={
            generate
          }
          disabled={
            loadingGenerate
          }
        >
          {loadingGenerate
            ? "Generating..."
            : "Generate 3D"}
        </button>
      )}

      {/* Output */}
      {result && (
        <div
          style={{
            marginTop:
              30,
          }}
        >

          <h3>
            3D Output
          </h3>

          <video
            controls
            width="500"
            src={
              result.preview_video
            }
          />

          <br />
          <br />

          <a
            href={
              result.glb_model
            }
            target="_blank"
            rel="noreferrer"
          >
            Download GLB
          </a>

        </div>
      )}

    </div>
  );
}
