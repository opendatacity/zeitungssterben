var fs = require('fs');
var slugify = require('../app/scripts/slugify');

var dataSource = '../app/data/data.tsv';

var publications = fs.read(dataSource).toString().trim().split("\n");
var headers = publications.shift().split("\t");
publications = publications.map(function (p) {
	p = p.split("\t");
	var r = {}
	headers.forEach(function (header, i) {
		r[header] = p[i];
	});
	r.slug = slugify(r);
	return r;
});


var page = require('webpage').create();
page.zoomFactor = 2;
page.viewportSize = { width: 560, height: 300 };

page.open('http://localhost:9000', function () {
	window.setInterval(next, 300);
});

var ready = true;

function next () {
	if (publications.length <= 0) phantom.exit();
	if (!ready) return;
	ready = false;
	var publication = publications.shift();

	console.log(publication.title, '('+publications.length+')');

	page.evaluate(function (publicationTitle) {
		window.photogenic = true;
		document.getElementById('tf-publication').value = publicationTitle;
		window.jQuery('body').addClass('photogenic');
		window.jQuery('form').triggerHandler('submit');
	}, publication.title);

	window.setTimeout(function () {
		page.render('../screenshots/'+publication.slug+'.png');
		ready = true;
	}, 100);
}
