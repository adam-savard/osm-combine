# osm-combine

Combine OSM files through `osmconvert` and NodeJS

# Installation

```shell
npm i -g osm-combine
```

# Summary

This is designed to quickly combine `osm.pbf` files without manually writing out the pipe commands or making intermediate files. All you need is a list of files in a JSON array to process. The idea is that, if you have a workflow that demands this kind of process multiple times a day/week, it should save you time.

Simply run `osm-combine` in the directory with `osm-combine.json` and it will process the files, creating a new, combined file in your current working directory.

# Note

This will download `osmconvert` to a `${__dirname}/osmc`, but it will _not_ add it to your $PATH.

# `osm-combine.json`

Below is an example of `osm-combine.json`:

```json
{
  "files": [
    "/path/to/new-brunswick-latest.osm.pbf",
    "/path/to/prince-edward-island-latest.osm.pbf",
    "/path/to/alberta-latest.osm.pbf"
  ]
}
```

Note that these are absolute paths, but relative paths are supported.

# Example command and output:

```shell
osm-combine
```

Outputs:

```
Downloading osmconvert...
Download Completed
Checking for osm-combine.json in current directory
Found a config file!
Spawning session to combine selected files:
/path/to/new-brunswick-latest.osm.pbf
/path/to/prince-edward-island-latest.osm.pbf
/path/to/alberta-latest.osm.pbf
This may take some time...
File will be output to /path/to/region-combined-count-3.osm.pbf
```
