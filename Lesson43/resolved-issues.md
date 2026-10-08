1. npx prisma contract emit did not work in ecom app
Cause:
npx prisma contract emit succeeds now. The failure came from a version mismatch: the Prisma CLI was 8.0.0-rc.22, which requires a spec function on every enum block, while @prisma/orm-mongo was still 8.0.0-rc.9-dev.13 and did not provide one.

@prisma/orm-mongo is now 8.0.0-rc.17, the latest release, and it matches the CLI's toolchain. 8.0.0-rc.21 from package.json is not published. The emit wrote src/prisma/contract.json and src/prisma/contract.d.ts.

Resolution: 
Replace "@prisma/orm-mongo": "^8.0.0-rc.21", is package.json with 
"@prisma/orm-mongo": "^8.0.0-rc.17",

After resolcing this issue, I also got another issue with a build process so had to update nex.config.ts file (see the file in the project,code below was added):
```
  // Turbopack mis-wraps the CJS Mongo connection-string helper, so
  // `new ConnectionString()` throws and Prisma reports an invalid URL.
  serverExternalPackages: [
    '@prisma/orm-mongo',
    '@prisma/orm-family-mongo',
    '@prisma/orm-target-mongo',
    '@prisma/orm-framework',
    'mongodb-connection-string-url',
    'whatwg-url',
    'mongodb',
  ],

  ```
    