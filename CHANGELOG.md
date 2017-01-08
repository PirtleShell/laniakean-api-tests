# API CHANGELOG

## 8 January 2017

I rewrote how the main API builds data queries to make it easier to extend. Also started adding more functionality.

* `list_fields`
* `list=true -> list_pgcs=true`
  * requires changes: `db.py`
  - [ ] documentation
  - [ ] testing
* `list_pgcs` returns just array
  - [ ] documentation
  - [ ] testing
* `pgc=` only returns galaxy object
  * requires changes: `galaxy-detail.md`/`controllers.js`
  - [ ] documentation
  - [ ] testing
* `pgc=`not found - returns error object
  * requires changes: galaxy not found 404 handling
  - [ ] documentation
  - [ ] testing
* stopped supporting `sort-by` (as alias for `sort_by`)
  - [ ] documentation
  - [ ] testing
* sort, limit, and offset for `list_pgc` and `explorer`
  - [ ] documentation
  - [ ] testing
* `defaults=false` - turns off defaults
  - [ ] documentation
  - [ ] testing
* `all_fields=true`
  - [ ] documentation
  - [ ] testing
* accept list of fields - `add_fields=`, `remove_fields=`
  - [ ] documentation
  - [ ] testing


# MORE TO CHANGE

* change the default galaxy object
* query by region

# MORE TO TEST

- [ ] all data options
- [ ] sort
- [ ] sort_by
- [ ] pagination
