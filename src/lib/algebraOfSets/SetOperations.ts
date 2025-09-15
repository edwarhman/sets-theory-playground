import { BaseSet, FiniteSet } from "./Set";
import { CompoundSet } from "./CompoundSet";
import { EMPTY_SET } from "./constants";

export class Union extends CompoundSet {
  constructor(sets: BaseSet[]) {
    super(sets);
  }

  isVoid(): boolean {
    const executedSet = this.execute();
    if (executedSet instanceof CompoundSet) {
      return executedSet.sets.every((set) => set.isVoid());
    }
    return executedSet.isVoid();
  }

  execute(): BaseSet {
    const executedSets = this.sets.map((set) => set.execute());
    const flatSets: BaseSet[] = [];
    for (const s of executedSets) {
      if (s instanceof Union) {
        flatSets.push(...s.sets);
      } else {
        flatSets.push(s);
      }
    }
    flatSets.sort((a, b) => a.getMin() - b.getMin());
    const merged: BaseSet[] = [];
    for (const s of flatSets) {
      if (merged.length === 0) {
        merged.push(s);
      } else {
        const last = merged[merged.length - 1];
        if (last.getMax() >= s.getMin() - 1e-9) {
          const newMin = Math.min(last.getMin(), s.getMin());
          const newMax = Math.max(last.getMax(), s.getMax());
          merged[merged.length - 1] = new FiniteSet(newMin, newMax);
        } else {
          merged.push(s);
        }
      }
    }
    if (merged.length === 0) {
      return EMPTY_SET;
    } else if (merged.length === 1) {
      return merged[0];
    } else {
      return new Union(merged);
    }
  }

  toString(): string {
    return `Union(${this.sets.map((s) => s.toString()).join(', ')})`;
  }
}

export class Intersection extends CompoundSet {
  constructor(sets: BaseSet[]) {
    super(sets);
  }

  isVoid(): boolean {
    return this.execute().isVoid();
  }

  execute(): BaseSet {
    const executedSets = this.sets.map((set) => set.execute());
    return this.intersection(executedSets);
  }

  private intersection(sets: BaseSet[]): BaseSet {
    if (sets.length === 0) {
      return EMPTY_SET;
    }
    let result = sets[0];
    for (let i = 1; i < sets.length; i++) {
      const s = sets[i];
      if (result instanceof Union) {
        const newSets: BaseSet[] = [];
        for (const subset of result.sets) {
          const inter = this.binaryIntersection(subset, s);
          if (!inter.isVoid()) {
            newSets.push(inter);
          }
        }
        if (newSets.length === 0) {
          return EMPTY_SET;
        }
        result = newSets.length > 1 ? new Union(newSets) : newSets[0];
      } else if (s instanceof Union) {
        const newSets: BaseSet[] = [];
        for (const subset of s.sets) {
          const inter = this.binaryIntersection(result, subset);
          if (!inter.isVoid()) {
            newSets.push(inter);
          }
        }
        if (newSets.length === 0) {
          return EMPTY_SET;
        }
        result = newSets.length > 1 ? new Union(newSets) : newSets[0];
      } else {
        result = this.binaryIntersection(result, s);
        if (result.isVoid()) {
          return EMPTY_SET;
        }
      }
    }
    return result;
  }

  toString(): string {
    return `Intersection(${this.sets.map((s) => s.toString()).join(', ')})`;
  }
}
