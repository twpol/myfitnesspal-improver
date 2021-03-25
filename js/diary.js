(function () {
  /** @type {(node: Node) => number} */
  function getElementNumber(element) {
    return 1 * element.innerText.trim().replace(",", "");
  }

  const rowGoal = document.querySelector("tr.total.alt");
  const goals = [];
  rowGoal
    .querySelectorAll("td:not(.first):not(.empty)")
    .forEach(function (goal) {
      goals.push(getElementNumber(goal));
    });

  const rowRemaining = document.querySelector("tr.total.remaining");
  const remaining = rowRemaining.querySelectorAll("td:not(.first):not(.empty)");
  for (let index = 0; index < remaining.length; index++) {
    const element = remaining[index];
    element.classList.remove("positive", "negative");

    const value = getElementNumber(element);
    const percent = Math.round(100 * Math.abs(value / goals[index]));
    const overUnder = value > 0 ? "Under" : "Over";

    if (value < -0.2 * goals[index] || value > 0.2 * goals[index]) {
      element.style.background = "#F88";
    } else if (value < -0.1 * goals[index] || value > 0.1 * goals[index]) {
      element.style.background = "#FF8";
    } else {
      element.style.background = "#8F8";
    }
    element.setAttribute("title", overUnder + " by " + percent + "%");
  }
})();
