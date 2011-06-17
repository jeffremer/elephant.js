describe('Elephant.has', function(){
	it('detects if localStorage is available', function() {
		expect(Elephant.has.localStorage)['toBe' + (window.localStorage ? 'Truthy' : 'Falsey')]();  
	});
	it('detects if cookies are available', function() {
		expect(Elephant.has.localStorage)['toBe' + (navigator.cookieEnabled ? 'Truthy' : 'Falsey')]();  
	});	
})