var canvas;
var scene;
var rectangle;

var $fractal;

var uniform = {};

$(function () {
	if (PIXI.utils.isWebGLSupported())
	{
		startWebGL();

		$(window).resize(function () {
			canvas.view.width = $fractal.width();
			canvas.view.height = $fractal.height();
		});

		$('#julia_draw').click(function () {
			renderFractal();

			$('#overlay').hide();

			$('#julia_move_left').click(function() {
				moveJulia(-1, 0);
			});

			$('#julia_move_right').click(function () {
				moveJulia(1, 0);
			});

			$('#julia_move_up').click(function () {
				moveJulia(0, -1);
			});

			$('#julia_move_down').click(function () {
				moveJulia(0, 1);
			});

			$('#julia_zoom_in').click(function () {
				zoomInJulia(2);
			});

			$('#julia_zoom_out').click(function () {
				zoomOutJulia(2);
			});

			$('#julia_reset').click(function () {
				reset();
			});

			$('#julia_im').change(function () {
				uniform.c.value[1] = $(this).val();
			});

			$('#julia_rel').change(function () {
				uniform.c.value[0] = $(this).val();
			});

			$('#julia_theme').change(function () {
				changeTheme($(this).val());
			});
		});
	}
	else
	{
		alert('Dein Browser unterstützt leider kein WebGL!');
	}
});

function startWebGL()
{
	$fractal = $('#fractal');

	canvas = PIXI.autoDetectRenderer(
		$fractal.width(),
		$fractal.height(),
		{
			antialias: false, transparent: false, resolution: 1
		}
	);

	scene = new PIXI.Container();

	rectangle = new PIXI.Graphics();
	rectangle.beginFill(0x0C0C0C);
	rectangle.drawRect(0, 0, canvas.view.width, canvas.view.height);
	rectangle.endFill();

	scene.addChild(rectangle);

	canvas.render(scene);

	$fractal.append(canvas.view);
}

function animate()
{
	setTimeout(function () {
		canvas.render(scene);

		window.requestAnimationFrame(animate);
	}, 1000/5);
}

function renderFractal()
{
	var cX = $('#julia_rel').val();
	var cY = $('#julia_im').val();

	var theme = $('#julia_theme').val();

	uniform = {
		dimension: {
			type: '2fv',
			value: [canvas.view.width, canvas.view.height]
		},
		move: {
			type: '2fv',
			value: [0.0, 0.0]
		},
		zoom: {
			type: '2fv',
			value: [1.0, 1.0]
		},
		c: {
			type: '2fv',
			value: [cX, cY]
		},
		theme: {
			type: '2fv',
			value: [theme, 0.0]
		}
	};

	PIXI.loader.add('js/frag/julia.frag');
	PIXI.loader.load(function () {
		var fragmentCode = PIXI.loader.resources['js/frag/julia.frag'].data;
		var fragmentShader = new PIXI.Filter('', fragmentCode, uniform);

		rectangle.filters = [fragmentShader];

		animate();
	});
}

function moveJulia(x, y)
{
	var zoom = uniform.zoom.value;

	uniform.move.value[0] += x / zoom[0];
	uniform.move.value[1] += y / zoom[1];
}

function zoomInJulia(z)
{
	uniform.zoom.value[0] *= z;
	uniform.zoom.value[1] *= z;
}

function zoomOutJulia(z)
{
	uniform.zoom.value[0] /= z;
	uniform.zoom.value[1] /= z;
}

function reset() {
	uniform.zoom.value[0] = 1;
	uniform.zoom.value[1] = 1;

	uniform.move.value[0] = 0;
	uniform.move.value[1] = 0;
}

function changeTheme(theme) {
	uniform.theme.value[0] = theme;
	uniform.theme.value[1] = 0.0;
}