awm
=============

Alfred Workflow Manager, using packal.org

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
    info <workflow>        Workflow general information
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

# License

Copyright (c) 2014 Jonathan Wiesel

[MIT License](http://jonathanwiesel.mit-license.org/)
