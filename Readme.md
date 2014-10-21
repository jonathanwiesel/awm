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

    search <keyword>       Search workflows by keyword.
    info <bundleID>        Workflow general information.
    open <bundleID>        Open specified workflow's directory.
    home [bundleID]        Opens the workflow's Packal URL. Or Packal home if none specified.
    list                   List installed workflows.
    outdated               List outdated workflows.
    install <bundleID>     Install specified workflow.
    update                 Update the manifest file from packal.org.
    upgrade [bundleID]     Upgrade the specified package or all outdated ones if none specified.
    remove <bundleID>      Remove specified workflow.
    cleanup                Remove all cached downloads.
    reset                  Reset the manifest file from packal.org.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

# Todo

* Add tests
* Support *real* install workflow (not download and open `.alfredworkflow` file).
* Support *real* upgrade workflows (not download and open `.alfredworkflow` file).
* Support upgrade ALL outdated.
* ~~Support remove workflows.~~
* Support `bundle` installing.

Note: one thing to consider when implementing *real* install and update is the previous stripping and migration of hotkeys and keywords.

# License

Copyright (c) 2014 Jonathan Wiesel

[MIT License](http://jonathanwiesel.mit-license.org/)
