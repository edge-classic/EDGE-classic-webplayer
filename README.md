# EDGE-classic-webplayer

## Prep

- Build EDGE-Classic Emscripten build with freedoom2.wad and blasphem.wad in the /preload folder. Verify that it works with the test site in the EC repo.
  - Use emsdk vesrion 3.1.51
  - You will need to add the "-sUSE_ES6_IMPORT_META=0" flag to the Emscripten.cmake file in the EC repo
    - This is not present by default because emsdk does not support it anymore
- Place the generated WASM and JS files in the /src folder of this repository
  - They will also need to be copied to the /build folder if doing npm run serve to test

## CLI Commands

- `npm install`: Installs dependencies

- `npm run dev`: Run a development, HMR server

- `npm run serve`: Run a production-like server

- `npm run build`: Production-ready build

- `npm run lint`: Pass TypeScript files using ESLint

- `npm run test`: Run Jest and Enzyme with
  [`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure) for
  your tests

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
