// Usage example:
//
//	function takeScreenshot () {
//		window.photogenic(function (filename, status) {
//			if (status === false) return;
//			writeScreenshotToDiskSomehow(filename, function done () {
//				if (status.queue.length > 0) {
//					setTimeout(takeScreenshot, 0);
//				}
//			});
//		});
//	}
//	takeScreenshot();

window.photogenic = (function () {
	var ready = false;
	var deferredUntilReady = [];
	var queue;

	$(Z).on('Z:ready', function () {
		ready = true;
		var cb;
		while (cb = deferredUntilReady.shift()) cb();
	});

	function whenReady (callback) {
		if (!ready) deferredUntilReady.push(callback);
		else callback();
	}

	var currentIndex = -1;
	var currentItem;

	function photogenic (takeScreenshot, skip) {
		// The queue is generated here to make sure it's not generated
		// if it's not needed.
		if (!queue) whenReady(function() {
			queue = Z.publications.map(function (p) { return p; });
			$('body').addClass('photogenic');
		});

		whenReady(function () {
			if (queue.length === 0) {
				takeScreenshot(null, false);
				return;
			}

			skip = skip || 0;
			currentIndex++;
			while (currentIndex < skip) {
				currentIndex++;
				queue.shift();
			}
			currentItem = queue.shift();
			
			$(Z).one('Z:chartdrawn', function () {
				var filename = Z.slugify(currentItem) + '.png';
				var status = {
					item: currentItem,
					queue: queue,
					index: currentIndex,
					config: {
						width: 560,
						height: 300
					}
				}
				takeScreenshot(filename, status);
			});
			$(Z).trigger('Z:publicationchange', currentItem);
		});
	}
	return photogenic;
})();
