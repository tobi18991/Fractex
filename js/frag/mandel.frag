// Turn double precision on if possible
#extension GL_ARB_gpu_shader_fp64: enable
#pragma optionNV(fastmath off)
#pragma optionNV(fastprecision off)

// Higher precision for float
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

// Steps after which a number (pixel) will be sorted to the julia set
#define MAX_STEPS 500

uniform vec2 dimension;
uniform vec2 theme;
uniform vec2 move;
uniform vec2 zoom;

/*
 * Load Color Function
 * ===================
 *
 * Calculates the color for the specific pixel that will
 * be rendered by this shader
 */
vec4 loadColor(int steps)
{
    float a, b, c;

	// Increase the steps to show more colors in the fractal
	steps *= 16;

	float color = float(steps) - (765.0 * floor(float(steps)/765.0));

	if (color < 256.0)
	{
		a = color / 255.0;
		b = 0.0;
		c = 0.0;
	}
	else if (color < 511.0)
	{
		a = 1.0;
		b = (color - 255.0) / 255.0;
		c = 0.0;
	}
	else
	{
		a = 1.0;
		b = 1.0;
		c = (color - 510.0) / 255.0;
	}

	// Show colors depending on the chosen theme
    if (theme.x == 1.0)
        return vec4(a, b, c, 1.0);
    else if (theme.x == 2.0)
        return vec4(c, b, a, 1.0);
    else
        return vec4(b, a, c, 1.0);

}

/*
 * Main Function
 * =============
 *
 * Execudes the calculation for the mandelbrot. This will
 * use the normal x^2+c function to generate the fractal.
 */
void main()
{
	vec2 z;
	int steps;
	float x = 0.0, y = 0.0;

	// Zero Points (x-/y-achsis)
	float nX = dimension.x / 1.5;
	float nY = dimension.y / 2.0;

	// x- and y-coordinate of the specific pixel in the canvas
	float pX = (4.0/zoom.x/dimension.x)*(nX-gl_FragCoord.x)*(-1.0);
	float pY = (3.0/zoom.y/dimension.y)*(nY-gl_FragCoord.y);

	// Add the move
	pX += move.x;
	pY += move.y;

	// Iterate the function x^2+c
	for (int i = 1; i <= MAX_STEPS; i++)
	{
		steps = i;

		z.x = x*x - y*y + pX;
		z.y = 2.0*x*y + pY;

		// See the definition of the mandelbrot set to understand this condition
		if (z.x*z.x + z.y*z.y > 4.0)
			break;

		// Overwrite the x- and y-coordinates for the next iteration
		x = z.x;
		y = z.y;
	}

	// true: pixel (number) corespndes to the julia set
	if (steps == MAX_STEPS)
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	else
		gl_FragColor = loadColor(steps);
}