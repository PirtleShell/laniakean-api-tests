
const globals = require('../globals');
const should = require('chai').should();

module.exports = get => {

  describe('list_fields', function() {
    let res;
    before(function(done) {
      get('?list_fields=true', function(output) {
        res = output;
        done()
      });
    });

    it('returns an array of all fields', function() {
      res.should.deep.equal(globals.DATA_FIELDS);
    });
  });

  describe('list_pgcs', function() {

    describe('= true, without limit or sort', function() {
      let res;
      before(function(done) {
        get('?list_pgcs=true', function(output) {
          res = output;
          done();
        });
      });

      it('defaults to an array of all galaxies sorted by pgcs', function() {
        res.should.be.a('array');
        res.should.have.length(globals.TOTAL_GALAXIES);
        res[0].should.equal(4);
        res[globals.TOTAL_GALAXIES - 1].should.equal(9003164);
      });
    });

    describe('= true, with limit', function() {
      let res;
      before(function(done) {
        get('?list_pgcs=true&limit=10', function(output) {
          res = output;
          done();
        });
      });

      it('returns array of proper length', function() {
        const first_pgcs = [4, 27, 40, 51, 55, 64, 66, 70, 76, 82];
        res.should.deep.equal(first_pgcs);
      });
    });

    describe('!= true', function() {
      let res;

      before(function(done) {
        get('?list_pgcs=false', function(output) {
          res = output;
          done();
        });
      });

      it('returns error', function() {
        res.should.have.property('error');
        res.error.should.equal('Expected list_pgcs=true.');
      });
    })
  });
}
