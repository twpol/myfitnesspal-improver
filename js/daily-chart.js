(function () {
  /** @type {(node: Node) => number} */
  function getElementNumber(element) {
    return (
      1 *
      ((element.value || element.innerText).trim() || "0")
        .match(/[0-9.,]+/)[0]
        .replace(",", "")
    );
  }

  /** @type {(tagName: string, properties: {}, style: CSSStyleDeclaration, ...children: Node) => Node} */
  function create(tagName, properties, style, ...children) {
    /** @type {HTMLElement} */
    const tag = document.createElement(tagName);
    for (const name of Object.keys(properties || {})) {
      tag[name] = properties[name];
    }
    for (const name of Object.keys(style || {})) {
      tag.style[name] = style[name];
    }
    tag.append(...(children || []));
    return tag;
  }

  function setUpTargets() {
    document
      .querySelectorAll("#diary-table tr.meal_header > td:nth-child(1)")
      .forEach((meal, index) =>
        meal.append(
          create(
            "input",
            {
              className: `mfpi-target-${index}`,
              oninput: () => {
                saveTargets();
                updateChart();
              },
            },
            {
              marginLeft: "0.5em",
              width: "3em",
            }
          )
        )
      );
  }

  function loadTargets() {
    (localStorage["mfpi-targets"] || "0,0,0,0,0,0")
      .split(",")
      .forEach(
        (target, index) =>
          (document.querySelector(`.mfpi-target-${index}`).value = target)
      );
  }

  function saveTargets() {
    localStorage["mfpi-targets"] = [0, 1, 2, 3, 4, 5]
      .map((index) =>
        getElementNumber(document.querySelector(`.mfpi-target-${index}`))
      )
      .join(",");
  }

  function updateChart() {
    const mealTarget = (localStorage["mfpi-targets"] || "")
      .split(",")
      .map(Number);
    const colours = [
      "#4472C4",
      "#ED7D31",
      "#A5A5A5",
      "#FFC000",
      "#5B9BD5",
      "#70AD47",
      "#4472C4",
    ];

    const mealNames = [
      ...document.querySelectorAll(
        "#diary-table tr.meal_header > td:nth-child(1)"
      ),
    ].map((node) => node.innerText);
    const mealConsumed = [
      ...document.querySelectorAll("#diary-table tr.bottom > td:nth-child(2)"),
    ].map(getElementNumber);
    const dailyGoal = getElementNumber(
      document.querySelector("tr.total.alt > td:nth-child(2)")
    );
    const extra = getElementNumber(
      document.querySelector("#diary-table .extra")
    );
    if (extra > 0) {
      mealNames.push("Exercise");
      mealTarget.push(extra);
      mealConsumed.push(0);
    }

    const target = mealTarget.reduce((c, m) => c + m, 0);
    const consumed = mealConsumed.reduce((c, m) => c + m, 0);
    const scale = 100 / Math.max(target, dailyGoal, consumed);

    /** @type {CSSStyleDeclaration} */
    const cssBarChartElement = {
      display: "inline-block",
      height: "100%",
      overflow: "hidden",
      textAlign: "center",
      whiteSpace: "nowrap",
    };

    for (const old of document.querySelectorAll(".mfpi-container")) {
      old.remove();
    }
    document.getElementById("main").prepend(
      create(
        "div",
        { className: "mfpi-container" },
        {},
        create(
          "div",
          { className: "mfpi-target-label" },
          { height: "1.5em" },
          ...mealNames.map((name, index) =>
            create(
              "span",
              { innerText: name },
              {
                ...cssBarChartElement,
                width: `${mealTarget[index] * scale}%`,
              }
            )
          )
        ),
        create(
          "div",
          { className: "mfpi-target-bar" },
          { height: "1.5em" },
          ...mealNames.map((_, index) =>
            create(
              "span",
              {},
              {
                ...cssBarChartElement,
                width: `${mealTarget[index] * scale}%`,
                background: colours[index],
                opacity: "0.25",
              }
            )
          )
        ),
        create(
          "div",
          { className: "mfpi-consumed-bar" },
          { height: "1.5em" },
          ...mealNames.map((_, index) =>
            create(
              "span",
              {},
              {
                ...cssBarChartElement,
                width: `${mealConsumed[index] * scale}%`,
                background: colours[index],
              }
            )
          )
        ),
        create(
          "div",
          { className: "mfpi-consumed-label" },
          { height: "1.5em" },
          ...mealNames.map((_, index) =>
            create(
              "span",
              { innerText: mealConsumed[index] || "" },
              {
                ...cssBarChartElement,
                width: `${mealConsumed[index] * scale}%`,
              }
            )
          )
        )
      )
    );
  }

  setUpTargets();
  loadTargets();
  updateChart();
})();
