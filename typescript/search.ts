document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById(
    "searchInput",
  ) as HTMLInputElement;
  searchInput.addEventListener("input", () => {
    searchInput.scrollLeft = searchInput.scrollWidth;
  });
  const root = document.documentElement;

  let numberFind = 0;
  let keywordFound = false;

  const settingsBar = document.querySelector(".settings") as HTMLElement;

  const redirectToUrl = (url: string) => {
    window.location.href = url;
  };

  const resetBookmarkStyles = (links: NodeListOf<HTMLElement>) => {
    numberFind = 0;
    keywordFound = false;

    root.style.setProperty("--bookmark-color", "");
    links.forEach((link) => {
      link.classList.remove("on");
      link.classList.remove("found");
      link.style.color = "";

      link.style.position = "";
      link.style.bottom = "";
      link.style.opacity = "";
    });
  };

  const analyzeSearchInput = (searchValue: string) => {
    if (!searchValue) {
      return {
        type: "default",
        query: "",
      };
    }

    const prefixMatch = searchValue.match(/^-(\w+):\s*(.+)$/);

    if (prefixMatch) {
      const [_, prefix, query] = prefixMatch;
      return {
        type: prefix.toLowerCase(),
        query: query
          .trim()
          .split(getSearchSplit())
          .map((q) => q.trim()),
      };
    }

    return {
      type: "default",
      query: searchValue.trim(),
    };
  };

  const getSearchSplit = () => {
    const split = localStorage.getItem("prefixSplit");
    return split ? JSON.parse(split) : "|";
  };

  const getSearchPrefixes = () => {
    const storedPrefixes = localStorage.getItem("searchPrefixes");
    return storedPrefixes ? JSON.parse(storedPrefixes) : "";
  };

  document.addEventListener("keydown", async function (event) {
    if (settingsBar.classList.contains("show")) {
      return;
    }

    const links = document.querySelectorAll(
      ".bookmark",
    ) as NodeListOf<HTMLAnchorElement>;
    if (event.altKey) {
      return;
    }

    //  handle special keys
    const isSpecialKey =
      event.key === "Enter" ||
      event.key === "+" ||
      event.key === "Backspace" ||
      event.ctrlKey;

    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(event.key);
    if (!isSpecialKey && !isAlphanumeric) {
      return;
    }

    event.preventDefault();

    // handle searching
    if (event.key === "Enter") {
      const searchAnalysis = analyzeSearchInput(searchInput.value);
      const prefixes = getSearchPrefixes();

      // if search has keyword
      if (searchAnalysis.type !== "default") {
        const prefixUrl = prefixes[searchAnalysis.type];
        if (prefixUrl) {
          let query = 0;

          const findAndReplace = () => {
            const response = encodeURIComponent(searchAnalysis.query[query]);
            query++;

            return response;
          };

          const finalUrl = prefixUrl.replaceAll("{query}", findAndReplace);
          redirectToUrl(finalUrl);
        }
        return;
      } else {
        // if search does not have keyword
        if (event.ctrlKey) {
          redirectToUrl(
            `https://www.google.com/search?q=${encodeURIComponent(
              searchInput.value,
            )}`,
          );
          return;
        }

        // if "flip" or "stopwatch" then start respective functions (global scoped)
        if (searchInput.value.toLowerCase() == "flip") {
          searchInput.value = "";
          resetBookmarkStyles(links);
          startCoinSequence();
          return;
        }

        if (searchInput.value.toLowerCase() == "stopwatch") {
          searchInput.value = "";
          resetBookmarkStyles(links);
          startStopwatch();
          return;
        }
        let found = false;

        if (keywordFound) {
          let link = document.querySelector(".found") as HTMLAnchorElement;

          if (link) {
            found = true;

            searchInput.style.animation = "right 0.1s 1 forwards";
            redirectToUrl(link.href);
            return;
          }
        }

        links.forEach((link) => {
          const keywords = link.getAttribute("data-keywords");
          if (
            keywords &&
            keywords
              .toLowerCase()
              .split(" ")
              .includes(searchInput.value.toLowerCase())
          ) {
            found = true;
            searchInput.style.animation = "right 0.1s 1 forwards";
            redirectToUrl(link.href);

            return;
          }

          const linkText = link.textContent?.toLowerCase();
          if (
            (linkText && linkText === searchInput.value.toLowerCase()) ||
            (link.classList.contains("on") && numberFind === 1)
          ) {
            found = true;
            searchInput.style.animation = "right 0.1s 1 forwards";
            redirectToUrl(link.href);
            return;
          }
        });

        // if bookmark not found, wrong animation
        if (!found) {
          searchInput.style.animation = "wrong 1s 1";
        }
        setTimeout(() => (searchInput.style.animation = ""), 1000);
        return;
      }
    }

    keywordFound = false;

    // Handle Ctrl + A (select all)
    if (event.ctrlKey) {
      event.preventDefault();
    }
    if (event.key === "a" && event.ctrlKey) {
      searchInput.value = "";
      keywordFound = false;

      resetBookmarkStyles(links);

      return;
    }

    if (event.key === "Backspace") {
      searchInput.value = searchInput.value.slice(0, -1);

      requestAnimationFrame(() => {
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
        searchInput.scrollLeft = searchInput.scrollWidth;
      });

      numberFind = 0;
    } else if (!event.ctrlKey) {
      searchInput.value += event.key;

      requestAnimationFrame(() => {
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
        searchInput.scrollLeft = searchInput.scrollWidth;
      });
    }

    if (document.activeElement !== searchInput) {
      searchInput.focus();
    }

    if (searchInput.value.length === 0) {
      resetBookmarkStyles(links);
    }

    numberFind = 0;
    (document.querySelectorAll(".on") as NodeListOf<HTMLElement>).forEach(
      (elem) => (elem.style.color = ""),
    );

    if (searchInput.value.length > 0) {
      root.style.setProperty("--bookmark-color", "gray");

      links.forEach((link) => {
        if (
          link.textContent &&
          link.textContent
            .toLowerCase()
            .includes(searchInput.value.toLowerCase())
        ) {
          link.classList.add("on");

          link.style.position = "";
          link.style.bottom = "";
          link.style.opacity = "";

          numberFind++;
        } else {
          link.classList.remove("on");
          link.style.opacity = "0.5";
        }

        const keywords = link.getAttribute("data-keywords");
        if (
          keywords &&
          keywords
            .toLowerCase()
            .split(" ")
            .includes(searchInput.value.toLowerCase())
        ) {
          link.style.opacity = "";

          link.style.color = "var(--hover-color)";
          keywordFound = true;
          link.classList.add("found");
        } else {
          link.style.color = "";
          link.classList.remove("found");
        }
      });
    }

    if (!keywordFound && numberFind !== 1 && document.querySelector(".on")) {
      let element = document.querySelector(".on") as HTMLElement;
      element.style.color = "";
    } else if (numberFind == 1 && !keywordFound) {
      let element = document.querySelector(".on") as HTMLElement;
      element.classList.add("found");

      element.style.color = "var(--hover-color)";
    }
  });
});
