#pragma once
#include <cmath>

inline void calc_mandelbrot(double& zx, double& zy, double cx, double cy, double zx2, double zy2) {
    zy = 2.0 * zx * zy + cy;
    zx = zx2 - zy2 + cx;
}

inline void calc_burning_ship(double& zx, double& zy, double cx, double cy, double zx2, double zy2) {
    zy = -2.0 * std::abs(zx * zy) + cy;
    zx = zx2 - zy2 + cx;
}

inline void calc_julia(double& zx, double& zy, double cx, double cy, double zx2, double zy2) {
    zy = 2.0 * zx * zy + cy;
    zx = zx2 - zy2 + cx;
}