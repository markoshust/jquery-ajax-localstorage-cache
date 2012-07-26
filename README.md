# About 
jquery-ajax-localstorage-cache is a plugin built for jQuery (>1.5.1) and localStorage. It's a fork from the [jStorage-dependent original](https://github.com/nectify/jquery-ajax-jstorage-cache). It provides a client-side cache AJAX responses intended to save bandwith and time. 

# How to use 

## Parameters
```javascript
	$.ajax({
		url          : '/post',
		localCache   : true,        // required to use

		cacheTTL     : 1*60*60,     // in seconds. Optional
		cacheKey     : 'post',      // optional
		isCacheValid : function(){  // optional
			return true;
		},

		success: function(reply) {
			// i can play with my reply ! 
		}
	});
```
On your AJAX request you get 4 new parameters :

* localCache
	* Turn localCache on/off
	* Default: false
* cacheTTL
    * time in seconds the entry should be valid. 
    * only for this specific ajax request
    * Default : 5 hours
* cacheKey
	* CacheKey is the key that will be used to store the response in localStorage. It allow you to delete your cache easily with the localStorage.removeItem() function.
	* Default: URL + TYPE(GET/POST) + DATA
* isCacheValid
	* This function must return true or false. On false, the cached response is removed.
	* Default: null

## Notification Poller - with jQuery.Deferred
```javascript
	function ajaxCached(cacheKey, cacheTTL, reqtype, data) {
		var aDeferred = $.Deferred();
		$.ajax({
			url: '/api',
			data: data,
			dataType: 'json',
			type: reqtype,
			
			localCache: true,
			cacheKey: cacheKey,
			cacheTTL: cacheTTL,
			isCacheValid: function() { return true; },
			success: function(response) {
				aDeferred.resolve(response);
			}, error: function() {
				aDeferred.reject();
			}
		});
		return aDeferred.promise();
	}
	function notificationsPoller() {
		var interval = 120; // 2 min
		var cachettl = interval / 2; // 1 min
		ajaxCached('notificationsdata', cachettl, 'get', { module: 'notifications' }).then(function() {
			// CONSUME DATA - Restart next trigger
			setTimeout(notificationsPoller, interval);
		}, function() {  
			// ERROR! 
		});
	}
```

## Notes

* You can delete the cache by using ```localStorage.clear()```.
* Note that you can pre-load content with this plugin. You just have do to the same AJAX request without a success callback and the same cacheKey.

# License

This project is distributed under Apache 2 License. See LICENSE.txt for more information.
