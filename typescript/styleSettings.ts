interface LayoutStyle {
  name: string;
  cssClass: string;
  isActive: boolean;
  description: string;
}

const definedStyles: LayoutStyle[] = [
  {
    name: "Default",
    cssClass: "style-default",
    isActive: true,
    description: "Original layout",
  },
  {
    name: "Alternate",
    cssClass: "style-alternate",
    isActive: false,
    description: "Alternate layout",
  },
];

let layoutStyles: LayoutStyle[] = loadStyleSettings();

function loadStyleSettings(): LayoutStyle[] {
  const stored = localStorage.getItem("layoutStyles");
  if (!stored) {
    saveStyleSettings(definedStyles);
    return definedStyles;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<LayoutStyle>[];

    return definedStyles.map((style) => {
      const storedStyle = parsed.find((s) => s.name === style.name);
      if (storedStyle) {
        return {
          ...style,
          isActive: storedStyle.isActive ?? style.isActive,
        };
      }
      return style;
    });
  } catch {
    return definedStyles;
  }
}

function saveStyleSettings(styles: LayoutStyle[]): void {
  const toSave = styles.map(({ name, isActive }) => ({ name, isActive }));
  localStorage.setItem("layoutStyles", JSON.stringify(toSave));
}

function initializeStyleSettings(): void {
  applyActiveStyle();
  displayStyleSettings();
}

function applyActiveStyle(): void {
  const html = document.documentElement;
  layoutStyles.forEach((s) => html.classList.remove(s.cssClass));

  const active = layoutStyles.find((s) => s.isActive);
  if (active) {
    html.classList.add(active.cssClass);
  }
}

function displayStyleSettings(): void {
  const container = document.getElementById("style-settings-container");
  if (!container) return;
  container.innerHTML = "";

  layoutStyles.forEach((style, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("individual-setting");

    const label = document.createElement("label");
    label.classList.add("setting-checkbox");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "layout-style";
    radio.checked = style.isActive;
    radio.addEventListener("change", () => {
      if (radio.checked) {
        layoutStyles.forEach((s) => (s.isActive = false));
        layoutStyles[index].isActive = true;
        saveStyleSettings(layoutStyles);
        applyActiveStyle();
        displayStyleSettings();
      }
    });

    const nameSpan = document.createElement("span");
    nameSpan.textContent = style.name;

    label.appendChild(radio);
    label.appendChild(nameSpan);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}
