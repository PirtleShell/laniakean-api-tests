
const globals = require('../globals');
const arrayEqual = require('array-equal');
const should = require('chai').should();

module.exports = get => {
  describe('DATA OPTIONS', function() {

    describe('no query default', function() {
      let res;
      before(function(done) {
        get('', function(output) {
          res = output;
          done();
        });
      });

      it('should not return error', function() {
        res.should.not.have.property('error');
      });

      it('should be object of pgcs & galaxies', function() {
        res.should.have.property('pgcs');
        res.should.have.property('galaxies');
      });

      it('should return 25 galaxies', function() {
        res.pgcs.should.have.length(25);
        res.galaxies.should.have.length(25);
      });

      it('should contain first pgcs, properly ordered', function() {
        const first_pgcs = [4, 27, 40, 51, 55, 64, 66, 70, 76, 82, 94, 114, 115, 123, 124, 143, 145, 165, 176, 179, 181, 182, 186, 196, 201];
        arrayEqual(res.pgcs, first_pgcs).should.be.true;
      });

      it('should be default galaxy objects', function() {
        const galaxy = res.galaxies[0];
        globals.DEFAULT_DATA.forEach(prop => {
          galaxy.should.have.property(prop);
        });
      });
    });

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
    })
  });
};
