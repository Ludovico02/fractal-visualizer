#include <emscripten/emscripten.h>
#include "formulas.h"

const int MAX_ITER = 1000;
double orbit_data[MAX_ITER * 2];

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    double *calculateReferenceOrbit(double cx, double cy, int max_iter, int fractal_type = 0)
    {
        if (max_iter > MAX_ITER)
        {
            max_iter = MAX_ITER;
        }

        for (int i = 0; i < max_iter; i++)
        {
            orbit_data[i * 2] = 0.0;
            orbit_data[i * 2 + 1] = 0.0;
        }

        double zx = 0.0;
        double zy = 0.0;

        for (int i = 0; i < max_iter; i++)
        {
            orbit_data[i * 2] = zx;
            orbit_data[i * 2 + 1] = zy;

            double zx2 = zx * zx;
            double zy2 = zy * zy;

            if (zx2 + zy2 > 4.0) break;

            // if (fractal_type == 1) {
            //     calc_burning_ship(zx, zy, cx, cy, zx2, zy2);
            // } else {
            //     calc_mandelbrot(zx, zy, cx, cy, zx2, zy2); // Default to Mandelbrot
            // }

            zy = 2.0 * zx * zy + cy;
            zx = zx2 - zy2 + cx;
        }

        return orbit_data;
    }
}