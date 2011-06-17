(function(){
	var Elephant;
	typeof exports != 'undefined' ? Elephant = exports : Elephant = this.Elephant = {};
	
	if(window.debug) console.log("There's an Elephant in the room.")
	
	Elephant.has = {
		localStorage : function() {
			try { return !!localStorage.getItem; } catch (e) {return false};
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
