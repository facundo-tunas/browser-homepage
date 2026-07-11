function getTime() {
  const date = new Date();
  const min: number = date.getMinutes();
  const sec: number = date.getSeconds();
  const hour: number = date.getHours();

  return (
    "" +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (min < 10 ? "0" + min : min) +
    ":" +
    (sec < 10 ? "0" + sec : sec)
  );
}

function getDayName(): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNumber = date.getDate();
  return `${dayName}, ${monthName} ${getOrdinalSuffix(dayNumber)}`;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function updateClockDisplay(clockElement: HTMLElement) {
    clockElement.setAttribute("data-day", "");
}
