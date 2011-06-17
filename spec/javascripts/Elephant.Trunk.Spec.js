describe('Elephant.Trunk', function(){
	var object;
	var store;
	
	beforeEach(function(){
		object = {
			aProperty: 'aValue',
			aList: [
				'firstListValue', 'secondListValue'
			],
			aNestedObject: {
				aNestedProperty: 'aNestedPropertyValue'
			}
		};
		
		store = new Elephant.Trunk('spec-store');
	});
	
	it('should generate guids', function(){
		expect(store.guid()).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
	});

	it('can save an object', function() {
		expect(store.save(object)).toBeTruthy();
	});

	it('can update an object', function() {
		expect(object = store.save(object)).toBeTruthy();
		object.aProprety = 'anotherValue';
		expect(store.update(object)).toEqual(object);
	});

	it('will save an object without a guid when trying to update', function() {
		spyOn(store, 'save').andCallThrough();
		expect(store.update(object)).toBeTruthy();
		expect(store.save).toHaveBeenCalled();
	});
	
	it('can find an object by ID', function(){
		object = store.save(object);
		expect(store.find(object.guid)).toEqual(object);
	});
	
	it('can find all objects', function(){
		expect(store.findAll()).toBeAnArray();
	});
	
	it('can delete an object', function() {
		object = store.save(object);
		expect(object.guid).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
		object = store.destroy(object);
		expect(object.guid).toBeUndefined();		
	});
	
	it('can delete all objects', function() {
		spyOn(store, 'sync').andCallThrough();
		store.destroyAll();
		expect(store.sync).toHaveBeenCalled();
		expect(store.data).toEqual({});
	})
})