const config = {
  showSearch: true,
  openBlank: false,
  blur: 0,
  transparency: 1,

  hideWallpapers: false,
  hideGlobalSettings: false,
  hideBookmarks: false,
  hideSearchPrefixes: false,
  hideTransparency: false,
};

function loadConfig() {
  const savedConfig = localStorage.getItem("config");
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      if (parsedConfig.showSearch === undefined) {
        parsedConfig.showSearch = true;
      }
      if (parsedConfig.openBlank === undefined) {
        parsedConfig.openBlank = false;
      }
      if (parsedConfig.blur === undefined) {
        parsedConfig.blur = 0;
      }
      if (parsedConfig.transparency === undefined) {
        parsedConfig.transparency = 1;
      }
      if (parsedConfig.hideWallpapers === undefined) {
        parsedConfig.hideWallpapers = false;
      }
      if (parsedConfig.hideGlobalSettings === undefined) {
        parsedConfig.hideGlobalSettings = false;
      }
      if (parsedConfig.hideBookmarks === undefined) {
        parsedConfig.hideBookmarks = false;
      }
      if (parsedConfig.hideSearchPrefixes === undefined) {
        parsedConfig.hideSearchPrefixes = false;
      }
      if (parsedConfig.hideTransparency === undefined) {
        parsedConfig.hideTransparency = false;
      }

      Object.assign(config, parsedConfig);
    } catch (e) {
      console.warn("Failed to parse saved config, using defaults");
    }
  }

  const storedStopwatch = localStorage.getItem("storedStopwatch");
  if (storedStopwatch) startStopwatch();
}

function saveConfig() {
  localStorage.setItem("config", JSON.stringify(config));
}

function applyTransparencySettings() {
  const root = document.documentElement;
  root.style.setProperty("--blur", `${config.blur}px`);
  root.style.setProperty("--transparency", `${config.transparency}`);
}

document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.classList.add("loaded");
  setupBookmarks();
  loadConfig();
  applyTransparencySettings();

  const clockElement = document.getElementById("clock");
  const searchCheckbox = document.getElementById(
    "toggle-search-checkbox",
  ) as HTMLInputElement;

  searchCheckbox.checked = config.showSearch;

  searchCheckbox.addEventListener("change", () => {
    config.showSearch = searchCheckbox.checked;
    saveConfig();
    const searchWrapper = document.querySelector(
      ".message-container",
    ) as HTMLElement;
    if (searchWrapper) {
      searchWrapper.style.display = config.showSearch ? "block" : "none";
    }
  });

  const blankCheckbox = document.querySelector(
    "#toggle-blank-checkbox",
  ) as HTMLInputElement;
  blankCheckbox.checked = config.openBlank;

  blankCheckbox.addEventListener("change", () => {
    config.openBlank = blankCheckbox.checked;
    saveConfig();
  });

  const blurSlider = document.getElementById(
    "blur-slider",
  ) as HTMLInputElement;
  blurSlider.value = String(config.blur);

  blurSlider.addEventListener("input", () => {
    config.blur = parseInt(blurSlider.value, 10);
    saveConfig();
    applyTransparencySettings();
  });

  const transparencySlider = document.getElementById(
    "transparency-slider",
  ) as HTMLInputElement;
  transparencySlider.value = String(config.transparency);

  transparencySlider.addEventListener("input", () => {
    config.transparency = parseFloat(transparencySlider.value);
    saveConfig();
    applyTransparencySettings();
  });

  // fire the configs up :-)

  if (clockElement) {
    clockElement.innerHTML = getTime();
    updateClockDisplay(clockElement);
    setInterval(() => {
      clockElement.innerHTML = getTime();
    }, 100);
  }

  const searchWrapper = document.querySelector(
    ".message-container",
  ) as HTMLElement;
  if (searchWrapper) {
    searchWrapper.style.display = config.showSearch ? "block" : "none";
  }
});
