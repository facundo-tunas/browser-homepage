interface ColorPalette {
  name: string;
  cssClass: string;
  isActive: boolean;
  mode: "light" | "dark" | "both" | "none";
  previewColors: string[];
  transparency: number;
  blur: number;
}

const definedPalettes: ColorPalette[] = [
  {
    name: "Default",
    cssClass: "palette-default",
    isActive: true,
    mode: "both",
    previewColors: ["#ffffff", "#d4d4d4", "#272727", "#19e4ff"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Catppuccin Latte",
    cssClass: "palette-catppuccin-latte",
    isActive: false,
    mode: "none",
    previewColors: ["#4c4f69", "#9ca0b0", "#eff1f5", "#209fb5"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Catppuccin Mocha",
    cssClass: "palette-mocha",
    isActive: false,
    mode: "none",
    previewColors: ["#cdd6f4", "#a6adc8", "#1e1e2e", "#74c7ec"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Nord",
    cssClass: "palette-nord",
    isActive: false,
    mode: "none",
    previewColors: ["#eceff4", "#d8dee9", "#2e3440", "#88c0d0"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Solarized Light",
    cssClass: "palette-solarized-light",
    isActive: false,
    mode: "none",
    previewColors: ["#586e75", "#657b83", "#fdf6e3", "#268bd2"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Solarized Dark",
    cssClass: "palette-solarized-dark",
    isActive: false,
    mode: "none",
    previewColors: ["#93a1a1", "#839496", "#002b36", "#268bd2"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Tokyo Night",
    cssClass: "palette-tokyo-night",
    isActive: false,
    mode: "none",
    previewColors: ["#a9b1d6", "#787c99", "#1a1b26", "#7dcfff"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Dracula",
    cssClass: "palette-dracula",
    isActive: false,
    mode: "none",
    previewColors: ["#f8f8f2", "#bfbfbf", "#282a36", "#8be9fd"],
    transparency: 1,
    blur: 0,
  },
  {
    name: "Gruvbox Light",
    cssClass: "palette-gruvbox-light",
    isActive: false,
    mode: "none",
    previewColors: ["#3c3836", "#504945", "#fbf1c7", "#689d6a"],
    transparency: 1,
    blur: 0,
  },

  {
    name: "Gruvbox Dark",
    cssClass: "palette-gruvbox-dark",
    isActive: false,
    mode: "none",
    previewColors: ["#ebdbb2", "#bdae93", "#282828", "#8ec07c"],
    transparency: 1,
    blur: 0,
  },
];

let palettes: ColorPalette[] = loadPaletteSettings();

function savePalettes(palettes: ColorPalette[]): void {
  const settingsToSave = palettes.map(
    ({ name, isActive, mode, transparency, blur }) => ({
      name,
      isActive,
      mode,
      transparency,
      blur,
    })
  );
  localStorage.setItem("palettes", JSON.stringify(settingsToSave));
}

function loadPaletteSettings(): ColorPalette[] {
  const stored = localStorage.getItem("palettes");
  if (!stored) {
    savePalettes(definedPalettes);
    return definedPalettes;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ColorPalette>[];

    return definedPalettes.map((palette) => {
      const storedPalette = parsed.find((p) => p.name === palette.name);
      if (storedPalette) {
        return {
          ...palette,
          isActive: storedPalette.isActive ?? palette.isActive,
          mode: storedPalette.mode ?? palette.mode,
          transparency: storedPalette.transparency ?? palette.transparency,
          blur: storedPalette.blur ?? palette.blur,
        };
      }
      return palette;
    });
  } catch {
    return definedPalettes;
  }
}

function initializePaletteSettings(): void {
  applyActivePalettes();
  displayPalettesInSettings();
}

function displayPalettesInSettings() {
  const container = document.getElementById("palettes-container");
  if (!container) return;
  container.innerHTML = "";

  palettes.forEach((palette, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("preview-option-item");
    wrapper.classList.add("individual-setting");

    const preview = document.createElement("div");
    preview.classList.add("preview-display");

    // Create color swatches container
    const swatchContainer = document.createElement("div");
    swatchContainer.classList.add("color-swatch-container");

    // Create color swatches for preview
    palette.previewColors.forEach((color) => {
      const swatch = document.createElement("div");
      swatch.classList.add("color-swatch");
      swatch.style.backgroundColor = color;
      swatchContainer.appendChild(swatch);
    });

    preview.appendChild(swatchContainer);

    const details = document.createElement("div");
    details.classList.add("option-details");

    const nameEl = document.createElement("h4");
    nameEl.textContent = palette.name;

    const description = document.createElement("div");
    description.classList.add("option-description");
    description.textContent =
      isPaletteActiveForMode(palette, "light") ||
      isPaletteActiveForMode(palette, "dark")
        ? `Active for ${palette.mode} mode`
        : "Not active";

    details.append(nameEl, description);

    const actions = document.createElement("div");
    actions.classList.add("option-actions");

    const lightBtn = document.createElement("button");
    const isLightActive = isPaletteActiveForMode(palette, "light");
    lightBtn.textContent = "Light";
    if (isLightActive) lightBtn.classList.add("selected");
    lightBtn.addEventListener("click", () => setPaletteForMode(index, "light"));

    const darkBtn = document.createElement("button");
    const isDarkActive = isPaletteActiveForMode(palette, "dark");
    darkBtn.textContent = "Dark";
    if (isDarkActive) darkBtn.classList.add("selected");
    darkBtn.addEventListener("click", () => setPaletteForMode(index, "dark"));

    actions.append(lightBtn, darkBtn);

    // Only show sliders if the palette is active for either light or dark mode
    const isPaletteSelected =
      isPaletteActiveForMode(palette, "light") ||
      isPaletteActiveForMode(palette, "dark");

    if (isPaletteSelected) {
      const blurSlider = document.createElement("input");
      blurSlider.type = "range";
      blurSlider.min = "0";
      blurSlider.max = "30";
      blurSlider.value = String(palette.blur);
      blurSlider.title = "Background Blur";

      blurSlider.addEventListener("input", (e) => {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        palette.blur = value;
        savePalettes(palettes);
        applyActivePalettes();
      });

      actions.appendChild(blurSlider);

      const transparencySlider = document.createElement("input");
      transparencySlider.type = "range";
      transparencySlider.min = "0";
      transparencySlider.max = "1";
      transparencySlider.step = "0.01";
      transparencySlider.value = String(palette.transparency);
      transparencySlider.title = "Transparency";

      transparencySlider.addEventListener("input", (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        palette.transparency = value;
        savePalettes(palettes);
        applyActivePalettes();
      });

      actions.appendChild(transparencySlider);
    }

    wrapper.append(preview, details, actions);
    container.appendChild(wrapper);
  });
}

function isPaletteActiveForMode(palette: ColorPalette, mode: "light" | "dark") {
  return palette.isActive && (palette.mode === mode || palette.mode === "both");
}

function setPaletteForMode(index: number, mode: "light" | "dark") {
  const selected = palettes[index];

  palettes.forEach((palette) => {
    if (palette.name === selected.name) return;

    if (
      palette.isActive &&
      (palette.mode === mode || palette.mode === "both")
    ) {
      if (palette.mode === "both") {
        palette.mode = mode === "light" ? "dark" : "light";
      } else {
        palette.mode = "none";
        palette.isActive = false;
      }
    }
  });

  selected.isActive = true;

  // Adjust mode based on existing mode
  if (selected.mode === "none") {
    selected.mode = mode;
  } else if (selected.mode !== mode) {
    selected.mode = "both";
  }

  savePalettes(palettes);
  displayPalettesInSettings();
  applyActivePalettes();
}

function applyActivePalettes() {
  const htmlElement = document.documentElement;
  palettes.forEach((palette) => {
    htmlElement.classList.remove(palette.cssClass);
  });

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const mode = prefersDark ? "dark" : "light";

  const activePalette = palettes.find(
    (palette) =>
      palette.isActive && (palette.mode === mode || palette.mode === "both")
  );

  if (activePalette) {
    htmlElement.classList.add(activePalette.cssClass);
    htmlElement.style.setProperty("--blur", `${activePalette.blur}px`);
    htmlElement.style.setProperty(
      "--transparency",
      `${activePalette.transparency}`
    );
  } else {
    htmlElement.style.removeProperty("--blur");
    htmlElement.style.removeProperty("--transparency");
  }
}

// Listen for system theme changes
function setupMediaQueryListener() {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Apply immediately and add listener for changes
  darkModeMediaQuery.addEventListener("change", applyActivePalettes);
}

document.addEventListener("DOMContentLoaded", () => {
  setupMediaQueryListener();
  initializePaletteSettings();
});
