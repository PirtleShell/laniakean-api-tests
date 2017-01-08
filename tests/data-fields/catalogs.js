
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {
  describe('catalogs', function() {
    let res;
    before(function(done) {
      get('?pgc=42637', function(output) {
        res = output;
        done();
      });
    });

    it('returns object with proper catalogs', function() {
      const whale_catalogs = {
        ngc: '4631',
        ugc: '7865',
        arp: 281,
        sdss: 'J124207.23+323235.0'
      };
      res.galaxies[0].should.have.property('catalogs');
      res.galaxies[0]['catalogs'].should.be.a('object');
      res.galaxies[0]['catalogs'].should.deep.equal(whale_catalogs);
    });

    describe('=false', function (){
      let res;
      before(function(done) {
        get('?catalogs=false', function(output) {
          res = output;
          done();
        });
      });

      it('should not have catalogs', function() {
        res.galaxies[0].should.not.have.property('catalogs');
      });
    });
  });
};
