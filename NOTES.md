Command to generate js code from cpp code via web assembly using Emscripten.

``` bash
emcc fractal_math.cpp -o engine.js -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -s MODULARIZE=1 -s EXPORT_NAME="createFractalEngine" -s EXPORT_ES6=1
```

``` bash
emcc fractal_math.cpp -o engine.js -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap', 'HEAPF64']" -s EXPORTED_FUNCTIONS="['_calculateReferenceOrbit']" -s MODULARIZE=1 -s EXPORT_NAME="createFractalEngine" -s EXPORT_ES6=1
```

# TODO

- [ ] Make phone user able to move around
- [ ] Fix phone resolution
- [x] Dynamic color palettea
- [x] Back to center button
- [ ] Dynamic centering
- [ ] Add other fractal pertrbations