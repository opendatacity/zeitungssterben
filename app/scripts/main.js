(function () {

d3.tsv('data/data.tsv', function (err, data) {

var LOG2 = Math.log(2);
var samplesPerYear = 4;
var startQuarter = 0;
var startTime = +(new Date(2001,0,1));
function quarterToDate (quarter) {
	var date = new Date(startTime);
	date.setMonth((quarter - startQuarter) * (12/samplesPerYear));
	return date;
}

function Point (quarter, value) {
	this.quarter = +quarter;
	this.date = quarterToDate(+quarter);
	this.absolute = +value;
}
Point.prototype.quarterString = function () {
	var q = 1 + (this.quarter - startQuarter) % 4;
	var y = this.date.getFullYear();
	return q + '. Quartal ' + y;
};
function Regression (publication, max) {
	this.first = { absolute: +publication.N0 };
	if (max) this.first.relative = this.first.absolute / max.absolute;
	this.lambda = +publication.lambda;
	this.halfLife = -LOG2/publication.lambda/samplesPerYear;
	if (this.halfLife < 0) this.halfLife = Infinity;
}

var publications = data.map(function (publication) {
	var copies = [], max, min;
	for (column in publication) {
		if (!publication.hasOwnProperty(column)) continue;
		var value = publication[column];
		if ((''+column).match(/^[0-9]+$/) && value !== '') {
			var point = new Point(column, value);
			copies.push(point);
			if (!max || max.absolute < point.absolute) max = point;
			if (!min || min.absolute > point.absolute) min = point;
		}
	}
	copies.forEach(function (point) {
		point.relative = point.absolute/max.absolute;
	});
	return {
		title: publication.title,
		alias: publication.alias,
		copies: copies,
		max: max,
		min: min,
		oldest: copies[0],
		newest: copies[copies.length - 1],
		regression: new Regression(publication, max)
	};
});

publications.sort(function (a, b) {
	return b.max.absolute - a.max.absolute;
});

$(function() {
	Z.publications = publications;
	Z.autocomplete.init(publications);
	$(Z).trigger('Z:ready', [publications]);
});

});

$(Z).on('Z:publicationchange', function (ev, publication) {
	Z.chart.draw(publication);
	Z.colorchange(publication);
});

})();
