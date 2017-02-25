var canvas;
var scene;
var rectangle;

var $fractal;

var uniform = {};

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