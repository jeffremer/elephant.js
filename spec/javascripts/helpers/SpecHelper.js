beforeEach(function() {
  this.addMatchers({
    toBeAnArray: function() {
      var actual = this.actual;
	  return toString.call(actual) === '[object Array]';
    }
  })
});
