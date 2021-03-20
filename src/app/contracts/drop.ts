import { Basejumper } from './jumper';

export class Drop {
  get participants(): Basejumper[] {
    return this._participants;
  }

  get isRegistrationOpen(): boolean {
    return new Date() <= this._startingTime;
  }

  private readonly _height: number;
  private readonly _width: number;
  private readonly _startingTime: Date;

  private _participants: Basejumper[] = [];

  constructor(height: number, width: number, startingTime: Date) {
    this._height = height;
    this._width = width;
    this._startingTime = startingTime;
  }

  addJumper(newJumper: Basejumper): void {
    if (this.isRegistrationOpen) {
      this._participants.push(newJumper);
    }
  }
}
