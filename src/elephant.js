(function(){
	var Elephant;
	typeof exports != 'undefined' ? Elephant = exports : Elephant = this.Elephant = {};
	
	if(window.debug) console.log("There's an Elephant in the room.")
	
	// Local Helpers
	// -------
	
	// `each` and `map`
	// Taken from [underscore.js](http://documentcloud.github.com/underscore)
	function each(obj, iterator, context) {
		if (obj == null) return;
		if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
			obj.forEach(iterator, context);
		} else if (!!(obj.length === 0 || (obj.length && obj.length.toExponential && obj.length.toFixed))) {
			for (var i = 0, l = obj.length; i < l; i++) {
				if (iterator.call(context, obj[i], i, obj) === {}) return;
			}
		} else {
			for (var key in obj) {
				if (hasOwnProperty.call(obj, key)) {
					if (iterator.call(context, obj[key], key, obj) === {}) return;
				}
			}
		}
	}
	
	function map(obj, iterator, context) {
		var results = [];
		if (obj == null) return results;
		if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context);
		each(obj, function(value, index, list) {
			results[results.length] = iterator.call(context, value, index, list);
		});
		return results;			
	}
	
	// Elephant.has
	// ------------
	Elephant.has = {
		localStorage : function() {
			try { return !!localStorage.getItem; } catch (e) {return false};
		}(),
		cookies: function() {
			if(navigator.cookieEnabled) return true;
			document.cookie = 'elephantcookie=1';
			var ret = document.cookie.indexOf("cookietest=") != -1;
			document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
			return ret;
		}()
	};
	
	Elephant.Trunk = function(name) {
		this.name = name;
		var store = localStorage.getItem(this.name);
		this.data = (store && JSON.parse(store)) || {};
	};

	Elephant.Trunk.prototype.guid = function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	};

	Elephant.Trunk.prototype.sync = function() {
		localStorage.setItem(this.name, JSON.stringify(this.data));
	};
	
	// CRUD
	// ====

	// `save` creates a new guid for the object, assigns
	// the guid, updates the memory store, then syncs the
	// local store.
	Elephant.Trunk.prototype.save = function(object) {
		var uuid = this.guid();
		while(uuid in this.data) uuid = guid();
		object.guid = uuid;
		this.data[object.guid] = object;
		this.sync();
		return object;
	};
	
	// `update` saves if the object has no guid, or
	// it replaces the object in memory store and syncs.
	Elephant.Trunk.prototype.update = function(object) {
		if(!object.guid) {
			object = this.save(object);
		} else {
			this.data[object.guid] = object;
			this.sync()
		}
		return object;
	};
	
	Elephant.Trunk.prototype.find = function(guid) {		
		return this.data[guid]
	};
	
	Elephant.Trunk.prototype.findAll = function() {		
		return map(this.data, function(obj){return obj;})
	};

	Elephant.Trunk.prototype.destroy = function(object) {
		if(object.guid && object.guid in this.data) {
			delete this.data[object.guid];
			delete object.guid;
			this.sync();
		}
		return object;
	};
	
	Elephant.Trunk.prototype.destroyAll = function() {
		this.data = {};
		this.sync();
	};
})()
