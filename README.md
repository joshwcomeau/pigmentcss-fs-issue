# PigmentCSS issue with Node builtins

This example repo tries to load a local fine using the Node `fs` module. When I run a dev server or build for production, I get the following error:

> EvalError: Unable to import "fs/promises". Importing Node builtins is not supported in the sandbox. in/Users/joshu/work/temp/pigment-fs-issue/src/content.helpers.ts

As a general rule, we can't access Node builtins like `fs/promises` in the browser, but I'm calling this method exclusively from `/src/app/page.tsx`, which is a Server Component; none of this JS is shipped to the client.
