chart = (function () {

var data;

var width = 800, height = 600, margin = 30;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAccessor = function (d) { return x(d.quarter); };
var yAccessor = function (d) { return y(d.relative); };

x.domain([ 9, 100 ]);
y.domain([ 0, 1 ]);

var xAxis = d3.svg.axis().scale(x).orient('bottom');
var yAxis = d3.svg.axis().scale(y).orient('left');

var line = d3.svg.line().x(xAccessor).y(yAccessor);
function exponentialLine (reg) {
		return (d3.svg.line()
		.x(function (x0) { return x(x0); })
		.y(function (x0) { return y(reg.first.relative * Math.exp(reg.lambda*x0)); })
		([0,10,20,30,40,50,60,70,80,90,100])
	);
}

var viewBox = [ 0, 0, width + 2*margin, height + 2*margin ];
var svg = d3.select('svg')
.attr('width', viewBox[2]).attr('height', viewBox[3])
.attr('viewBox', viewBox.join(' '));

svg = svg.append('g').attr('transform', 'translate('+margin+','+margin+')');

svg.append('g').attr('class', 'x axis').call(xAxis).attr('transform', 'translate(0,'+height+')');
svg.append('g').attr('class', 'y axis').call(yAxis);

var publicationLine, regressionLine;
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

	return true;
}

function update () {
	$('.data-sheet').removeClass('hidden').toggleClass('toggle-animation');
	$('.data-sheet h2').text(data.title);
	$('.js-publication-halflife').text(Math.round(data.regression.halfLife) + ' Jahre');

	publicationLine.datum(data).transition().attr('d', function (d) { return line(d.copies); });
	regressionLine.transition().attr('d', exponentialLine(data.regression));
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
