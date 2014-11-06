d3.tsv('data/sales.tsv', function (err, data) {

var papers = data.map(function (paper) {
	var copies = [], maxCopies = 0;
	for (key in paper) {
		if (key !== 'name' && paper.hasOwnProperty(key)) {
			if (paper[key] === '') continue;
			copies.push([+key, +paper[key]]);
			if (+paper[key] > maxCopies) maxCopies = +paper[key];
		}
	}
	return { title: paper.name, copies: copies, maxCopies: maxCopies };
});
var papersRel = papers.map(function (paper) {
	var copies = paper.copies.map(function (point) {
		return [point[0], point[1]/paper.maxCopies];
	});
	return { title: paper.title, copies: copies, maxCopies: paper.maxCopies };
})


$('form').submit(function (ev) {
	ev.preventDefault();
	var paperRegex = new RegExp($('#tf-paper').val(), 'i');
	var paper = papersRel.filter(function (p) { return p.title.match(paperRegex); })[0];
	chart.draw(paper);
});
});
