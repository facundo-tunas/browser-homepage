interface Field {
  [key: string]:
    | string
    | [string, string]
    | [boolean, "checkbox"]
    | [string, "color"];
}

function createForm(
  fields: Field,
  onSubmit:
    | ((formData: { [key: string]: string | boolean }) => void)
    | [string, (formData: { [key: string]: string | boolean }) => void],
  onSecondary?: ((() => void) | [string, () => void]) | null
): void {
  const form = document.createElement("form");
  form.classList.add("dynamic-form");

  const backdrop = document.createElement("div");
  backdrop.classList.add("form-backdrop");

  const removeForm = () => {
    form.remove();
    backdrop.remove();
  };

  backdrop.addEventListener("click", removeForm);

  const getCSSVariable = (name: string) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  };

  for (const [key, value] of Object.entries(fields)) {
    const container = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = key;

    if (Array.isArray(value) && value[1] === "color") {
      // Check if it's a hex color (starts with #)
      if (typeof value[0] === "string" && value[0].startsWith("#")) {
        // Use native color picker for hex colors
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = value[0];
        colorInput.name = key;

        container.appendChild(label);
        container.appendChild(colorInput);
      } else {
        // Use custom select for CSS variable colors
        const colorVars = [
          { value: "--red", text: "Red", color: getCSSVariable("--red") },
          { value: "--blue", text: "Blue", color: getCSSVariable("--blue") },
          { value: "--yellow", text: "Yellow", color: getCSSVariable("--yellow") },
          { value: "--salmon", text: "Salmon", color: getCSSVariable("--salmon") },
          { value: "--green", text: "Green", color: getCSSVariable("--green") },
          { value: "--purple", text: "Purple", color: getCSSVariable("--purple") },
          { value: "--orange", text: "Orange", color: getCSSVariable("--orange") },
          { value: "--pink", text: "Pink", color: getCSSVariable("--pink") },
          { value: "--cyan", text: "Cyan", color: getCSSVariable("--cyan") },
          { value: "--teal", text: "Teal", color: getCSSVariable("--teal") },
        ];

        const defaultValue = value[0];

        const colorSelect = createCustomSelect(key, colorVars, defaultValue, key);
        container.appendChild(colorSelect);
      }
    } else {
      const input = document.createElement("input");

      if (Array.isArray(value)) {
        input.type = value[1];
        input.value = value[0].toString();
      } else {
        input.type = "text";
        input.value = value as string;
      }

      input.name = key;
      container.appendChild(label);
      container.appendChild(input);
    }

    form.appendChild(container);
  }

  const buttonContainer = document.createElement("div");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("cancel-button");
  cancelButton.textContent = "Cancel";
  cancelButton.type = "button";
  cancelButton.addEventListener("click", removeForm);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = Array.isArray(onSubmit)
    ? onSubmit[0]
    : "Save Changes";

  if (onSecondary) {
    const secondaryButton = document.createElement("button");
    secondaryButton.classList.add("secondary-button");
    secondaryButton.type = "button";

    if (Array.isArray(onSecondary)) {
      secondaryButton.textContent = onSecondary[0];
      secondaryButton.addEventListener("click", () => {
        onSecondary[1]();
        removeForm();
      });
    } else {
      secondaryButton.textContent = "Secondary";
      secondaryButton.addEventListener("click", () => {
        onSecondary();
        removeForm();
      });
    }

    buttonContainer.appendChild(secondaryButton);
  }

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(submitButton);
  form.appendChild(buttonContainer);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData: { [key: string]: string | boolean } = {};

    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value) && value[1] === "color") {
        const colorInput = form.querySelector(
          `input[name="${key}"][type="color"]`
        ) as HTMLInputElement;
        
        if (colorInput) {
          // Direct hex color input
          formData[key] = colorInput.value;
        } else {
          // Custom select for CSS variables
          const hiddenInput = form.querySelector(
            `input[name="${key}"]`
          ) as HTMLInputElement;
          formData[key] = `var(${hiddenInput.value})`;
        }
      } else {
        const input = form.querySelector(
          `input[name="${key}"]`
        ) as HTMLInputElement;
        if (input && input.type === "checkbox") {
          formData[key] = input.checked;
        } else {
          formData[key] = input.value;
        }
      }
    }

    if (Array.isArray(onSubmit)) {
      onSubmit[1](formData);
    } else {
      onSubmit(formData);
    }

    removeForm();
  });

  document.body.appendChild(backdrop);
  document.body.appendChild(form);
}

function createCustomSelect(
  name: string,
  options: { value: string; color?: string; text?: string }[],
  defaultValue: string,
  labelText: string
): HTMLDivElement {
  const container = document.createElement("div");
  container.classList.add("custom-select-container");

  const label = document.createElement("label");
  label.textContent = labelText;
  container.appendChild(label);

  const selectWrapper = document.createElement("div");
  selectWrapper.classList.add("custom-select-wrapper");

  const selectTrigger = document.createElement("div");
  selectTrigger.classList.add("custom-select-trigger");
  selectTrigger.tabIndex = 0;

  const defaultOption =
    options.find((opt) => opt.value === defaultValue) || options[0];
  if (defaultOption.color) {
    selectTrigger.style.backgroundColor = defaultOption.color;
  }

  const optionsList = document.createElement("div");
  optionsList.classList.add("custom-options");

  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("custom-option");
    optionElement.dataset.value = option.value;
    optionElement.title = option.text ?? option.value;

    if (option.color) {
      optionElement.style.backgroundColor = option.color;
    }

    optionElement.addEventListener("click", () => {
      if (option.color) {
        selectTrigger.style.backgroundColor = option.color;
      } else {
        selectTrigger.style.backgroundColor = "";
      }
      optionsList.classList.remove("open");

      const hiddenInput = container.querySelector("input") as HTMLInputElement;
      hiddenInput.value = option.value;
    });

    optionsList.appendChild(optionElement);
  });

  selectTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    optionsList.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    optionsList.classList.remove("open");
  });

  selectTrigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      optionsList.classList.toggle("open");
    } else if (e.key === "Escape") {
      optionsList.classList.remove("open");
    }
  });

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = name;
  hiddenInput.value = defaultValue;

  selectWrapper.appendChild(selectTrigger);
  selectWrapper.appendChild(optionsList);
  container.appendChild(selectWrapper);
  container.appendChild(hiddenInput);

  return container;
}
