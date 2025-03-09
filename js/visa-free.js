var vfVersion='01/06/2016';
var flags = ['<img alt="" src="/img/Flag_of_Ireland.png" width="23" height="12" class="thumbborder" />', '<img alt="" src="/img/Flag_of_Russia.png" width="23" height="15" class="thumbborder" />'];
var wikiURLs = ['https://en.wikipedia.org/wiki/Visa_requirements_for_Irish_citizens', 'https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%B7%D0%BE%D0%B2%D1%8B%D0%B5_%D1%82%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_%D0%B4%D0%BB%D1%8F_%D0%B3%D1%80%D0%B0%D0%B6%D0%B4%D0%B0%D0%BD_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8'];
var countryCodes = ["AD","AE","AF","AG","AI","AL","AM","AO","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BN","BO","BM","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DT-CR","DZ","EC","EG","EE","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GE","GD","GF","GG","GH","GI","GL","GM","GN","GO","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","JU","KE","KG","KH","KI","KM","KN","KP","KR","XK","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","MG","ME","MF","MH","MK","ML","MO","MM","MN","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM-DQ","UM-FQ","UM-HQ","UM-JQ","UM-MQ","UM-WQ","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"];
var movementData = new Array();
var called = false;
var compareWeights = {
	freedom   : 1,
	notreq    : 2,
	voa       : 3,
	evisa     : 4,
	preappvoa : 5,
	req       : 6,
	nodata    : 7
}

function redirectOldBrowsers() {
	if (called) return;
        called = true;
	if ((bowser.msie && bowser.version <= 8) || (bowser.firefox && bowser.version <= 25) || (bowser.opera && bowser.version <= 12.1) || (bowser.safari && bowser.version <= 7)) {
		window.location = "https://browser-update.org/update.html";
	}
}

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", function() {
	    redirectOldBrowsers();
	}, false )
} else if ( document.attachEvent ) {
	if ( document.documentElement.doScroll && window == window.top ) {
		function tryScroll() {
			if (called) return;
			if (!document.body) return;
			try {
			    document.documentElement.doScroll("left")
			    redirectOldBrowsers();
			} catch(e) {
			    setTimeout(tryScroll, 0);
			}
		}
		tryScroll();
	}
	document.attachEvent("onreadystatechange", function() {
		if ( document.readyState === "complete" ) {
			redirectOldBrowsers();
		}
	})
}

if (window.addEventListener)
	window.addEventListener('load', redirectOldBrowsers, false);
else if (window.attachEvent)
	window.attachEvent('onload', redirectOldBrowsers);
else
	window.onload=redirectOldBrowsers;

function passportMovementRef(v) {
	return {
		'-1' : [],
		'0'  : movementData0,
		'1'  : movementData1
	}[v];
}

function passportCommentsRef(v) {
	return {
		'-1' : [],
		'0'  : commentsData0,
		'1'  : commentsData1
	}[v];
}

function labelVFRender(v) {
	return {
		freedom   : 'Freedom of movement',
		notreq    : 'Visa not required',
		voa       : 'Visa on arrival',
		evisa     : 'eVisa / ESTA / eTA / ETA',
		preappvoa : 'Pre-approved visa pick up on arrival',
		req       : 'Visa required prior to arrival',
		nodata    : 'No data'
	}[v];
}

function compareVisas() {
	var key;
	var values = new Array();
	var minValue;
	var movement;
	var passport1MovementRef = passportMovementRef($("#passport1").val());
	var passport2MovementRef = passportMovementRef($("#passport2").val());
	for (var index = 0; index < countryCodes.length; ++index) {
		key = countryCodes[index];
		values.push(typeof compareWeights[passport1MovementRef[key]] !== 'undefined' ? compareWeights[passport1MovementRef[key]] : compareWeights['nodata']);
		values.push(typeof compareWeights[passport2MovementRef[key]] !== 'undefined' ? compareWeights[passport2MovementRef[key]] : compareWeights['nodata']);
		minValue = _.min(values);
		movement = _.invert(compareWeights)[minValue];
		movementData[key] = typeof movement !== 'undefined' ? movement : 'nodata';
		values.splice(0, values.length);
	}
}

function onRegionVFTipShow(e, el, code) {
	var comments;
	var passport1MovementRef = passportMovementRef($("#passport1").val());
	var passport2MovementRef = passportMovementRef($("#passport2").val());
	var passport1CommentsRef = passportCommentsRef($("#passport1").val());
	var passport2CommentsRef = passportCommentsRef($("#passport2").val());
	var tipHtml = el.html() +' <b>('+labelVFRender(movementData[code])+')</b>';

	if (!_.isEmpty(passport1MovementRef)) {
		comments = labelVFRender(passport1MovementRef[code]);
		if (passport1CommentsRef[code] !== '') { comments += ' : ' + passport1CommentsRef[code]; }
		tipHtml += '</br>' + flags[passport1.options[passport1.selectedIndex].value] + ' : ' + comments;
	}
	if (!_.isEmpty(passport2MovementRef)) {
		comments = labelVFRender(passport2MovementRef[code]);
		if (passport2CommentsRef[code] !== '') { comments += ' : ' + passport2CommentsRef[code]; }
		tipHtml += '</br>' + flags[passport2.options[passport2.selectedIndex].value] + ' : ' + comments;
	}	
	el.html(tipHtml);
}

function refreshMap() {
	var mapObject = $('#world-map .jvectormap-container').data('mapObject');
	mapObject.series.regions[0].setValues(movementData);
}

function displayResult(r, t) {
	if (r == 0) {
		$('#result').html("<div class='alert alert-success'>");
		$('#result > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append( "</button>");
		$('#result > .alert-success').append("<strong>" + t + "</strong>");
		$('#result > .alert-success').append('</div>');
	} else {
		$('#result').html("<div class='alert alert-danger'>");
		$('#result > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append( "</button>");
		$('#result > .alert-danger').append("<strong>" + t + "</strong>");
		$('#result > .alert-danger').append('</div>');
	}
}

function testOrientation() {
	if (window.innerWidth > 755) {
		$('body').show();
		$('html').removeClass('portrait');
	} else {
		$('body').hide();
		$('html').addClass('portrait');
	}
}

$(function() {
	$(window).on('orientationchange', function() {
		testOrientation();
	});
});

$(function() {
	$(window).on('resize', function() {
		testOrientation();
	});
});

$(function() {
	$('.vf-select').on('change', function() {
		compareVisas();
		refreshMap();
		var passport1val = $("#passport1").val();
		var passport2val = $("#passport2").val();
		Cookies.set('passport1', passport1val, { expires: 365 });
		Cookies.set('passport2', passport2val, { expires: 365 });
		$('#wiki1').val(passport1val);
		passport1val != -1 ? $('#wiki1').prop('disabled', false) : $('#wiki1').prop('disabled', true);
		$('#wiki2').val($("#passport2").val());
		passport2val != -1 ? $('#wiki2').prop('disabled', false) : $('#wiki2').prop('disabled', true);
	});
});

$(function() {
	$('.btn-wiki').on('click', function() {
		if (this.value !== '-1') window.open(wikiURLs[this.value], '_blank');
		return false;
	});
});

$(function() {
	$('#btn-feedback').on('click', function() {
		$('#btn-submit').prop('disabled', false);
		$('#commentform')[0].reset();
		$('#result').html("<div></div>");
		var rand1 = Math.floor((Math.random() * 9) + 1);
		var rand2 = Math.floor((Math.random() * 9) + 1);
		$('#captchaquestion').val(rand1 + ' + ' + rand2 + ' = ');
		$('#captcha-question-label').text(rand1 + ' + ' + rand2 + ' = ');
	});
});

$(window).load(function() {
	$('body').removeClass('vf-loading');
	testOrientation();
	if (typeof Cookies.get('passport1') === 'undefined') {
		$('#passport1').val(0);
	} else {
		$('#passport1').val(Cookies.get('passport1'));
		Cookies.set('passport1', Cookies.get('passport1'), { expires: 365 });
	}
	if (typeof Cookies.get('passport2') === 'undefined') {
		$('#passport2').val(1);
	} else {
		$('#passport2').val(Cookies.get('passport2'));
		Cookies.set('passport2', Cookies.get('passport2'), { expires: 365 });
	}
	var passport1val = $("#passport1").val();
	var passport2val = $("#passport2").val();
	$('#wiki1').val(passport1val);
	$('#wiki1').tooltip();
	passport1val != -1 ? $('#wiki1').prop('disabled', false) : $('#wiki1').prop('disabled', true);
	$('#wiki2').val($("#passport2").val());
	$('#wiki2').tooltip();
	passport2val != -1 ? $('#wiki2').prop('disabled', false) : $('#wiki2').prop('disabled', true);
	$(function() {
		$('#world-map').vectorMap({
			map: 'world_mill_en',
			regionStyle: {
				initial: {
					fill: 'white',
					"fill-opacity": 1,
					stroke: 'black',
					"stroke-width": 0.1,
				}
			},
			series: {
				regions: [{
					scale: {
						freedom   : '#00A2E8',
						notreq    : '#22B14C',
						voa       : '#B5E61D',
						evisa     : '#79D343',
						preappvoa : '#B5A2A2',
						req       : '#A8ACAB',
						nodata    : '#000000'
					},
					attribute: 'fill',
					values: {},
					legend: {
						vertical: true,
						cssClass: 'jvectormap-legend',
						title: 'Legend (valid as of '+vfVersion+')',
						labelRender: labelVFRender
					}
				}]
			},
			onRegionTipShow: onRegionVFTipShow
		});
	});
	compareVisas();
	refreshMap();
	$('#commentform').submit(function(event) {
		$('#btn-submit').prop('disabled', true);
		$('body').addClass('vf-wait');
		var formData = {
			'jzptopbnqn' : $('input[name=email]').val(),
			'qargkquysx' : $('textarea[name=comment]').val(),
			'sbggxvxxrk' : $('input[name=captchaquestion]').val(),
			'cxwvnkfyll' : $('input[name=captcha]').val()
		};
		$.ajax({
			type     : 'POST',
			url      : '/feedback.php',
			data     : formData,
			dataType : 'json',
			encode   : true
		})
		.done(function(data) {
			$('body').removeClass('vf-wait');
			if (!data.success) {
				$('#btn-submit').prop('disabled', false);
				displayResult(1, data.message);
			} else {
				$('#commentform')[0].reset();
				displayResult(0, data.message);
			}
			console.log(data);
		})
		.fail(function(data) {
			$('body').removeClass('vf-wait');
			$('#btn-submit').prop('disabled', false);
			displayResult(1, "Failed to send your feedback.")
			console.log(data);
		});
		event.preventDefault();
	});
});