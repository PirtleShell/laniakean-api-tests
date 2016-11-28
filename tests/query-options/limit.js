
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {
  describe('limit=all', function() {
    let res;
    before(function(done) {
      get('?limit=all', function(output) {
        res = output;
        done();
      });
    });

    it ('has no error', function() {
      res.should.not.have.property('error');
    });

    it('returns all galaxies', function() {
      res.pgcs.should.have.length(globals.TOTAL_GALAXIES);
      res.galaxies.should.have.length(globals.TOTAL_GALAXIES);
    });
  });
};
