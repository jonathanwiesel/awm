awm
=============

Alfred Workflow Manager, using [packal.org](http://packal.org) by [Shawn Patrick Rice](https://github.com/shawnrice)

# Install

To install `awm` from npm, run:

```
$ npm install -g awm
```

# Usage

```
$ awm -h

Usage: awm [options] [command]

  Commands:

    search <keyword>       Search workflows by keyword
    info <bundleID>        Workflow general information
    home <bundleID>        Opens the workflow's Packal URL.
    list                   List installed workflows.
    outdated               List outdated workflows.
    install <bundleID>     Install specified workflow
    update                 Update the manifest file from packal.org
    cleanup                Remove all cached downloads
    reset                  Reset the manifest file from packal.org

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

# Todo

* Add tests
* Support real install workflow (not download and open).
* Support upgrade workflows.
* Support remove workflows.
* Support `bundle` installing.

# License

Copyright (c) 2014 Jonathan Wiesel

[MIT License](http://jonathanwiesel.mit-license.org/)
