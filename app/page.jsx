"use client";

import { useState } from "react";
import { ImageGenerator } from "./ImageGenerator";
import { renderPNG } from "./render-png";

export default function Home() {
  const [image, setImage] = useState(null);
  const [settings, setSettings] = useState({
    padding: 16,
    shadow: 10,
    radius: 16,
  });
  const [isLoading, setIsLoading] = useState(false);

  const setSetting = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.onload = () =>
        setImage({
          src: img.src,
          width: img.width,
          height: img.height,
          name: fileName,
        });
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  console.log(settings);

  return (
    <div className="w-full flex justify-center max-w-4xl px-4 py-8 max-lg:flex-col m-auto gap-8 lg:gap-16 min-h-full text-black">
      <div className="flex-1 flex items-center justify-center">
        <div class="card max-w-lg flex-1 bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Settings</h2>
            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">File</span>
              </div>
              <input
                type="file"
                onChange={handleImageUpload}
                class="file-input file-input-bordered file-input-sm file-input-primary w-full max-w-xs"
              />
            </label>

            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Padding</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.padding}
                onChange={(e) => setSetting("padding", Number(e.target.value))}
                class="range range-primary range-sm"
              />
            </label>

            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Shadow</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.shadow}
                onChange={(e) => setSetting("shadow", Number(e.target.value))}
                class="range range-primary range-sm"
              />
            </label>

            <label class="form-control w-full max-w-xs">
              <div class="label">
                <span class="label-text">Radius</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.radius}
                onChange={(e) => setSetting("radius", Number(e.target.value))}
                class="range range-primary range-sm"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full max-w-lg gap-4 m-auto flex-col flex items-center justify-center">
        <div className="w-full h-fit border rounded-md">
          <ImageGenerator settings={settings} image={image} />
        </div>
        <button
          className="btn"
          disabled={!image || isLoading}
          onClick={async () => {
            setIsLoading(true);
            const { blob } = await renderPNG({
              image,
              settings,
            });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${image.name}.png`;
            a.click();

            setIsLoading(false);
          }}
        >
          Download{" "}
          {isLoading ? (
            <span class="loading loading-spinner loading-sm"></span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
