# Code blocks

»Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem 
gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat.

## Bash/Shell

```bash
$ npm install piedmont --save-dev
```

```shell
$ npm i -D piedmont
```

## Javascript

```javascript
'use strict';

var glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    parser = require('parser'),
    Nomnom;
    
Nomnom = function () {
    this.comments = {};
    this.files = [];
};

Nomnom.prototype.parse = function (pattern) {
    var comments = {};
    this.files = glob.sync(pattern);

    this.files.forEach(function (absPath) {
        var fileContent = fs.readFileSync(absPath, 'utf8'),
            relativePath = path.relative('./', absPath);

        comments[relativePath] = parser.parse(fileContent);
    });

    this.comments = comments;

    return this.comments;
};
```
 