chart = (function () {

var data;

var width = 800, height = 600, margin = 30;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAccessor = function (d) { return x(d.date); };
var yAccessor = function (d) { return y(d.relative); };

x.domain([ new Date(2001,0,1), new Date(2040,0,1) ]);
y.domain([ 0, 1 ]);

var xAxis = d3.svg.axis().scale(x).orient('bottom');
var yAxis = d3.svg.axis().scale(y).orient('left');

var yearlySamples = [];
for (
	var date=x.domain()[0], last=x.domain()[1], quarter=5;
	date<=last;
	date.setFullYear(date.getFullYear()+1)
) {
	yearlySamples.push([new Date(+date), quarter+=4]);
}

var line = d3.svg.line().x(xAccessor).y(yAccessor);
function exponentialLine (reg) {
		return (d3.svg.line()
		.x(function (x0) { return x(x0[0]); })
		.y(function (x0) { return y(reg.first.relative * Math.exp(reg.lambda*x0[1])); })
		(yearlySamples)
	);
}

function numberFormat (n) {
	// <3 http://stackoverflow.com/questions/2901102/
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

var viewBox = [ 0, 0, width + 2*margin, height + 2*margin ];
var svg = d3.select('svg')
.attr('width', viewBox[2]).attr('height', viewBox[3])
.attr('viewBox', viewBox.join(' '));

svg = svg.append('g').attr('transform', 'translate('+margin+','+margin+')');

svg.append('g').attr('class', 'x axis').call(xAxis).attr('transform', 'translate(0,'+height+')');
svg.append('g').attr('class', 'y axis').call(yAxis);

var publicationLine, regressionLine, maxLabel, minLabel;
var isInitialized = false;
function init () {
	if (isInitialized) return false;
	isInitialized = true;

	svg.append('path')
	.attr('class', 'line data background')
	.attr('filter', 'url(#svg-filter-glow)');

	svg.append('path')
	.attr('class', 'line data foreground');

	publicationLine = svg.selectAll('.data');

	svg.append('path')
	.attr('class', 'line prediction background')
	.attr('filter', 'url(#svg-filter-glow)');

	svg.append('path')
	.attr('class', 'line prediction foreground');

	regressionLine = svg.selectAll('.prediction');

	svg.append('text')
	.attr('class', 'data-label max')
	.attr('text-anchor', 'middle')
	.attr('dy', -10);

	svg.append('circle')
	.attr('r', 8)
	.attr('class', 'data-label max');

	svg.append('text')
	.attr('class', 'data-label min')
	.attr('text-anchor', 'middle')
	.attr('dy', 30);

	svg.append('circle')
	.attr('r', 8)
	.attr('class', 'data-label min');

	maxLabel = svg.selectAll('.data-label.max');
	minLabel = svg.selectAll('.data-label.min');

	return true;
}

function update () {
	$('.data-sheet').removeClass('hidden').toggleClass('toggle-animation');
	$('.data-sheet h2').text(data.title);
	$('.js-publication-halflife').text(Math.round(data.regression.halfLife) + ' Jahre');

	publicationLine.datum(data).transition().attr('d', function (d) { return line(d.copies); });
	regressionLine.transition().attr('d', exponentialLine(data.regression));
	
	maxLabel.datum(data).transition()
	.attr('cx', function (d) { return xAccessor(d.max); })
	.attr( 'x', function (d) { return xAccessor(d.max); })
	.attr('cy', function (d) { return yAccessor(d.max); })
	.attr( 'y', function (d) { return yAccessor(d.max); })
	.text(function (d) { return numberFormat(d.max.absolute); });

	minLabel.datum(data).transition()
	.attr('cx', function (d) { return xAccessor(d.min); })
	.attr( 'x', function (d) { return xAccessor(d.min); })
	.attr('cy', function (d) { return yAccessor(d.min); })
	.attr( 'y', function (d) { return yAccessor(d.min); })
	.text(function (d) { return numberFormat(d.min.absolute); });
}

function draw (newData) {
	data = newData;
	console.log(data);
	init();
	update();
}

return {
	draw: draw
}

})();
