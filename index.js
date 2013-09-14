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
                var data = fs.readFileSync(path);
                if (p.extname(file) === '.js') {        // eval
                    obj[p.basename(file,'.js')] = Function("return ("+data+");")();
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