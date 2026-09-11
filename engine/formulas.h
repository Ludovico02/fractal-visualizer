#pragma once
#include <cmath> // Required for Burning Ship's absolute values

// 0: Mandelbrot Polynomial
inline void calc_mandelbrot(double& zx, double& zy, double cx, double cy, double zx2, double zy2) {
    zy = 2.0 * zx * zy + cy;
    zx = zx2 - zy2 + cx;
}

// 1: Burning Ship Polynomial
inline void calc_burning_ship(double& zx, double& zy, double cx, double cy, double zx2, double zy2) {
    zy = 2.0 * std::abs(zx * zy) + cy;
    zx = zx2 - zy2 + cx;
}