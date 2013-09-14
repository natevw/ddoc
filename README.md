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

Attachments aren't loaded, and I'm pretty sure CommonJS usage within the CouchApp won't behave either. Happy to add those, just don't need them myself at this point.