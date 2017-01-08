
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {
  describe('specific pgc query', function() {

    describe('for galaxy in database', function() {
      let res;
      before(function(done) {
        get('?pgc=42637', function(output) {
          res = output;
          done();
        });
      });

      it ('has no error', function() {
        res.should.not.have.property('error');
      });

      it('returns single galaxy object', function() {
        res.should.be.a('object');
        globals.DEFAULT_DATA.forEach(field => {
          res.should.have.property(field);
        });
      });
    });

    describe('for galaxy not in database', function() {
      let res;
      before(function(done) {
        get('?pgc=1', function(output) {
          res = output;
          done();
        });
      });

      it ('throws an error', function() {
        res.should.have.property('error');
        res['error'].should.equal('PGC 1 not found.');
      });
    });

  });
};
