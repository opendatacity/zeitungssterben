d3.tsv('data/sales.tsv', function (err, data) {

var LOG2 = Math.log(2);

var papers = data.map(function (paper) {
	var copies = [], maxCopies = 0;
	for (key in paper) {
		if (key !== 'name' && paper.hasOwnProperty(key)) {
			if (paper[key] === '') continue;
			copies.push([+key, +paper[key]]);
			if (+paper[key] > maxCopies) maxCopies = +paper[key];
		}
	}
	var reg = regression('exponential', copies).equation;
	return { title: paper.name,
		copies: copies,
		maxCopies: maxCopies,
		regression: reg,
		halfLife: -LOG2/reg[1]/4
	};
});

papers.sort(function (a, b) {
	return b.maxCopies - a.maxCopies;
});

var papersRel = papers.map(function (paper) {
	var copies = paper.copies.map(function (point) {
		return [point[0], point[1]/paper.maxCopies];
	});
	var reg = regression('exponential', copies).equation;
	return {
		title: paper.title,
		copies: copies,
		maxCopies: paper.maxCopies,
		regression: reg,
		halfLife: paper.halfLife
	};
});

$(function() { papersRel.forEach(list.add); });

$('form').submit(function (ev) {
	ev.preventDefault();
	var paperRegex = new RegExp($('#tf-paper').val(), 'i');
	var paper = papersRel.filter(function (p) { return p.title.match(paperRegex); })[0];
	chart.draw(paper);
});
});
