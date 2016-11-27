const arrayEqual = require('array-equal');
const should = require('chai').should();

const getAPI = api => {
  return (query, cb) => {
    const url = 'http://laniakean.com/api/v1/' + api + query;
    require('http').get(url, res => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', function() {
        return cb(JSON.parse(body));
      });
    }).on('error', function(e){
      console.log("Error: ", e);
    });
  };
}

const TOTAL_GALAXIES = 17666;
const DEFAULT_DATA = ['pgc', 'dist', 'ra',  'dec', 'B', 'Ks', 'vhel'];

describe('Galaxies API', function() {
  this.timeout(15000);
  const get = getAPI('galaxies/')

  describe('data option queries', function() {
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
        DEFAULT_DATA.forEach(prop => {
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
        res.pgcs.should.have.length(TOTAL_GALAXIES);
        res.galaxies.should.have.length(TOTAL_GALAXIES);
      });
    })
  });

  describe('shorthand queries', function() {

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


  describe('special queries', function() {

    describe('list & explorer', function() {
      let res;
      before(function(done) {
        get('?list=true&explorer=true', function(output) {
          res = output;
          done();
        });
      });

      it('should have error', function() {
        res.should.have.property('error');
        res.error.should.equal("Multiple shorthand or special query parameters found.");
      });
    });

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
          res.pgcs.should.have.length(TOTAL_GALAXIES);
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

        it('return error', function() {
          res.should.have.property('error');
          res.error.should.equal('Expected list=true.')
        });
      })
    });


    describe('explorer', function() {
      describe('= true, without limit or sort', function() {
        let res;
        before(function(done) {
          get('?explorer=true', function(output) {
            res = output;
            done();
          });
        });

        it('returns explorer data', function() {
          res.should.have.property('4');

          res['4'].should.have.property('x');
          res['4'].should.have.property('y');
          res['4'].should.have.property('z');

          res['4'].x.should.equal(38.9467564745);
          res['4'].y.should.equal(32.2720708924);
          res['4'].z.should.equal(-0.000660867213142);
        });

        it('defaults to all galaxies', function() {
          Object.keys(res).should.have.length(TOTAL_GALAXIES);
        });
      });

      describe('= true, with limit', function() {
        let res;
        before(function(done) {
          get('?explorer=true&limit=10', function(output) {
            res = output;
            done();
          });
        });

        it('returns explorer data', function() {
          res.should.have.property('4');

          res['4'].should.have.property('x');
          res['4'].should.have.property('y');
          res['4'].should.have.property('z');

          res['4'].x.should.equal(38.9467564745);
          res['4'].y.should.equal(32.2720708924);
          res['4'].z.should.equal(-0.000660867213142);
        });

        it('queries proper number', function() {
          Object.keys(res).should.have.length(10);
        });
      });

      describe('= false', function() {
        let res;
        before(function(done) {
          get('?explorer=false', function(output) {
            res = output;
            done();
          });
        });

        it('return error', function() {
          res.should.have.property('error');
          res.error.should.equal('Expected explorer=true.')
        });
      })
    });
  });
});
