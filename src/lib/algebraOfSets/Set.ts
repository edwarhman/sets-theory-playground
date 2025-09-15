export abstract class BaseSet {
    abstract execute(): BaseSet;
    abstract getMin(): number;
    abstract getMax(): number;
    abstract contains(value: number): boolean;
    abstract contains(value: BaseSet): boolean;
    abstract isVoid(): boolean;
    abstract toString(): string;
}

export class FiniteSet extends BaseSet {
  private min: number;
  private max: number;

  constructor(min: number, max: number) {
    super();
    this.min = min;
    this.max = max;
  }

  execute(): BaseSet {
    return this;
  }

  getMin(): number {
    return this.min;
  }

  getMax(): number {
    return this.max;
  }

  isVoid(): boolean {
    return this.min > this.max;
  }

  contains(value: number | BaseSet): boolean {
    if (typeof value === "number") {
      return value >= this.min && value <= this.max;
    } else {
      return value.getMin() >= this.min && value.getMax() <= this.max;
    }
  }

  toString(): string {
    return `[${this.min}, ${this.max}]`;
  }
}
