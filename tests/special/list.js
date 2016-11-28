
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {
  describe('list', function() {

    describe('= true, without limit or sort', function() {
      let res;
      before(function(done) {
        get('?list=true', function(output) {
          res = output;
          done();
        });
      });

      it('returns pgcs array', function() {
        res.should.have.property('pgcs');
        res.pgcs.should.be.a('array');
      });

      it('defaults to all galaxies', function() {
        res.pgcs.should.have.length(globals.TOTAL_GALAXIES);
      });

      it('begins with first pgc', function() {
        res.pgcs[0].should.equal(4);
      });

    });

    describe('= true, with limit', function() {
      let res;
      before(function(done) {
        get('?list=true&limit=10', function(output) {
          res = output;
          done();
        });
      });

      it('returns pgcs array', function() {
        res.should.have.property('pgcs');
        res.pgcs.should.be.a('array');
      });

      it('queries proper number', function() {
        res.pgcs.should.have.length(10);
      });
    });

    describe('= false', function() {
      let res;

      before(function(done) {
        get('?list=false', function(output) {
          res = output;
          done();
        });
      });

      it('returns error', function() {
        res.should.have.property('error');
        res.error.should.equal('Expected list=true.')
      });
    })
  });
}
