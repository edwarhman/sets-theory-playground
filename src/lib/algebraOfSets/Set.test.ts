import { FiniteSet } from './Set';
import { EMPTY_SET, UNIVERSE } from './constants';
import { describe, it, expect } from 'bun:test';

describe('FiniteSet', () => {
  it('should handle equality correctly', () => {
    const set1 = new FiniteSet(1, 2);
    const set2 = new FiniteSet(1, 2);
    const set3 = new FiniteSet(1, 3);
    const set4 = new FiniteSet(2, 3);
    const set5 = new FiniteSet(3, 4);

    expect(set1.equals(set2)).toBe(true);
    expect(set1.equals(set3)).toBe(false);
    expect(set1.equals(set4)).toBe(false);
    expect(set1.equals(set5)).toBe(false);

    expect(EMPTY_SET.equals(new FiniteSet(Infinity, -Infinity))).toBe(true);
    expect(UNIVERSE.equals(new FiniteSet(-Infinity, Infinity))).toBe(true);
    expect(UNIVERSE.equals(UNIVERSE)).toBe(true);
    expect(EMPTY_SET.equals(EMPTY_SET)).toBe(true);
  });

  it('should handle isVoid correctly', () => {
    expect(EMPTY_SET.isVoid()).toBe(true);
    expect(new FiniteSet(-20, 50).isVoid()).toBe(false);
  });

  it('should handle contains correctly', () => {
    const set = new FiniteSet(1, 2);
    expect(set.contains(1)).toBe(true);
    expect(new FiniteSet(1, 3).contains(new FiniteSet(1, 2))).toBe(true);
    expect(new FiniteSet(2, 3).contains(new FiniteSet(2, 2))).toBe(true);
    expect(new FiniteSet(0, 4).contains(new FiniteSet(1, 2))).toBe(true);
    expect(new FiniteSet(-10, 4).contains(new FiniteSet(1, 2))).toBe(true);
  });

  it('should handle not contains correctly', () => {
    const set = new FiniteSet(1, 3);
    expect(set.contains(0)).toBe(false);
    expect(new FiniteSet(2, 3).contains(new FiniteSet(1, 2))).toBe(false);
    expect(new FiniteSet(3, 4).contains(new FiniteSet(1, 2))).toBe(false);
  });
});