
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

describe('Galaxies API', function() {
  this.timeout(15000);
  const get = getAPI('galaxies/');

  require('./query-options')(get);
  require('./data-fields')(get);
  require('./shorthands')(get);
  require('./special')(get);
});
