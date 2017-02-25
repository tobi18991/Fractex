#extension GL_ARB_gpu_shader_fp64: enable

#pragma optionNV(fastmath off)
#pragma optionNV(fastprecision off)

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

#define MAX_STEPS 500

uniform vec2 dimension;

uniform vec2 move;
uniform vec2 zoom;

uniform vec2 theme;

vec4 loadColor(int steps)
{
    float a, b, c;

	steps *= 16; // Vergößerung der Farbenvielfalt

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

	// Je nach Theme Farben angeben
    if (theme.x == 1.0)
        return vec4(a, b, c, 1.0);
    else if (theme.x == 2.0)
        return vec4(c, b, a, 1.0);
    else
        return vec4(b, a, c, 1.0);

}

void main()
{
	vec2 z;
	int steps;
	float x = 0.0, y = 0.0;

	float nX = dimension.x / 1.5;
	float nY = dimension.y / 2.0;

	float pX = (4.0/zoom.x/dimension.x)*(nX-gl_FragCoord.x)*(-1.0);
	float pY = (3.0/zoom.y/dimension.y)*(nY-gl_FragCoord.y);

	pX += move.x;
	pY += move.y;

	for (int i = 1; i <= MAX_STEPS; i++)
	{
		steps = i;

		z.x = x*x - y*y + pX;
		z.y = 2.0*x*y + pY;

		if (z.x*z.x + z.y*z.y > 4.0)
			break;

		x = z.x;
		y = z.y;
	}

	if (steps == MAX_STEPS)
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	else
		gl_FragColor = loadColor(steps);
}