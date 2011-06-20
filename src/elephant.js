//         __	   ______              __           __        _    
//     .--() '.'  / __/ /___ ___ ___  / / ___ ____ / /_      (_)___
//    '|, . ,' 	 / _// // -_) -_) _ \/ _ | _ `/ _ | __/_    / /(_-<
//     !_-(_\	/___/_/ \__/\__/ .__/_//_|_,_/_//_|__/(_)__/ //___/
//	   		 	              /_/                       |___/                                         
//	
// elephant.js 0.0.1 (c) 2011 [Jeff Remer](http://jeffremer.com).
// 
// [Source](http://github.com/jeffremer/elephant.js) available on GitHub.
// [MIT License](https://github.com/jeffremer/elephant.js/blob/master/LICENSE).

(function(){
	var Elephant;
	typeof exports != 'undefined' ? Elephant = exports : Elephant = this.Elephant = {};
	
	if(window.debug) console.log("There's an Elephant in the room.")
	
	// Local Helpers
	// -------
	
	// `each` and `map`
	// Taken from [underscore.js](http://documentcloud.github.com/underscore)
	// Rather than make underscore a dependency, here are standalone versions
	// of Jeremy Ashkenas wonderful each and map functions.
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
		// Determines if window.localStorage is available
		localStorage : function() {
			try { return !!localStorage.getItem; } catch (e) {return false};
		}(),
		// Tests to make sure cookies are available
		cookies: function() {
			if(navigator.cookieEnabled) return true;
			document.cookie = 'elephantcookie=1';
			var ret = document.cookie.indexOf("cookietest=") != -1;
			document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
			return ret;
		}()
	};
	
	// Elephant.Trunk
	// --------------
	
	// The main store class.
	Elephant.Trunk = function(name) {
		// `name` is a namespace for the localStorage object
		this.name = name;
		var store = localStorage.getItem(this.name);
		// `Elephant.Trunk.data` is JSON hash of guid to object
		this.data = (store && JSON.parse(store)) || {};
	};
    
	// `guid` generates a random 32-bit unique ID
	Elephant.Trunk.prototype.guid = function() {
	    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	};

	Elephant.Trunk.prototype.sync = function() {
		localStorage.setItem(this.name, JSON.stringify(this.data));
	};
	
	// CRUD
	// ====

	// Create
	// ------

	// `save` creates a new guid for the object, assigns
	// the guid, updates the memory store, then syncs the
	// local store.
	
	// `guid` a very low chance of colliding, even so the `save` method
	// checks to see if the `guid` is in use and generates a new one before
	// clobbering any existing objects.
	// TODO If the object has a guid update instead of save.
	//		store.save({...}) // -> {..., guid: '53b425a6-47cb-462c-9498-ba236becee06'}   
	Elephant.Trunk.prototype.save = function(object) {
		var uuid = this.guid();
		while(uuid in this.data) uuid = guid();
		object.guid = uuid;
		this.data[object.guid] = object;
		this.sync();
		return object;
	};
	
	// Read
	// ------
		
	// `find` retrieves an object by guid.
	//		store.find('53b425a6-47cb-462c-9498-ba236becee06') // -> {...}
	Elephant.Trunk.prototype.find = function(guid) {		
		return this.data[guid]
	};

	// `findAll` retrieves all of the objects as an array.
    //		store.findAll() // -> [{...}, {...}, {...}]
	Elephant.Trunk.prototype.findAll = function() {		
		return map(this.data, function(obj){return obj;})
	};
	
	// Update
	// ------	
	
	// `update` saves if the object has no guid, or
	// it replaces the object in memory store and syncs.
	// 		store.update({..., guid: '53b425a6-47cb-462c-9498-ba236becee06'}) // -> {..., guid: '53b425a6-47cb-462c-9498-ba236becee06'}
	Elephant.Trunk.prototype.update = function(object) {
		if(!object.guid) {
			object = this.save(object);
		} else {
			this.data[object.guid] = object;
			this.sync()
		}
		return object;
	};
	
	// Destroy
	// ------		

	// `destroy` removes the object from the store and deletes
	// the guid off the object before returning it.
	//		store.destroy({..., guid: '53b425a6-47cb-462c-9498-ba236becee06'}) // -> {...}
	Elephant.Trunk.prototype.destroy = function(object) {
		if(object.guid && object.guid in this.data) {
			delete this.data[object.guid];
			delete object.guid;
			this.sync();
		}
		return object;
	};
	
	// `destroyAll` clears the internal data store then saves the blank object.
	//		store.destroyAll() // -> undefined	
	Elephant.Trunk.prototype.destroyAll = function() {
		this.data = {};
		this.sync();
	};
})()
