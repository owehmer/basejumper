import * as Matter from 'matter-js';

export class Basejumper {
  private static BASEJUMPER_ID = 0;

  get id(): number {
    return this._id;
  }

  get height(): number {
    return this._height;
  }

  get width(): number {
    return this._width;
  }

  get color(): string {
    return this._color;
  }

  get name(): string {
    return this._name;
  }

  get weight(): number {
    return this._weight;
  }

  get body(): Matter.Body | undefined {
    return this._body ?? undefined;
  }

  private readonly _id: number;
  private readonly _height: number;
  private readonly _width: number;
  private readonly _color: string;
  private readonly _name: string;
  private readonly _weight: number;

  private _body: Matter.Body | null = null;
  private _world: Matter.World | null = null;

  constructor(name: string, height: number, width: number, color: string) {
    this._id = Basejumper.BASEJUMPER_ID++;
    this._height = height;
    this._width = width;
    this._color = color;
    this._name = name;
    this._weight = 100;
  }

  attachMatterBody(world: Matter.World): void {
    this._body = Matter.Bodies.rectangle(0, 0, this.width, this.height);
    this._body.friction = 0.1;
    this._body.frictionAir = 0;

    Matter.Body.setMass(this._body, this.weight);
    Matter.World.add(world, this._body);
  }

  detachMatterBody(): void {
    const world = this._world;
    const body = this._body;

    if (world === null || body === null) {
      throw new Error('You need to initiate the body first!');
    }
    Matter.World.remove(world, body);
    this._body = null;
    this._world = null;
  }

}
