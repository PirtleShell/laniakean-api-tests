---
title: Galaxy API
description: An API for accessing data and facts about the galaxies of Laniakea. Galaxy distances, brightnesses, velocities & more!
---

# API Reference

This is the documentation to the much under-development API for accessing data used in this project. Although perhaps only applicable to Laniakean Explorer, I hope it can someday be of use to a broader community. Be aware that the API is subject to change.

The API, along with all of Laniakean.com, is available strictly through HTTPS protocol.

For API problems or feature requests, please [raise an issue on GitHub](https://github.com/PirtleShell/laniakean-api-tests/issues) or anonymously submit one on [GitReports](https://gitreports.com/issue/PirtleShell/laniakean-api-tests).

## Table of Contents

- [Galaxies API](#galaxies-api)
  - [Galaxy Objects](#galaxy-objects)
  - [Data Options](#data-options)
  - [Query Options](#query-options)
  - [Shorthand Queries](#shorthand-queries)
  - [Special Queries](#special-queries)
  - [Errors](#errors)
- [Resolve Names API](#resolve-names-api)
- [Galaxy Database Tables](#galaxy-database-tables)
  - [astrometry](#astrometry)
  - [catalogs](#catalogs)
  - [commonNames](#commonnames)
  - [cosmicflows](#cosmicflows)
  - [displayInfo](#displayinfo)
  - [explorer](#explorer)
  - [photos](#photos)

## Galaxies API

The endpoint [`api/v1/galaxies/`](https://laniakean.com/api/v1/galaxies/){target=_self} returns information about the galaxies used in this project. Queries to this API return objects of two arrays: an array of the PGC numbers of the galaxies under the key `pgcs`, and an array of galaxy objects under the key `galaxies`.

### Galaxy Objects

The API transfers galaxy data as objects of attributes which can be explicitly requested by setting [data options](#data-options). The data are all from the [galaxy database tables](#galaxy-database-tables), primarily [cosmicflows](#cosmicflows). All galaxy objects contain the `pgc` of the galaxy. By default, galaxy objects return with the following data fields:

**Example**:
```js
// Commented out values are not yet implemented
// https://laniakean.com/api/v1/galaxies/?pgc=50063
{
  pgcs: [ 50063 ],
  galaxies: [
    {
      pgc: 50063,
      dist: 6.95,
      ra: "140312.6",
      dec: "542056",
      B_mag: 8.36,
      Ks_mag: 5.94,
      vhel: 237,
      catalogs: {
        ngc: '5457',
        messier: '101',
        ugc: '8981',
        arp: 26,
        sdss: 'J140312.52+542056.2'
      },
      commonNames: ['Pinwheel']
    }
  ]
}
```

See the [catalogs table](#catalogs) for more information on the `catalogs` object.

### Data Options

You can control what data fields are in the return object by setting any data field value to `true` or `false`. **Below are the fields returned by default**, but all [data table fields](#datbase-tables) marked as "live" are available if set to `true`.

| Live? | Option        | Description                                      | Default | Return Type                 |
|:------|:--------------|:-------------------------------------------------|:-------:|:----------------------------|
| ✓     | `pgc`         | PGC number of galaxy, always returned            |   ---   | integer                     |
| ✓     | `ra`          | right ascension                                  | `true`  | string                      |
| ✓     | `dec`         | declination                                      | `true`  | string                      |
| ✓     | `dist`        | distance to galaxy in Mpc                        | `true`  | double                      |
| ✓     | `B_mag`       | B-band brightness                                | `true`  | double                      |
| ✓     | `Ks_mag`      | 2MASS Ks-band brightness                         | `true`  | double                      |
| ✓     | `vhel`        | heliocentric velocity                            | `true`  | double                      |
| ✓     | `catalogs`    | Cross references for different galaxy catalogs   | `true`  | [catalog object](#catalogs) |
| ✓     | `commonNames` | array of [common names](#commonnames) for galaxy | `true`  | array of strings            |

### Query Options

These options for modifying queries exist. Use them by adding `option=value` to your query string.

| Live? | Option             | Description                                                       | Default Value |
|:------|:-------------------|:------------------------------------------------------------------|:--------------|
| ✓     | `limit <int>`      | number of galaxies to return or `all` for all galaxies            | `25`          |
| ✓     | `page <int>`       | pagination of data, skips the first `page * limit` galaxies       | `1`           |
| ✓     | `sort_by <string>` | choose a data value by which to sort the output                   | `"pgc"`       |
| ✓     | `sort <string>`    | `"asc"` or `"desc"` (alias `"des"`), sort ascending or descending | `"asc"`       |
| ✓     | `pgc <int>`        | overrides `limit`, returns data for this specific `pgc`           | none          |

### Shorthand Queries

For convenience, these options exist for the quick setting of common queries. These options override `limit`.

| Live? | Option            | Description                                             | Shorthand for                 |
|:------|:------------------|:--------------------------------------------------------|:------------------------------|
| ✓     | `brightest <int>` | returns number of brightest galaxies (B-band magnitude) | `sort_by=B_mag&limit={value}` |
| ✓     | `closest <int>`   | returns closest galaxies                                | `sort_by=dist&limit={value}`  |

The default `sort` for all queries is ascending, so the shorthand queries are all from lowest to highest. Thus to get the dimmest or furthest galaxies you can add `sort=desc` to your `brightest` or `closest` requests. Remember that [the magnitude scale](/determining-galaxy-distances#magnitude-scale) gets dimmer as the number increases.

### Special Queries

These queries are also available. They do not return standard galaxy objects.

| Live? | Option            | Description                                                       | Default `limit` |
|:------|:------------------|:------------------------------------------------------------------|:----------------|
| ✓     | `list <bool>`     | just returns `pgcs` array, no `galaxies` data                     | `"all"`         |
| ✓     | `explorer <bool>` | returns object of `x`, `y`, `z` starting position under `pgc` key | `"all"`         |

### Errors

When something goes wrong or for invalid requests, an object containing only an `error` key is returned.

**Examples:**

`sort` is for the order, `sort_by` is for the field.

```js
// https://laniakean.com/api/v1/galaxies/?sort=dist
{
  error: "Unrecognized sort option. Expected 'asc' or 'desc'. Did you mean 'sort_by'?"
}
```

Valid queries that do not return results do not return an error, but rather, empty lists. For example, PGC 1 is not in the database.

```js
// https://laniakean.com/api/v1/galaxies/?pgc=1
{
  pgcs: [],
  galaxies: []
}
```

-------

## Resolve Names API

A temporary endpoint is available at `api/v1/resolveNames/` to resolve galaxy names for the [AladinLite](http://aladin.u-strasbg.fr/AladinLite) viewer on the galaxy pages. It is simply an SSL-enabled relay for the [Centre de Données astronomiques de Strasbourg](http://cds.u-strasbg.fr/)'s service [Sesame](http://cds.u-strasbg.fr/cgi-bin/Sesame). Efforts to make AladinLite work under an https protocol are underway at the CDS, but for now this relay will have to suffice. My SSL-enabled rewrite of AladinLite, along with the source code for the relay is available on [GitHub](https://github.com/PirtleShell/AladinLite).

It takes the same queries as the original.

**Examples:**
```js
// https://laniakean.com/api/v1/resolveNames/?object=sombrero+galaxy
getSesame({
  Target: {
    name: "sombrero galaxy",
    Resolver: {
      name: "Su=Simbad (via url)",
      INFO: "from cache",
      oid: 1971559,
      oname: "M 104",
      otype: "LIN",
      jpos: "12:39:59.43 -11:37:22.9",
      jradeg: 189.997632708,
      jdedeg: -11.623054278,
      refPos: "2004AJ....127.3587F",
      errRAmas: 0.054,
      errDEmas: 2.310,
      Vel: { "v": 1090},
      MType: "Sa",
      nrefs: 1123
    }
  }
});

// https://laniakean.com/api/v1/resolveNames/?object=not+a+galaxy
getSesame({
  Target: {
    name: "not a galaxy",
    INFO: "*** Nothing found ***"
  }
});
```

-------

## Galaxy Database Tables

Documentation for database tables. The fields marked "Live" are accessible through the Galaxies API by simply adding `field=true` to the request (with the exception of the `explorer` data). For example, `api/v1/galaxies/?a=true` would add `a`, the major-axis field, to the returned galaxy data.

### astrometry:

Measurements of various other attributes of galaxies. Most data from [SIMBAD](http://simbad.u-strasbg.fr/simbad/).

| Live? | Data Field           | Description                                |
|:------|:---------------------|:-------------------------------------------|
| ✓     | `pgc <int>`          | Primary Galactic Catalog Number (aka LEDA) |
|       | `a <double>`         | major axis in arcseconds                   |
|       | `b <double>`         | minor axis in arcseconds                   |
|       | `inc <double>`       | inclination angle in degrees               |
|       | `mtype <string>`     | morphological type                         |
|       | `dim_bib <string>`   | bibliographic info for `a`,`b`, & `inc`    |
|       | `mtype_bib <string>` | bibliographic info for `mtype`             |

### catalogs:

Cross-reference names to a few catalogs of galaxies. These catalogs are chosen because it's likely people would search by them, and because if they are in these, they're more likely to look awesome. By default, this data is returned for each galaxy as a `catalogs` object. Turn off this data by setting `catalogs=false`. **Note that all return values are strings except `arp`, as it is the only catalog with an index guaranteed to be an integer.**

| Live? | Data Field         | Description                                          |
|:------|:-------------------|:-----------------------------------------------------|
| ✓     | `pgc <int>`        | Primary Galactic Catalog Number (aka LEDA)           |
| ✓     | `ngc <string>`     | New General Catalog of Nebulae and Clusters of Stars |
| ✓     | `ugc <string>`     | Uppsala General Catalog                              |
| ✓     | `messier <string>` | Messier catalog                                      |
| ✓     | `arp <int>`        | Arp Peculiar Galaxy Catalog                          |
| ✓     | `sdss <string>`    | Sloan Digital Sky Survey                             |

A `catalogs` object has the above fields (except `pgc`) as keys with their appropriate values, when applicable. Because only applicable values are shown, a galaxy not found in any of the catalogs will have an empty object under its `catalogs` key.

**Examples**:
``` js
// the "catalogs" field of the galaxy object for Triangulum Galaxy (PGC 5818)
// https://laniakean.com/api/v1/galaxies/?pgc=5818
{
  ngc: '598',
  ugc: '1117',
  messier: '33'
}

// the "catalogs" field of the galaxy object for Pinwheel Galaxy (PGC 50063)
// https://laniakean.com/api/v1/galaxies/?pgc=50063
{
  ngc: '5457',
  messier: '101',
  ugc: '8981',
  arp: 26,
  sddss: 'J140312.52+542056.2'
}
```


### commonNames:

List of a bunch of common galaxy names, referenced by PGC number. All names for a given galaxy are returned as an array of strings in each galaxy object by default. For galaxies without common names, an empty array is returned. Turn off this data by setting `commonNames=false`. Names are from [SIMBAD](http://simbad.u-strasbg.fr/simbad/).

**Live?** ✓

| Data Field      | Description                                |
|:----------------|:-------------------------------------------|
| `pgc <int>`     | Primary Galactic Catalog Number (aka LEDA) |
| `name <string>` | common name                                |


### cosmicflows:

Exported from CosmicFlows-3 data in [EDD](http://edd.ifa.hawaii.edu/dfirst.php), originally compiled and published by [Tully, Courtois, & Sorce (2016)](https://arxiv.org/abs/1605.01765).

| Live? | Data Field        | Description                                                                                 |
|:------|:------------------|:--------------------------------------------------------------------------------------------|
| ✓     | `pgc <int>`       | Primary Galactic Catalog Number (aka LEDA)                                                  |
| ✓     | `dist <double>`   | weighted distances                                                                          |
| ✓     | `numDist <int>`   | number of distance measurements                                                             |
| ✓     | `ra <string>`     | J2000 right ascension (hours of arc, minutes of arc, seconds of arc)                        |
| ✓     | `dec <string>`    | J2000 declination (degrees, arcmin, arcsec)                                                 |
| ✓     | `B_mag <double>`  | Total B magnitude from LEDA                                                                 |
| ✓     | `Ks_mag <double>` | 2MASS Ks magnitude, extinction corrected from Huchra et al. 2012 or else Lavaux-Hudson 2011 |
| ✓     | `vhel <double>`   | Heliocentric velocity                                                                       |


### explorer:

Starting positions for explorer. The explorer data is available only from [`api/v1/galaxies/?explorer=true`](https://laniakean.com/api/v1/galaxies/?explorer=true&limit=25){target=_self}. The Milky Way plane is in the x-z plane. Scale is in Mpc.

| Live? | Data Field   | Description                                |
|:------|:-------------|:-------------------------------------------|
| ✓     | `pgc <int>`  | Primary Galactic Catalog Number (aka LEDA) |
| ✓     | `x <double>` | X coordinate                               |
| ✓     | `y <double>` | Y coordinate                               |
| ✓     | `z <double>` | Z coordinate                               |


### photos:

A variety of photo links for pretty galaxies.

| Live? | Data Field        | Description                                |
|:------|:------------------|:-------------------------------------------|
| ✓     | `pgc <int>`       | Primary Galactic Catalog Number (aka LEDA) |
|       | `url <string>`    | URL of photo                               |
|       | `alt <string>`    | photo description                          |
|       | `credit <string>` | photo credit & copyright HTML              |
