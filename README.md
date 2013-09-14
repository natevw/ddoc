# ddoc

This is a little node.js helper that lets you include local CouchDB design documents (from the filesystem, in [traditional couchapp](http://couchapp.org/page/filesystem-mapping) format) into your node.js projects.

## Usage

    var couchapp = require('ddoc')("./a_traditional_couchapp");
    
    try {
        couchapp.validate_doc_update(/* … */);
    } catch (e) {
        // …
    }

Basically, it's like "require" but for a CouchApp folder structure instead of a CommonJS module.

## Caveats

I built this to help me transition an app from a very CouchDB-heavy architecture to one where node.js did more of the work. This way I could re-use filters and validators and stuff from the old CouchApp as it sat.

CommonJS support is pretty simplistic, and may not match either the spec and/or CouchDB's implementation well. There's also a somewhat fragile workaround for handling "valid module code" versus "anonymous function strings" (e.g. view/map/list/etc.) in place — this workaround simply mucks around with the first match of any string like `"function ("` which will not cover all possible cases i.e. occurences within comments/strings.

Attachments aren't loaded, ideally they'd get stubbed in like a default ?attachments=false doc fetch does.