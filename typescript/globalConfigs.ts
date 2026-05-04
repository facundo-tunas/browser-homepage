const config = {
  showDate: true,
  showSearch: true,
  hideWallpapers: false,
  hideGlobalSettings: false,
  hideBookmarks: false,
  hideSearchPrefixes: false,
  hidePalettes: false,
  hoverEffects: true,
};

function loadConfig() {
  const savedConfig = localStorage.getItem("config");
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      if (parsedConfig.showSearch === undefined) {
        parsedConfig.showSearch = true;
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
      if (parsedConfig.hidePalettes === undefined) {
        parsedConfig.hidePalettes = false;
      }
      if (parsedConfig.hoverEffects === undefined) {
        parsedConfig.hoverEffects = true;
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

document.addEventListener("DOMContentLoaded", function () {
  setupBookmarks();
  loadConfig();

  const clockElement = document.getElementById("clock");
  const dateCheckbox = document.getElementById(
    "toggle-date-checkbox",
  ) as HTMLInputElement;
  const searchCheckbox = document.getElementById(
    "toggle-search-checkbox",
  ) as HTMLInputElement;
  const hoverEffectsCheckbox = document.getElementById(
    "toggle-hover-checkbox",
  ) as HTMLInputElement;

  dateCheckbox.checked = config.showDate;
  searchCheckbox.checked = config.showSearch;
  hoverEffectsCheckbox.checked = config.hoverEffects;

  dateCheckbox.addEventListener("change", () => {
    config.showDate = dateCheckbox.checked;
    saveConfig();
    if (clockElement) updateClockDisplay(clockElement);
  });

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

  hoverEffectsCheckbox.addEventListener("change", () => {
    config.hoverEffects = hoverEffectsCheckbox.checked;
    saveConfig();
    config.hoverEffects
      ? root.style.setProperty("--containerBgHover", "")
      : root.style.setProperty("--containerBgHover", "transparent");
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

  config.hoverEffects
    ? root.style.setProperty("--containerBgHover", "")
    : root.style.setProperty("--containerBgHover", "transparent");
});
