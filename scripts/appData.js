var AppData = function() {
	var _endpoints,
    	_initialCards,
    	_announcements,
        _data,
        _private;

	_endpoints = {
		starbucksTest: {path:"scripts/starbucksTest.json", verb:"GET"}
	};
    
	_initialCards = [
		{
			"cardNumber":"461253932",
			"amount":20,
			"bonusPoints":60,
			"expireDate":"2013/12/06"
		},{
			"cardNumber":"723128745",
			"amount":76,
			"bonusPoints":22,
			"expireDate":"2014/10/16"
		},{
			"cardNumber":"912472185",
			"amount":104,
			"bonusPoints":56,
			"expireDate":"2014/11/24"
		}
	];
	/*$.post('http://farinidea.ir/shahrdari/index.php', {},
     function (data) {
         //the data variable holds the json returned from PHP
         //parse it
         _announcements = data;
         //then use it like an object
     });*/
	_announcements = [
		{ title: "خورشید", description: "خ احمدآباد-مقابل سه راه راهنمایی", url: "images/p1.jpg",projectNumber:"1" },
		{ title: "مجد", description: "بولوار معلم- انتهای معلم 83 (کال چهل بازه)", url: "images/p2.jpg", projectNumber: "2" },
		{ title: "سلمان", description: "انتهای اراضی گلشهر", url: "images/p3.jpg", projectNumber: "3" },
		{ title: "مریم", description: "تقاطع خیابان سلمان فارسی و راهنمایی", url: "images/p4.jpg", projectNumber: "4" },
		{ title: "آلتون", description: "حاشیه کمربندی صدمتری - نرسیده به بولوار گلشهر", url: "images/p5.jpg", projectNumber: "5" },
		{ title: "بازار ملل", description: "خ ابن سینا- بعد از خیابان پاستور- پلاک 196.", url: "images/p6.jpg", projectNumber: "6" }
	];
    

	_private = {
		load: function(route, options) {
			var path = route.path,
    			verb = route.verb,
    			dfd = new $.Deferred();

			console.log("GETTING", path, verb, options);

			//Return cached data if available (and fresh)
			if (verb === "GET" && _private.checkCache(path) === true) {
				//Return cached data
				dfd.resolve(_private.getCache(path));
			}
			else {
				//Get fresh data
				$.ajax({
					type: verb,
					url: path,
					data: options,
					dataType: "json"
				}).success(function (data, code, xhr) {
					_private.setCache(path, {
						data: data,
						expires: new Date(new Date().getTime() + (15 * 60000)) //+15min
					});
					dfd.resolve(data, code, xhr);
				}).error(function (e, r, m) {
					console.log("ERROR", e, r, m);
					dfd.reject(m);
				});
			}

			return dfd.promise();
		},
        
		checkCache: function(path) {
			var data,
			path = JSON.stringify(path);

			try {
				data = JSON.parse(localStorage.getItem(path));
                
				if (data === null || data.expires <= new Date().getTime()) {
					console.log("CACHE EMPTY", path);
					return false;
				}
			}
			catch (err) {
				console.log("CACHE CHECK ERROR", err);
				return false;
			}

			console.log("CACHE CHECK", true, path);
			return true;
		},
        
		setCache: function(path, data, expires) {
			var cache = {
				data: data,
				expires: expires
			},
			path = JSON.stringify(path);

			//TODO: Serialize JSON object to string
			localStorage.setItem(path, JSON.stringify(cache));

			console.log("CACHE SET", cache, new Date(expires), path);
		},
        
		getCache: function(path) {
			var path = JSON.stringify(path),
			cache = JSON.parse(localStorage.getItem(path));

			console.log("LOADING FROM CACHE", cache, path);

			//TODO: Deserialize JSON string
			return cache.data.data;
		}
	};

	return {
		getStarbucksLocations: function(lat, lng, max) {
            return $.getJSON("data/starbucksTest.json");
		},
        
		getInitialCards: function() {
			return JSON.stringify(_initialCards);
		},
        
		getAnnouncements: function () {
		    if (_data == null)
		        return _announcements;
            else
		    return _data;
		}
	};
}