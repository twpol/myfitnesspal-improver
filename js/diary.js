(function () {

	function getElementValue(element) {
		return 1 * element.innerText.replace(',', '');
	}

	var rowGoal = document.querySelector('tr.total.alt');
	var goals = [];
	rowGoal.querySelectorAll('td:not(.first):not(.empty)').forEach(function (goal) {
		goals.push(getElementValue(goal));
	});

	var rowRemaining = document.querySelector('tr.total.remaining');
	var remainings = rowRemaining.querySelectorAll('td:not(.first):not(.empty)');
	for (let index = 0; index < remainings.length; index++) {
		var element = remainings[index];
		element.classList.remove('positive', 'negative');

		var value = getElementValue(element);
		var pcent = Math.round(100 * Math.abs(value / goals[index]));
		var overUnder = value > 0 ? 'Under' : 'Over';

		if (value < -0.2 * goals[index] || value > 0.2 * goals[index]) {
			element.style.background = '#F88';
		} else if (value < -0.1 * goals[index] || value > 0.1 * goals[index]) {
			element.style.background = '#FF8';
		} else {
			element.style.background = '#8F8';
		}
		element.setAttribute('title', overUnder + ' by ' + pcent + '%');
	}

})();
