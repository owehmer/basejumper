import * as Matter from 'matter-js';

export function engineCreator(worldElem: HTMLElement): any {
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

  // create engine
  const engine = Engine.create();
  const world = engine.world;

  // create renderer
  const render = Render.create({
    element: worldElem,
    engine: engine,
    options: {
      width: worldElem.offsetWidth,
      height: worldElem.offsetHeight,
      showVelocity: true,
      showAngleIndicator: true
    } as any
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  World.add(world, [
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
  ]);

  engine.world.gravity.y = -1;

  const stack = Composites.stack(50, 120, 11, 5, 0, 0, (x: number, y: number) => {
    switch (Math.round(Common.random(0, 1))) {

      case 0:
        if (Common.random() < 0.8) {
          return Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50));
        } else {
          return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30));
        }
      case 1:
        return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 50));

    }
    return null;
  });

  World.add(world, stack);

  // add mouse control
  const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      } as any
    });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  (render as any).mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
  });

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    }
  };
}
