$(function() {
	var options = {
		lessVersions: [ '1.3.3', '1.3.1', '1.3.0' ]
		,lessCDN: "//raw.github.com/cloudhead/less.js/master/dist/less-{version}.js"
		//,lessCDN: "//cdnjs.cloudflare.com/ajax/libs/less.js/{version}/less.min.js"
	};

	var elements = {
		lessVersion: $('#lessVersion')
		,lessInput: $('#lessInput')
		,cssCode: $('#cssOutput')
	};



	populateLessVersions();
	setupEvents();




	function populateLessVersions() {
		$.each(options.lessVersions, function(i, ver) {
			elements.lessVersion.append($('<option />').text(ver));
		});
	}

	function setupEvents() {
		elements.lessVersion.bind('change', function(){
			var version = elements.lessVersion.val();
			var scriptUrl = options.lessCDN.replace('{version}', version);

			elements.lessInput.attr('disabled', true);

			// Load the new version of LESS:
			$.ajax({
				dataType: 'script'
				, cache: true
				, url: scriptUrl
			}).then(function(){
				elements.lessInput.attr('disabled', false);
				compileLess();
			});
		});

		var previousLessCode = elements.lessInput.val();
		elements.lessInput.on('change keyup input paste cut copy', function() {
			var lessCode = elements.lessInput.val();
			if (previousLessCode === lessCode)
				return;

			previousLessCode = lessCode;

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
