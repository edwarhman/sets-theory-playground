import { BaseSet, FiniteSet } from "./Set";

import { EMPTY_SET } from "./constants";

export class CompoundSet extends BaseSet {
  sets: BaseSet[];

  constructor(sets: BaseSet[]) {
    super();
    this.sets = sets;
  }

  public equals(other: BaseSet): boolean {
    if (!(other instanceof CompoundSet)) {
      return false;
    }
    return this.sets === other.sets;
  }

  public execute(): BaseSet {
    const executedSets = this.sets.map((set) => set.execute());
    return new CompoundSet(executedSets);
  }

  public isVoid(): boolean {
    return this.sets.every((set) => set.isVoid());
  }

  public getMin(): number {
    const executedSet = this.execute();
    if (executedSet instanceof CompoundSet) {
      return Math.min(...executedSet.sets.map((set) => set.getMin()));
    }
    return executedSet.getMin();
  }

  public getMax(): number {
    const executedSet = this.execute();
    if (executedSet instanceof CompoundSet) {
      return Math.max(...executedSet.sets.map((set) => set.getMax()));
    }
    return executedSet.getMax();
  }

  public contains(value: number | BaseSet): boolean {
    if (typeof value === "number") {
      return this.sets.some((set) => set.contains(value));
    } else {
      return this.sets.some((set) => set.contains(value));
    }
  }

  public toString(): string {
    return `CompoundSet(${this.sets.map((s) => s.toString()).join(', ')})`;
  }

  public binaryIntersection(A: BaseSet, B: BaseSet): BaseSet {
    const newMin = Math.max(A.getMin(), B.getMin());
    const newMax = Math.min(A.getMax(), B.getMax());

    if (newMin > newMax) {
      return EMPTY_SET;
    }
    return new FiniteSet(newMin, newMax);
  }
}