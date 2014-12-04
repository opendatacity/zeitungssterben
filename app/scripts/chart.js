Z.chart = (function () {

var data;

var width = 800, height = 600, margin = 50;

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
var svg = d3.select('#main-chart')
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
	// .attr('filter', 'url(#svg-filter-glow)');

	svg.append('path')
	.attr('class', 'line data foreground');

	publicationLine = svg.selectAll('.data');

	svg.append('path')
	.attr('class', 'line prediction background')
	// .attr('filter', 'url(#svg-filter-glow)');

	svg.append('path')
	.attr('class', 'line prediction foreground');

	regressionLine = svg.selectAll('.prediction');

	svg.append('text')
	.attr('class', 'data-label max')
	.attr('text-anchor', 'start')
	.attr('dy', -10);

	svg.append('circle')
	.attr('r', 8)
	.attr('class', 'data-label max');

	svg.append('text')
	.attr('class', 'data-label min')
	.attr('text-anchor', 'end')
	.attr('dy', 30);

	svg.append('circle')
	.attr('r', 8)
	.attr('class', 'data-label min');

	maxLabel = svg.selectAll('.data-label.max');
	minLabel = svg.selectAll('.data-label.min');

	return true;
}

function update () {
	var duration = window.photogenic? 0 : 200;

	var halfLife = (data.regression.halfLife === Infinity)? 'keine' : (Math.round(data.regression.halfLife) + ' Jahre');

	$('.data-sheet').removeClass('hidden').toggleClass('toggle-animation');
	$('.js-publication-title').text(data.title);
	$('.js-publication-halflife').text(halfLife);	

	publicationLine.datum(data).transition().duration(duration)
	.attr('d', function (d) { return line(d.copies); });
	regressionLine.transition().duration(duration)
	.attr('d', exponentialLine(data.regression))
	.style('opacity', function (d) { return +(data.regression.halfLife !== Infinity); });
	
	maxLabel.datum(data)
	.transition().duration(duration)
	.attr('cx', function (d) { return xAccessor(d.max); })
	.attr( 'x', function (d) { return xAccessor(d.max); })
	.attr('cy', function (d) { return yAccessor(d.max); })
	.attr( 'y', function (d) { return yAccessor(d.max); })
	.text(function (d) { return numberFormat(d.max.absolute); });

	minLabel.datum(data)
	.transition().duration(duration)
	.attr('cx', function (d) { return xAccessor(d.min); })
	.attr( 'x', function (d) { return xAccessor(d.min); })
	.attr('cy', function (d) { return yAccessor(d.min); })
	.attr( 'y', function (d) { return yAccessor(d.min); })
	.text(function (d) { return numberFormat(d.min.absolute); });
}

function draw (newData) {
	data = newData;
	init();
	update();
}

return {
	draw: draw
}

})();
