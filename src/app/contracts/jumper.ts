import { randomIntFromInterval } from '../helper/math';

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

  private readonly _id: number;
  private readonly _height: number;
  private readonly _width: number;
  private readonly _color: string;
  private readonly _name: string;
  private readonly _weight: number;

  private _htmlElement: HTMLElement | null = null;

  constructor(name: string, height: number, width: number, color: string) {
    this._id = Basejumper.BASEJUMPER_ID++;
    this._height = height;
    this._width = width;
    this._color = color;
    this._name = name;
    this._weight = randomIntFromInterval(1, 10);
  }

  attachElement(htmlElement: HTMLElement): void {
    this._htmlElement = htmlElement;
  }

  detachElement(): void {
    this._htmlElement = null;
  }

  getRect(): DOMRect {
    if (this._htmlElement === null) {
      throw new Error('Could not found attached HTML Element for ' + this._name);
    }
    return this._htmlElement.getBoundingClientRect();
  }

}
