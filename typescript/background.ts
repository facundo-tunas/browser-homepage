interface Wallpaper {
  name: string;
  path: string;
  isActive: boolean;
  mode: "light" | "dark" | "both" | "none";
  type?: "image" | "color";
  color?: string;
}

const definedWallpapers: Wallpaper[] = [
  {
    name: "Solid Color 1",
    path: "",
    color: "#f5f5f5",
    type: "color",
    isActive: false,
    mode: "none",
  },
  {
    name: "Solid Color 2",
    path: "",
    color: "#303030",
    type: "color",
    isActive: false,
    mode: "none",
  },
  {
    name: "Beach",
    path: "./assets/wallpapers/beach.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Clouds",
    path: "./assets/wallpapers/clouds.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Evening Sky",
    path: "./assets/wallpapers/evening-sky.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Night Sky",
    path: "./assets/wallpapers/night-sky.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Space (Catppuccin)",
    path: "./assets/wallpapers/space-catppuccin.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Room Day",
    path: "./assets/wallpapers/room-day.jpg",
    isActive: false,
    mode: "light",
    type: "image",
  },
  {
    name: "Room Night",
    path: "./assets/wallpapers/room-night.jpg",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Solarized (Light)",
    path: "./assets/wallpapers/solarized-light.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Solarized (Dark)",
    path: "./assets/wallpapers/solarized-dark.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Space (Nord)",
    path: "./assets/wallpapers/space-nord.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Café Night",
    path: "./assets/wallpapers/cafe-night.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Stripes (Tokyo)",
    path: "./assets/wallpapers/tokyo-night.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Dracula",
    path: "./assets/wallpapers/dracula.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Birds",
    path: "./assets/wallpapers/birds.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Gruvbox (Light)",
    path: "./assets/wallpapers/gruvbox-light.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
  {
    name: "Gruvbox (Dark)",
    path: "./assets/wallpapers/gruvbox-dark.png",
    isActive: false,
    mode: "none",
    type: "image",
  },
];

function loadWallpaperSettings(): Wallpaper[] {
  const stored = localStorage.getItem("wallpapers");
  if (!stored) {
    saveWallpapers(definedWallpapers);
    return definedWallpapers;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<Wallpaper>[];

    const updatedDefinedWallpapers = definedWallpapers.map((wallpaper) => {
      const storedWallpaper = parsed.find((w) => w.name === wallpaper.name);
      if (storedWallpaper) {
        return {
          ...wallpaper,
          isActive: storedWallpaper.isActive ?? wallpaper.isActive,
          mode: storedWallpaper.mode ?? wallpaper.mode,
          type: storedWallpaper.type ?? wallpaper.type ?? "image",
          color: storedWallpaper.color ?? wallpaper.color,
        };
      }
      return wallpaper;
    });

    return updatedDefinedWallpapers;
  } catch {
    return definedWallpapers;
  }
}

let wallpapers: Wallpaper[] = loadWallpaperSettings();

function saveWallpapers(wallpapers: Wallpaper[]): void {
  const settingsToSave = wallpapers.map(({ name, isActive, mode, type, color, path }) => ({
    name,
    isActive,
    mode,
    type,
    color,
    path: type === "color" ? "" : path,
  }));
  localStorage.setItem("wallpapers", JSON.stringify(settingsToSave));
}

function loadAndApplyActiveWallpapers() {
  let activeLight = wallpapers.find(
    (wp) => wp.isActive && (wp.mode === "light" || wp.mode === "both")
  );
  let activeDark = wallpapers.find(
    (wp) => wp.isActive && (wp.mode === "dark" || wp.mode === "both")
  );

  // Set defaults if no active wallpapers
  if (!activeLight && !activeDark) {
    activeLight = wallpapers[0];
    activeDark = wallpapers[1] || wallpapers[0];

    if (activeLight) {
      activeLight.isActive = true;
      activeLight.mode = "light";
    }
    if (activeDark) {
      activeDark.isActive = true;
      activeDark.mode = "dark";
    }
    saveWallpapers(wallpapers);
  }

  const preloadImage = (path: string | undefined) => {
    if (path) {
      const img = new Image();
      img.src = path;
    }
  };

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    if (activeDark?.type !== "color") {
      preloadImage(activeDark?.path);
    }
  } else {
    if (activeLight?.type !== "color") {
      preloadImage(activeLight?.path);
    }
  }

  if (activeLight) {
    if (activeLight.type === "color" && activeLight.color) {
      document.documentElement.style.setProperty(
        "--bg-image-light",
        activeLight.color
      );
    } else {
      document.documentElement.style.setProperty(
        "--bg-image-light",
        `url("${activeLight.path}")`
      );
    }
  }
  if (activeDark) {
    if (activeDark.type === "color" && activeDark.color) {
      document.documentElement.style.setProperty(
        "--bg-image-dark",
        activeDark.color
      );
    } else {
      document.documentElement.style.setProperty(
        "--bg-image-dark",
        `url("${activeDark.path}")`
      );
    }
  }
}

function displayWallpapersInSettings() {
  const container = document.getElementById("wallpaper-container");
  if (!container) return;
  container.innerHTML = "";

  if (config.hideWallpapers) return;

  // Separate wallpapers by type
  const colorBackgrounds = wallpapers.filter(wp => wp.type === "color");
  const imageWallpapers = wallpapers.filter(wp => wp.type !== "color");

  // color backgrounds section
  if (colorBackgrounds.length > 0) {
    const colorSection = document.createElement("div");
    colorSection.classList.add("settings-category-container")

    const colorTitle = document.createElement("h4");
    colorTitle.textContent = "Solid Color Backgrounds";
    colorSection.appendChild(colorTitle);

    colorBackgrounds.forEach((wp) => {
      const index = wallpapers.indexOf(wp);
      colorSection.appendChild(createWallpaperItem(wp, index));
    });

    container.appendChild(colorSection);
  }

  // image wallpapers section
  if (imageWallpapers.length > 0) {
    const imageSection = document.createElement("div");
    imageSection.classList.add("settings-category-container")

    const imageTitle = document.createElement("h4");
    imageTitle.textContent = "Image Wallpapers";
    imageSection.appendChild(imageTitle);

    imageWallpapers.forEach((wp) => {
      const index = wallpapers.indexOf(wp);
      imageSection.appendChild(createWallpaperItem(wp, index));
    });

    container.appendChild(imageSection);
  }
}

function createWallpaperItem(wp: Wallpaper, index: number): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.classList.add("preview-option-item");
  wrapper.classList.add("individual-setting");

  const preview = document.createElement("div");
  preview.classList.add("preview-display");

  if (wp.type === "color" && wp.color) {
    // Display color preview
    preview.style.backgroundColor = wp.color;
    preview.style.cursor = "pointer";
    preview.title = "Click to change color";
    preview.addEventListener("click", () => editCustomColorBackground(index));
  } else {
    // Display image preview
    const img = document.createElement("img");
    img.alt = wp.name;

    const isActive =
      isWallpaperActiveForMode(wp, "light") ||
      isWallpaperActiveForMode(wp, "dark");
    img.loading = isActive ? "eager" : "lazy";
    img.src = wp.path;

    img.onerror = () => (img.alt = "Image not found");
    preview.appendChild(img);
  }

  const details = document.createElement("div");
  details.classList.add("option-details");

  const nameEl = document.createElement("h4");
  nameEl.textContent = wp.name;

  details.append(nameEl);

  const actions = document.createElement("div");
  actions.classList.add("option-actions");

  const lightBtn = document.createElement("button");
  const isLightActive = isWallpaperActiveForMode(wp, "light");
  lightBtn.textContent = "Light";

  if (isLightActive) lightBtn.classList.add("selected");
  lightBtn.addEventListener("click", () =>
    setWallpaperForMode(index, "light")
  );

  const darkBtn = document.createElement("button");
  const isDarkActive = isWallpaperActiveForMode(wp, "dark");
  darkBtn.textContent = "Dark";

  if (isDarkActive) darkBtn.classList.add("selected");
  darkBtn.addEventListener("click", () => setWallpaperForMode(index, "dark"));

  actions.append(lightBtn, darkBtn);

  wrapper.append(preview, details, actions);
  return wrapper;
}

function editCustomColorBackground(index: number) {
  const background = wallpapers[index];

  const fields: Field = {
    Color: [background.color || "#303030", "color"],
  };

  createForm(fields, (formData: { [key: string]: any }) => {
    wallpapers[index] = {
      ...background,
      color: formData["Color"],
    };
    saveWallpapers(wallpapers);
    loadAndApplyActiveWallpapers();
    displayWallpapersInSettings();
  });
}

function isWallpaperActiveForMode(wp: Wallpaper, mode: "light" | "dark") {
  return wp.isActive && (wp.mode === mode || wp.mode === "both");
}

function setWallpaperForMode(index: number, mode: "light" | "dark") {
  const selected = wallpapers[index];

  wallpapers.forEach((wp) => {
    if (wp.name === selected.name) return;

    if (wp.isActive && (wp.mode === mode || wp.mode === "both")) {
      if (wp.mode === "both") {
        wp.mode = mode === "light" ? "dark" : "light";
      } else {
        wp.mode = "none";
        wp.isActive = false;
      }
    }
  });

  selected.isActive = true;

  if (selected.mode === "none") {
    selected.mode = mode;
  } else if (selected.mode !== mode) {
    selected.mode = "both";
  }

  saveWallpapers(wallpapers);
  loadAndApplyActiveWallpapers();
  displayWallpapersInSettings();
}

function initializeWallpaperSettings() {
  // first load active wallpaper for faster loadng
  loadAndApplyActiveWallpapers();

  const wallpaperTitle = document.querySelector("#wallpaper-title");
  wallpaperTitle?.addEventListener("mouseup", () => {
    config.hideWallpapers = !config.hideWallpapers;
    wallpaperTitle.classList.toggle("hidden", config.hideWallpapers);

    saveConfig();
    displayWallpapersInSettings();
  });

  // then do everything else
  setTimeout(() => {
    displayWallpapersInSettings();
  }, 100);
}
