
const should = require('chai').should();

module.exports = get => {
  describe('SPECIAL QUERIES', function() {

    describe('list & explorer', function() {
      let res;
      before(function(done) {
        get('?list_pgcs=true&explorer=true', function(output) {
          res = output;
          done();
        });
      });

      it('should have error', function() {
        res.should.have.property('error');
        res.error.should.equal("Multiple shorthand or special query parameters found.");
      });
    });

    require('./explorer')(get);
    require('./list')(get);
  });
}
