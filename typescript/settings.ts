document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      console.log("xd")
      openSettingsTab();
    }
  });

  initializeBookmarksSettings();
  initializeSearchSettings();
  initializeWallpaperSettings();
  initializeSectionHideToggles();
});

function initializeSectionHideToggles() {
  const sections = [
    { title: "#global-settings-title", container: "#global-settings-title + .individual-setting", configKey: "hideGlobalSettings" as const },
    { title: "#bookmarks-title", container: "#add-bookmark, #bookmarks-container", configKey: "hideBookmarks" as const },
    { title: "#search-prefixes-title", container: "#search-prefixes-container", configKey: "hideSearchPrefixes" as const },
    { title: "#transparency-title", container: "#transparency-title + .individual-setting", configKey: "hideTransparency" as const },
  ];

  sections.forEach(({ title, container, configKey }) => {
    const titleEl = document.querySelector(title);
    titleEl?.addEventListener("mouseup", () => {
      (config as any)[configKey] = !(config as any)[configKey];
      titleEl.classList.toggle("hidden", (config as any)[configKey]);

      const containers = document.querySelectorAll(container);
      containers.forEach((el) => {
        (el as HTMLElement).style.display = (config as any)[configKey] ? "none" : "";
      });

      saveConfig();
    });
  });

  // Apply saved state on load
  sections.forEach(({ title, container, configKey }) => {
    if ((config as any)[configKey]) {
      const titleEl = document.querySelector(title);
      titleEl?.classList.add("hidden");

      const containers = document.querySelectorAll(container);
      containers.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    }
  });
}

function openSettingsTab() {
  const settings = document.querySelector(".settings");

  if (settings instanceof HTMLElement) {
    settings.classList.toggle("show");
  }
}
