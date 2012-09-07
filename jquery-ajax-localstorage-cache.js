// github.com/markoshust/jquery-ajax-localstorage-cache

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  // Cache?
  if (!options.localCache) return;
  
  var secttl = options.cacheTTL || 60*60;
  var cacheKey = options.cacheKey || options.url.replace(/jQuery.*/, '') + options.type + options.data;
  
  // isCacheValid validates cache
  if (options.isCacheValid &&  ! options.isCacheValid()){
    localStorage.removeItem( cacheKey );
  }
  
  // Flush item if TTL is expired
  var ttl = localStorage.getItem(cacheKey + 'cachettl');
  if (ttl && ttl < +new Date()){
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(cacheKey + 'cachettl');
    ttl = 'expired';
  }
  
  var value = localStorage.getItem(cacheKey);
  if (value){
    // Apply success callback (parse JSON if possible) if in cache & abort the XHR request
    if (options.dataType.indexOf('json') === 0) {
      value = JSON.parse(value);
    }
    
    options.success(value);
    jqXHR.abort();
  } else {
    // If not in cache change success callback
    if (options.success) {
      options.realsuccess = options.success;
    }
    
    // Store data on localstorage and apply initial callback
    options.success = function( data ) {
      var strdata = data;
      if (this.dataType.indexOf('json') === 0) {
        strdata = JSON.stringify(data);
      }
      
      localStorage.setItem(cacheKey, strdata);
      if (options.realsuccess) {
        options.realsuccess(data);
      }
    };
    
    // Store timestamp
    if (!ttl || ttl === 'expired') {
      localStorage.setItem(cacheKey + 'cachettl', +new Date() + 1000 * secttl);
    }
  }
});