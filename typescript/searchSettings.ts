function initializeSearchSettings() {
  displaySearchPrefixes();
}

function displaySearchPrefixes() {
  const prefixesContainer = document.getElementById(
    "search-prefixes-container",
  ) as HTMLElement;
  prefixesContainer.innerHTML = "";

  const storedPrefixes = localStorage.getItem("searchPrefixes");
  const prefixes: { [key: string]: string } = storedPrefixes
    ? JSON.parse(storedPrefixes)
    : {};

  const storedSplit = localStorage.getItem("prefixSplit");
  const split: string = storedSplit ? JSON.parse(storedSplit) : "|";

  const optionsContainer = document.createElement("div");
  optionsContainer.classList.add("prefix-options");

  const splitContainer = document.createElement("div");
  splitContainer.classList.add("split-container");

  const splitTitle = document.createElement("p");
  splitTitle.classList.add("split-label");
  splitTitle.textContent = "Split Character:";

  const splitButton = document.createElement("input");
  splitButton.value = split;
  splitButton.classList.add("split-input");
  splitButton.addEventListener("input", () => {
    const value = splitButton.value.trim();
    splitButton.value = value;
    localStorage.setItem("prefixSplit", JSON.stringify(value || "|"));
  });

  const addButton = document.createElement("button");
  addButton.textContent = "Add Prefix";
  addButton.classList.add("add-prefix");
  addButton.addEventListener("click", addSearchPrefix);

  splitContainer.appendChild(splitTitle);
  splitContainer.appendChild(splitButton);

  optionsContainer.appendChild(addButton);
  optionsContainer.appendChild(splitContainer);

  prefixesContainer.appendChild(optionsContainer);

  Object.entries(prefixes).forEach(([prefix, url]) => {
    const prefixDisplay = document.createElement("div");
    prefixDisplay.classList.add("prefix-display");
    prefixDisplay.classList.add("individual-setting");

    const prefixText = document.createElement("div");
    prefixText.classList.add("prefix-text");
    prefixText.innerHTML = `<strong>-${prefix}:</strong>`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("prefix-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-prefix");
    editButton.addEventListener("click", () => editSearchPrefix(prefix, url));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-prefix");
    deleteButton.addEventListener("click", () => deleteSearchPrefix(prefix));

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    prefixDisplay.appendChild(prefixText);
    prefixDisplay.appendChild(buttonContainer);
    prefixesContainer.appendChild(prefixDisplay);
  });
}

function addSearchPrefix() {
  const fields: Field = {
    Prefix: "",
    "URL Template {query}": ["", "url", "https://example.com/search?q={query}&f={query}"],
  };

  createForm(fields, (formData: { [key: string]: string | boolean }) => {
    // Correct type here
    const prefix = (formData["Prefix"] as string).toLowerCase().trim();
    const url = (formData["URL Template {query}"] as string).trim();

    if (prefix && url) {
      const prefixes: { [key: string]: string } = JSON.parse(
        localStorage.getItem("searchPrefixes") || "{}",
      );
      prefixes[prefix] = url;
      localStorage.setItem("searchPrefixes", JSON.stringify(prefixes));
      displaySearchPrefixes();
    }
  });
}

function editSearchPrefix(prefix: string, currentUrl: string) {
  const fields: Field = {
    Prefix: prefix,
    "URL Template {query}": [currentUrl, "url"],
  };

  createForm(fields, (formData: { [key: string]: string | boolean }) => {
    const newPrefix = (formData["Prefix"] as string).toLowerCase().trim();
    const newUrl = (formData["URL Template {query}"] as string).trim();

    if (newPrefix && newUrl) {
      const prefixes: { [key: string]: string } = JSON.parse(
        localStorage.getItem("searchPrefixes") || "{}",
      );
      if (newPrefix !== prefix) {
        delete prefixes[prefix];
      }
      prefixes[newPrefix] = newUrl;
      localStorage.setItem("searchPrefixes", JSON.stringify(prefixes));
      displaySearchPrefixes();
    }
  });
}

function deleteSearchPrefix(prefix: string) {
  const prefixes: { [key: string]: string } = JSON.parse(
    localStorage.getItem("searchPrefixes") || "{}",
  );
  delete prefixes[prefix];
  localStorage.setItem("searchPrefixes", JSON.stringify(prefixes));
  displaySearchPrefixes();
}
