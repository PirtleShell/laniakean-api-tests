
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {
  describe('commonNames', function() {
    let res;
    before(function(done) {
      get('?pgc=50063', function(output) {
        res = output;
        done();
      });
    });

    it('return as array', function() {
      res.galaxies[0].should.have.property('commonNames');
      res.galaxies[0]['commonNames'].should.be.a('array');
      res.galaxies[0]['commonNames'].should.have.length(1);
      res.galaxies[0]['commonNames'][0].should.equal('Pinwheel Galaxy');
    });

    describe('galaxy with no common name', function (){
      let res;
      before(function(done) {
        get('?pgc=4', function(output) {
          res = output;
          done();
        });
      });

      it('has empty array', function() {
        res.galaxies[0].should.have.property('commonNames');
        res.galaxies[0]['commonNames'].should.be.a('array');
        res.galaxies[0]['commonNames'].should.have.length(0);
      });
    });

    describe('=false', function (){
      let res;
      before(function(done) {
        get('?commonNames=false', function(output) {
          res = output;
          done();
        });
      });

      it('should not have commonNames object', function() {
        res.galaxies[0].should.not.have.property('commonNames');
      });
    });
  });
};
