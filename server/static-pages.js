'use strict';
var slugify = require('../app/scripts/slugify.js');
var fs = require('fs');

var dataSource = __dirname + '/' + '../app/data/data.tsv';
var dest = __dirname + '/../dist/static/';
var LOG2 = Math.log(2);
var template = fs.readFileSync(__dirname + '/' + '../dist/index.html').toString();

try {
	fs.mkdirSync(dest);
} catch (e) {}

var publications = fs.readFileSync(dataSource).toString().trim().split('\n');
var headers = publications.shift().split('\t');
publications = publications.map(function (p) {
	p = p.split('\t');
	var r = {};
	headers.forEach(function (header, i) {
		r[header] = p[i];
	});
	r.slug = slugify(r);
	return r;
});

function ampersand (string) {
	return string.replace(/&/g, '&amp;');
}

publications.forEach(function (publication) {
	var halfLife = LOG2/publication.lambda/4;
	var name = publication.title;
	var article = 'die';
	if (name.match(/^der|^die|^das/i)) {
		name = name.split(' ');
		article = name.shift().toLowerCase();
		name = name.join(' ');
	}
	if (name.match(/blatt|magazin/i)) article = 'das';
	if (name === 'Trierischer Volksfreund') {
		article = 'der';
		name = 'Trierische Volksfreund';
	}
	var accusative = {
		der: 'beim',
		die: 'bei der',
		das: 'beim'
	}
	var title;
	if (halfLife >= 0) title = 'Zeitungssterben? Nicht ' + accusative[article] + ' »%s«';
	else title = 'Wann stirbt ' + article + ' »%s«?';
	// We need the title to stay below 70 characters
	var allowedLength = 70 - title.length + 2 - 1; // -1 for "…" character
	while (name.length > allowedLength) {
		name = name.split(' ');
		name.pop();
		name = name.join(' ') + '…';
	}
	title = title.replace('%s', name).replace(/"/g, '&quot;');

	var html = template;
	var properties = {
		title: ampersand(title),
		'image:src': 'http://apps.opendatacity.de/zeitungssterben/img/' + publication.slug + '.png',
	};

	Object.keys(properties).forEach(function (key) {
		var value = properties[key];
		html = html.replace(
			new RegExp('<meta name="twitter:' + key + '".*'),
			'<meta name="twitter:' + key + '" content="' + value + '">'
		);
	});
	html = html.replace(/<title>(.*?)<\/title>/, '<title>' + ampersand(publication.title) + ': $1' + '</title>');

	fs.writeFileSync(dest + publication.slug + '.html', html);
});
