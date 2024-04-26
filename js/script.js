function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(nameEQ) != -1) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function clickId(e) {
    var a = new Date();
	a = new Date(a.getTime() + 1000 * 60 * 60 * 24 * 365);
	// var domain = location.hostname.split('.').reverse()[1] + "." + location.hostname.split('.').reverse()[0];
	// var domain = "localhost";
	// document.cookie = "firstVisit=true; domain=" + domain + "; expires=" + a.toGMTString() + "; path=/";
	document.cookie = "clickId=" + e + "; expires=" + a.toGMTString() + "; path=/";
}

$(document).ready(function() {
	/* GET Parameter from URL (for clickid) */
	var queryString = window.location.search;
	var urlParams = new URLSearchParams(queryString);
	var pathName = location.pathname;
	if(urlParams.get('aff_sub2')) {
		var clickid = urlParams.get('aff_sub2');
		clickId(clickid);
		window.history.replaceState({}, document.title, pathName);
	}

	/* Change the [ClickID] in href */
	if(getCookie('clickId')) {
		var ID = getCookie('clickId');
	}
	var offerButtons = document.querySelectorAll('[href*="[click_id]"]');
	offerButtons.forEach(elem => {
		var href = elem.getAttribute('href');
		if(ID != null && ID != "") {
			ext = ID;
		} else {
			ext = "default";
		}
		newHref = href.replace("[click_id]", ext);
		elem.href = newHref;
	});
	
	var headerHeight = $('header').outerHeight();
	$('html head').append('<style>:root {--header-height:' + headerHeight + 'px;}</style>');
	
	$('#burger').click(function() {
		$(this).toggleClass('active');
	});
	
	$('[data-href]').click(function() {
		var anchor = $(this).attr('data-href');
		$('html, body').animate({
			scrollTop: $('#' + anchor).offset().top - headerHeight
		}, 500);
	});
	
	function prevSlide(e) {
		if(e.find('.active').prev().length) {
			e.find('.active').removeClass('active').prev().addClass('active');
		} else {
			e.find('.active').removeClass('active');
			e.children().last().addClass('active');
		}

		var step = e.parent().next('.steps-slide');
		if(step.find('.active').prev().length) {
			step.find('.active').removeClass('active').prev().addClass('active');
		} else {
			step.find('.active').removeClass('active');
			step.children().last().addClass('active');
		}
	}

	function nextSlide(e) {
		if(e.find('.active').next().length) {
			e.find('.active').removeClass('active').next().addClass('active');
		} else {
			e.find('.active').removeClass('active');
			e.children().first().addClass('active');
		}

		var step = e.parent().next('.steps-slide');
		if(step.find('.active').next().length) {
			step.find('.active').removeClass('active').next().addClass('active');
		} else {
			step.find('.active').removeClass('active');
			step.children().first().addClass('active');
		}
	}

	function goToSlide(e, pos) {
		e.find('.active').removeClass('active');
		e.children().eq(pos + 1).addClass('active');

		var step = e.parent().next('.steps-slide');
		step.find('.active').removeClass('active');
		step.children().eq(pos).addClass('active');
	}
	
	var theSlider = $('[data-slider]');
	theSlider.each(function() {
		var parent = $(this);
		parent.after('<div class="f fac fjc imh-tls steps-slide"></div>');
		steps = parent.next('.steps-slide');
		sliders = parent.find('> :not(.bt) > :not(.active):not(.steps-slide)');
		sliders.first().addClass('active');
		var first = true;
		sliders.each(function() {
			steps.append('<span class="bt bt-small' + (parent.attr('data-slider') == 'sc' ? ' scb' : ' pcb') + (first == true ? ' active' : '') + '"> </span>');
			first = false;
		});
	});
	
	$('[data-slider] > :first-child').click(function() {
		prevSlide($(this).next());
	});

	$('[data-slider] > :last-child').click(function() {
		nextSlide($(this).prev());
	});

	$('.steps-slide span').click(function() {
		var slides = $(this).parent().prev().find(':not(.bt)');
		var position = $(this).index();
		goToSlide(slides, position);
	});

	$('[data-open-panel]').click(function() {
		var panel = $(this).attr('data-open-panel');
		$('[data-panel="' + panel + '"]').addClass('active');
		$('body').addClass('no-scroll');
	});
	
	$('.close-panel, [data-close-panel]').click(function() {
		$(this).parents('.panel').removeClass('active');
		$('body').removeClass('no-scroll');
	});
	
	// DATA-STEP //
	var stepsParent = $('[data-steps]');
	var steps = stepsParent.find("> div");
	steps.first().addClass('active');
	
	var btsDiv = stepsParent.find('[data-btn]');
	var btPrev = btsDiv.find('> span:first-child');
	var btNext = btsDiv.find('> span:last-child');

	steps.each(function(){
		if($(this).is(':first-child')) {
			$(this).find('[data-btn] > span:first-child').addClass('disabled');
			$(this).find('[data-btn] > span:last-child').addClass('disabled');
		}
	});
	
	function prevStep(gender) {
		var active = stepsParent.find("> div.active");
		active.removeClass('active').prevAll('[data-gender="' + gender + '"]').first().addClass('active');
		
		$('[data-number-step]').each(function(){
			$(this).find('.active').removeClass('active').prev().addClass('active');
		});
	};
	
	function nextStep(gender) {
		var active = stepsParent.find("> div.active");
		if(active.nextAll('[data-gender="' + gender + '"]').length > 0){
			active.removeClass('active').nextAll('[data-gender="' + gender + '"]').first().addClass('active');
		} else {
			active.removeClass('active').nextAll('[data-results]').addClass('active');
		}
	
		$('[data-number-step]').each(function(){
			$(this).find('.active').removeClass('active').next().addClass('active');
		});
	};
	
	var gender;
	var skip = true;
	steps.find('input').click(function(){
		var parent = $(this).parents('[data-question]');
		var btNext = parent.next('[data-btn]').find('> :last-child');
		
		if($(this).attr('name') == 'gender') {
			if($(this).attr('value') == 'gender-0') {
				gender = 'm';
			} else if($(this).attr('value') == 'gender-1') {
				gender = 'f';
			}
			$(this).parents('[data-gender]').attr('data-gender', gender);
			$('[data-results]').find('img').removeClass('active')
			$('[data-results]').find('img[data-gender="' + gender + '"]').addClass('active');
		}
		
		if(skip) {
			nextStep(gender);
		}
		
		if(parent.find(':checked').length > 0){
			btNext.removeClass('disabled');
		} else {
			btNext.addClass('disabled');
		}
	});
	
	btPrev.click(function() {
		prevStep(gender);
	});
	btNext.click(function() {
		nextStep(gender);
	});

	// END DATA-STEP //
	
	$(document).keyup(function(e) {
		if (e.key === "Escape") {
			$('.panel').removeClass('active');
			$('body').removeClass('no-scroll');
		}
	});

	var touchsupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
	if (touchsupport) {
		document.documentElement.className += " touch"
	}
});