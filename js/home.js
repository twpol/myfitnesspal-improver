(function () {
  /** @type {(node: Node) => number} */
  function getElementNumber(element) {
    return 1 * element.innerText.trim().replace(",", "");
  }

  function applyChanges() {
    const element = document.querySelector(".energy-remaining-number");
    const goalElement = document.querySelector(
      ".energy-calculation .value:last-of-type > .num"
    );

    if (!element || element.innerText.trim() === "") {
      return setTimeout(() => applyChanges(), 100);
    }

    const value = getElementNumber(element);
    const goal = getElementNumber(goalElement);
    const percent = Math.round(100 * Math.abs(value / goal));
    const overUnder = value > 0 ? "Under" : "Over";

    if (value < -0.2 * goal || value > 0.2 * goal) {
      element.style.color = "#F88";
    } else if (value < -0.1 * goal || value > 0.1 * goal) {
      element.style.color = "#FF8";
    } else {
      element.style.color = "#8F8";
    }
    element.setAttribute("title", overUnder + " by " + percent + "%");

    document
      .querySelectorAll(".negative-energy")
      .forEach((element) => element.classList.remove("negative-energy"));
  }

  applyChanges();
})();
