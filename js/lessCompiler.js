$(function() {
	var options = {
		lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js"
		//,lessCDN: "//cdnjs.cloudflare.com/ajax/libs/less.js/{version}/less.min.js"
	};

	var elements = {
		lessVersion: $('#lessVersion')
		,lessInput: $('#lessInput')
		,cssCode: $('#cssOutput')
	};



	setupEvents();

	loadLess();


	function setupEvents() {
		elements.lessVersion.bind('change', loadLess);

		var previousLessCode = elements.lessInput.val();
		elements.lessInput.on('change keyup input paste cut copy', function() {
			var lessCode = elements.lessInput.val();
			if (previousLessCode === lessCode)
				return;

			previousLessCode = lessCode;

			compileLess();
		});
	}


	function loadLess() {
		elements.lessInput.attr('disabled', true);

		var version = elements.lessVersion.val();
		var scriptUrl = options.lessCDN.replace('{version}', version);
		window.less = undefined;
		$.ajax({
			dataType: 'script'
			, cache: true
			, url: scriptUrl
		}).then(function(){
			elements.lessInput.attr('disabled', false);
			compileLess();
		});

	}

	function compileLess() {
		var lessCode = elements.lessInput.val();

		try {
			var compiledCSS = parseLess(lessCode);
			elements.cssCode.css('color', '').text(compiledCSS);
		} catch (lessEx) {
			var errorText = lessEx.type + " error: " + lessEx.message + "\n" + (lessEx.extract && lessEx.extract.join(''));
			elements.cssCode.css('color','red').text(errorText);
		}

	}


	function parseLess(lessCode) {

		var parser = new less.Parser({});

		var resultCss = "";
		parser.parse(lessCode, function(lessEx, result) {
			if (lessEx) throw lessEx;
			resultCss = result.toCSS();
		});

		return resultCss;
	}

});
