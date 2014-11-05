d3.tsv('/data/data.tsv', function (error, data) {

var maxCopies = 0, minQuarter = Infinity, maxQuarter = 0;

var colors = {
	"BILD DEUTSCHLAND": '#f00',
	"WAZ-Mediengruppe": '#0f0',
	"Frankfurter Allgemeine + Frankfurter Allgemeine": '#ff0',
	"DIE WELT Gesamt (DIE WELT + WELT Kompakt) /": '#00f'
};
function newspaperColor (paper) {
	// if (colors.hasOwnProperty(paper.name)) return colors[paper.name];
	return '#000';
}

data = data.map(function (d) {
	var copies = [];
	for (key in d) {
		if (d.hasOwnProperty(key) && key !== 'name') {
			var c = +d[key], q = +key;
			if (c > maxCopies) maxCopies = c;
			if (q > maxQuarter) maxQuarter = q;
			if (q < minQuarter) minQuarter = q;
			if (d[key] !== '') copies.push({ quarter: q, copies: c });
		}
	}
	var maxCopies = d3.max(copies, function (q) { return q.copies; });
	copies.forEach(function (c) { c.copiesRel = c.copies/maxCopies; });
	// copies.forEach(function (c) { c.copiesRel = c.copies/copies[0].copies; });
	return {
		name: d.name,
		copies: copies,
		maxCopies: maxCopies
	}
});
console.log(data);

var totalMaxCopies = d3.max(data, function (d) { return d.maxCopies });

var width = 800, height = 600, margin = 30;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var yAccessors = {
	relative: function (d) { return y(d.copiesRel); },
	absolute: function (d) { return y(d.copies); }
}

var xAccessor = function (d) { return x(d.quarter); };
var yAccessor = yAccessors['relative'];

x.domain([minQuarter, maxQuarter]);
y.domain([ 0, 1.2 ]);

console.log(x.domain(), y.domain());

var xAxis = d3.svg.axis().scale(x).orient('bottom');
var yAxis = d3.svg.axis().scale(y).orient('left');

var line = d3.svg.line().x(xAccessor).y(yAccessor);

var svg = d3.select('body').append('svg')
.attr('width', width + 2*margin).attr('height', height + 2*margin);

svg = svg.append('g').attr('transform', 'translate('+margin+','+margin+')');

svg.append('g').attr('class', 'x axis').call(xAxis).attr('transform', 'translate(0,'+height+')');
svg.append('g').attr('class', 'y axis').call(yAxis);

var paperG = svg.selectAll('.newspaper').data(data)
.enter().append('g')
.attr('class', 'newspaper')
.attr('title', function (d) { return d.name; });

paperG.append('path')
.attr('d', function (d) { return line(d.copies); })
.attr('class', 'background')
.style('stroke-width', function (d) {
	return 4 + 4 * d.maxCopies/totalMaxCopies;
});
paperG.append('path')
.attr('d', function (d) { return line(d.copies); })
.attr('class', 'foreground')
.style('stroke-width', function (d) {
	return 4 * d.maxCopies/totalMaxCopies;
});

// .style('opacity', function (d) { return 0.2 + 0.8 * d.maxCopies/totalMaxCopies; })

$('svg').on('mouseenter', 'path', function (ev) {
	$('.legend').text($(this).parents('g').attr('title')).css({top: ev.pageY, left: ev.pageX}).removeClass('hidden');
	$(this).parents('g').attr('class', 'newspaper highlight');
	$('svg').attr('class', 'highlit');
});
$('svg').on('mouseleave', 'path', function () {
	$('.legend').addClass('hidden');
	$(this).parents('g').attr('class', 'newspaper ');
	$('svg').attr('class', '');
});

});
