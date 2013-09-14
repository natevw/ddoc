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
                    // HACK: name first anonymous function "found" — even if it's actually in a comment/string/whatnot :-/
                    data = data.replace(/function\s*\(/, "function __anon(");
                    
                    var module = {exports:{}};          // NOTE: probably doesn't handle `module.exports = {}; exports.foo = 42;` like CommonJS would?
                    obj[p.basename(file,'.js')] = Function('require', 'module', 'exports', "var __anon; eval("+JSON.stringify(data)+"); return __anon;")(function (module) {
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