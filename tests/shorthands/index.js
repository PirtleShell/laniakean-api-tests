
const arrayEqual = require('array-equal');
const should = require('chai').should();

module.exports = get => {
  describe('SHORTHAND QUERIES', function() {

    describe('closest', function() {
      let res;
      before(function(done) {
        get('?closest=10', function(output) {
          res = output;
          done();
        });
      });

      it('has no error', function() {
        res.should.not.have.property('error');
      });

      it('should return proper number', function() {
        res.pgcs.should.have.length(10);
        res.galaxies.should.have.length(10);
      });

      it('should return closest galaxies', function() {
        const closest_pgcs = [17223, 3085, 54074, 3589, 60095, 88608, 19441, 10074, 34176, 29488];
        arrayEqual(res.pgcs, closest_pgcs).should.be.true;
      });
    });

    describe('brightest', function() {
      let res;
      before(function(done) {
        get('?brightest=10', function(output) {
          res = output;
          done();
        });
      });

      it('has no error', function() {
        res.should.not.have.property('error');
      });

      it('should return proper number', function() {
        res.pgcs.should.have.length(10);
        res.galaxies.should.have.length(10);
      });

      it('should return brightest B-band galaxies', function() {
        const brightest_pgcs = [2260, 3247, 3735, 4539, 4585, 4898, 5273, 6628, 6728, 6750];
        arrayEqual(res.pgcs, brightest_pgcs).should.be.true;
      });
    });
  });
}
