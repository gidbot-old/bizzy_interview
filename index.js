var express = require('express');
var router = express.Router(); 
var https = require('https');
var request = require('request');
var cookie = require('cookie');


router.get('/', function (req, res) {
	res.render('login'); 
});

router.post('/', function (req, res) {
	req.session.url =  'https://' + req.body.name + '.myshopify.com';

	var post_data = { 
		'utf8':'✓',
		'redirect': '',
		'subdomain':req.body.name,
		'login':req.body.email,
		'password':req.body.pwd
	}

	var headers = { 
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    	'Content-Type' : 'application/x-www-form-urlencoded' 
	};
	var url = req.session.url + '/admin/auth/login';
	request.post({ url: url, form: post_data, headers: headers }, function (err, response, body) {
		var shopCookies = response.headers['set-cookie'];

		var j = request.jar();
		for (var i = 0; i < shopCookies.length; i++) {
			var cookie = request.cookie(shopCookies[i]);
			j.setCookie(cookie, url);
		}
		req.session.cookie_string = j.getCookieString(url);
		res.redirect('/discounts/new');
	});
});

router.get('/discounts/new', function (req, res) {
	if (!req.session.cookie_string) {
		res.redirect('/')
	} else {
		res.render('form');
	}

});

router.post('/discounts/new', function (req, res) {
	if (!req.session.cookie_string) {
		res.redirect('/');
	} else {

		var url = req.session.url + '/admin/discounts/new'; 
		var headers = { 
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    		'Content-Type' : 'application/x-www-form-urlencoded',
    		'Cookie': req.session.cookie_string
		};

		request.get({ url: url, headers: headers}, function (err, response, body) {
			var value = response.body.match(/name="authenticity_token" value=".*"/i)[0];
			var index = value.indexOf('value="');
			value = (value.substring(index+7, value.length-1));

			var count = parseInt(req.body.amount) + 1;
			var checkCount = count;  
			var codes = [];
			for (var i =1; i < count; i++) {
				var post_data = { 
				  utf8: '✓',
				  authenticity_token: value,
				  discount: 
				   { code: req.body.code+"_"+i,
				     discount_type: req.body.discount_type,
				     value: parseInt(req.body.value),
				     applies_to_resource: '',
				     starts_at: '2016-02-09' },
				  	'unlimited-uses': '',
				 	 discount_never_expires: '' 
				}

				codes.push({code:req.body.code+"_"+i, discount_type: req.body.discount_type,value:  parseInt(req.body.value)});

				var url =  req.session.url+ '/admin/discounts'; 
				request.post({ url: url, form: post_data, headers: headers }, function (err, response, body) {
					checkCount--; 
					if (checkCount < 2) {
						res.send('Added the following codes: <br>' , codes);
					}
				});

			}


		});
	}
});


module.exports = router;
