var fs = require('fs'),
    p = require('path');

module.exports = function (ddoc_dir) {
    function objFromDir(dir) {
        var obj = {},
            files = fs.readdirSync(dir);
        files.forEach(function (file) {
            var path = p.join(dir,file),
                type = fs.statSync(path);
            if (file[0] === '.' || file[0] === '_') return;
            else if (type.isDirectory() && file !== 'packages') {
                obj[file] = objFromDir(path);
            } else if (type.isFile()) {
                var data = fs.readFileSync(path, 'utf8');
                if (p.extname(file) === '.js') {        // eval(-ish…actually has to handle bare `function () {}` *and* CommonJS modules!)
                    // hack from https://github.com/iriscouch/couchjs/blob/71335aac1901a279aff213973f5508b0bc241e31/couchjs.js#L79
                    data = data.replace(/;+$/, '');
                    // TODO: we'll still bork on multi-statement modules, probably need separate codepaths for each style
                    
                    var module = {exports:{}};
                    obj[p.basename(file,'.js')] = Function('require', 'module', 'exports', "return ("+data+");")(function (module) {
                        return require(p.join(ddoc_dir,module));
                    }, module, module.exports) || module.exports;
                } else if (p.extname(file) === '.json') {
                    obj[p.basename(file,'.json')] = JSON.parse(data);
                } else {
                    obj[file] = data;
                }
            } else {
                console.warn("Skipping ", path);
            }
        });
        return obj;
    }
    return objFromDir(ddoc_dir);   
}