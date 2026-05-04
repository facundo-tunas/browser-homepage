// this is all globally scoped because of some issues with bundling and stuff

let intervalStopwatch: number | undefined;

function startStopwatch(): void {
  const existingStopwatch = document.getElementById("stopwatch");
  if (existingStopwatch) {
    endStopwatch(existingStopwatch);
  }

  const timeStuffContainer = document.querySelector(".time-stuff-container");
  const newTimerElement = document.createElement("div");
  newTimerElement.id = "stopwatch";
  newTimerElement.classList.add("container-card");

  newTimerElement.setAttribute("tabindex", "0");

  const timerText = document.createElement("p");
  newTimerElement.appendChild(timerText);

  if (timeStuffContainer) {
    timeStuffContainer.appendChild(newTimerElement);

    newTimerElement.addEventListener("click", () => {
      endStopwatch(newTimerElement);
      localStorage.removeItem("storedStopwatch");
    });

    newTimerElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        endStopwatch(newTimerElement);
      }
    });

    const storedStopwatch = localStorage.getItem("storedStopwatch");
    const startTime = storedStopwatch
      ? Number(JSON.parse(storedStopwatch))
      : Date.now();

    localStorage.setItem("storedStopwatch", JSON.stringify(startTime));

    if (intervalStopwatch) {
      clearInterval(intervalStopwatch);
    }

    intervalStopwatch = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
      const hours = Math.floor(elapsedTime / 1000 / 60 / 60);

      let displayText = "";
      if (hours > 0) displayText += `${hours}h `;
      if (minutes > 0) displayText += `${minutes}m `;
      displayText += `${seconds}s`;

      timerText.innerHTML = displayText;
    }, 1000);
  }
}

function endStopwatch(elem: HTMLElement): void {
  if (intervalStopwatch) {
    clearInterval(intervalStopwatch);
    intervalStopwatch = undefined;
  }

  localStorage.removeItem("storedStopwatch");

  elem.style.animation = "fadeOut 0.5s linear";
  setTimeout(() => {
    elem.remove();
  }, 500);
}
