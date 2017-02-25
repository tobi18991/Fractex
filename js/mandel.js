$(function () {
	if (PIXI.utils.isWebGLSupported())
	{
		startWebGL();

		$(window).resize(function () {
			canvas.view.width = $fractal.width();
			canvas.view.height = $fractal.height();
		});

		$('#mandel_draw').click(function () {
			renderFractal();

			$('#overlay').hide();

			$('#mandel_move_left').click(function() {
				moveMandel(-1, 0);
			});

			$('#mandel_move_right').click(function () {
				moveMandel(1, 0);
			});

			$('#mandel_move_up').click(function () {
				moveMandel(0, -1);
			});

			$('#mandel_move_down').click(function () {
				moveMandel(0, 1);
			});

			$('#mandel_zoom_in').click(function () {
				zoomInMandel(2);
			});

			$('#mandel_zoom_out').click(function () {
				zoomOutMandel(2);
			});

			$('#mandel_reset').click(function () {
				reset();
			});

			$('#mandel_theme').change(function () {
				changeTheme($(this).val());
			});
		});
	}
	else
	{
		alert('Dein Browser unterstützt leider kein WebGL!');
	}
});

function renderFractal()
{
	var theme = $('#mandel_theme').val();

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
		theme: {
			type: '2fv',
			value: [theme, 0.0]
		}
	};

	PIXI.loader.add('js/frag/mandel.frag');
	PIXI.loader.load(function () {
		var fragmentCode = PIXI.loader.resources['js/frag/mandel.frag'].data;
		var fragmentShader = new PIXI.Filter('', fragmentCode, uniform);

		rectangle.filters = [fragmentShader];

		animate();
	});
}

function moveMandel(x, y)
{
	var zoom = uniform.zoom.value;

	uniform.move.value[0] += x / zoom[0];
	uniform.move.value[1] += y / zoom[1];
}

function zoomInMandel(z)
{
	uniform.zoom.value[0] *= z;
	uniform.zoom.value[1] *= z;
}

function zoomOutMandel(z)
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