#include <emscripten/emscripten.h>
#include "formulas.h"
#include <cstring>

const int MAX_ITER = 1000;
double orbit_data[MAX_ITER * 2];

typedef void (*FractalFormula)(double &, double &, double, double, double, double);

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    double *calculateReferenceOrbit(double start_zx, double start_zy, double cx, double cy, int max_iter, const char *fractal_name)
    {
        if (max_iter > MAX_ITER)
        {
            max_iter = MAX_ITER;
        }

        FractalFormula active_formula = calc_mandelbrot;
        if (std::strcmp(fractal_name, "burning_ship") == 0)
        {
            active_formula = calc_burning_ship;
        }
        else if (std::strcmp(fractal_name, "julia") == 0)
        {
            active_formula = calc_julia;
        }

        for (int i = 0; i < max_iter; i++)
        {
            orbit_data[i * 2] = 0.0;
            orbit_data[i * 2 + 1] = 0.0;
        }

        // double zx = 0.0;
        // double zy = 0.0;

        double zx = start_zx;
        double zy = start_zy;

        for (int i = 0; i < max_iter; i++)
        {
            orbit_data[i * 2] = zx;
            orbit_data[i * 2 + 1] = zy;

            double zx2 = zx * zx;
            double zy2 = zy * zy;

            if (zx2 + zy2 > 4.0)
                break;

            active_formula(zx, zy, cx, cy, zx2, zy2);
        }

        return orbit_data;
    }
}