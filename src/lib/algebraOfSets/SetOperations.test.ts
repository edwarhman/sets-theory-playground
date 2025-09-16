import { Union, Intersection, interval, union, intersection, empty, universe } from './SetOperations';
import { describe, it, expect } from 'bun:test';

describe('Intersection', () => {
  it('intersection of identical floatsets returns same', () => {
    const result = intersection(
      interval(1, 2),
      interval(1, 2),
      interval(1, 2)
    ).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('intersection of nested intersection and floatset', () => {
    const result = intersection(
      intersection(interval(1, 2), interval(1, 2)),
      interval(1, 2)
    ).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('intersection of overlapping floatsets', () => {
    const result = intersection(
      interval(1, 3),
      interval(2, 7),
      interval(1, 3)
    ).execute();
    expect(result.toString()).toBe('[2, 3]');
  });

  it('intersection of subset floatsets', () => {
    const result = intersection(
      interval(0, 10),
      interval(4, 6),
      interval(4, 6)
    ).execute();
    expect(result.toString()).toBe('[4, 6]');
  });

  it('intersection of disjoint floatsets is empty', () => {
    const result = intersection(
      interval(0, 2),
      interval(4, 7)
    ).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection with single point overlap', () => {
    const result = intersection(
      interval(4, 7),
      interval(5, 5)
    ).execute();
    expect(result.toString()).toBe('[5, 5]');
  });

  it('intersection with full overlap returns subset', () => {
    const result = intersection(
      interval(4, 6),
      interval(0, 10)
    ).execute();
    expect(result.toString()).toBe('[4, 6]');
  });

  it('intersection of multiple disjoint sets is empty', () => {
    const result = intersection(
      interval(0, 2),
      interval(4, 7),
      interval(5, 5)
    ).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection with empty set is empty', () => {
    const result = intersection(empty, universe).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection of universe sets returns universe', () => {
    const result = intersection(universe, universe).execute();
    expect(result.toString()).toBe('[-Infinity, Infinity]');
  });

  it('intersection is empty checks', () => {
    expect(intersection(empty, universe).isVoid()).toBe(true);
    expect(intersection(interval(1, 2), interval(1, 2)).isVoid()).toBe(false);
    expect(intersection(interval(1, 5), interval(3, 9)).isVoid()).toBe(false);
    expect(intersection(
      interval(1, 5),
      interval(6, 9),
      interval(20, 30)
    ).isVoid()).toBe(true);
  });

  it('intersection of multiple overlapping sets', () => {
    let result = intersection(
      interval(0, 10),
      interval(2, 8),
      interval(5, 6)
    ).execute();
    expect(result.toString()).toBe('[5, 6]');

    result = intersection(
      interval(0, 10),
      interval(2, 8),
      interval(5, 6),
      interval(4, 7)
    ).execute();
    expect(result.toString()).toBe('[5, 6]');
  });

  it('intersection with not single union', () => {
    let result = intersection(
      interval(0, 10),
      union(interval(2, 4), interval(6, 8))
    ).execute();
    expect(result.toString()).toBe('Union([2, 4], [6, 8])');

    const expected = union(
      interval(3, 4),
      interval(6, 7)
    ).execute();
    result = intersection(
      interval(0, 10),
      union(interval(2, 4), interval(6, 8)),
      interval(3, 7)
    ).execute();
    expect(result.toString()).toBe(expected.toString());
  });
});

describe('Union', () => {
  it('union of identical floatsets returns same', () => {
    const result = union(
      interval(1, 2),
      interval(1, 2),
      interval(1, 2)
    ).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('union of overlapping floatsets', () => {
    const result = union(
      interval(1, 3),
      interval(2, 7),
      interval(1, 3)
    ).execute();
    expect(result.toString()).toBe('[1, 7]');
  });

  it('union of subset floatsets', () => {
    const result = union(
      interval(0, 10),
      interval(4, 6),
      interval(4, 6)
    ).execute();
    expect(result.toString()).toBe('[0, 10]');
  });

  it('union of disjoint floatsets', () => {
    const result = union(
      interval(0, 2),
      interval(4, 7)
    ).execute();
    expect(result.toString()).toBe('Union([0, 2], [4, 7])');
  });

  it('union of disjoint floatsets order', () => {
    const result = union(
      interval(3, 7),
      interval(0, 2)
    ).execute();
    expect(result.toString()).toBe('Union([0, 2], [3, 7])');
  });

  it('union is void checks', () => {
    expect(union(empty, empty).isVoid()).toBe(true);
    expect(union(empty, universe).isVoid()).toBe(false);
    expect(union(interval(1, 2), interval(1, 2)).isVoid()).toBe(false);
    expect(union(interval(1, 5), interval(3, 9)).isVoid()).toBe(false);
  });

  it('union of multiple overlapping sets', () => {
    let result = union(
      interval(0, 3),
      interval(2, 8),
      interval(5, 26)
    ).execute();
    expect(result.toString()).toBe('[0, 26]');

    result = union(
      interval(0, 3),
      interval(2, 8),
      interval(5, 26),
      interval(20, 30)
    ).execute();
    expect(result.toString()).toBe('[0, 30]');
  });
});

describe('Operations', () => {
  it('combined intersection and union operations', () => {
    // Intersection(Union([2,7], [7,13]), [5,8]) == [5,8]
    let result = intersection(
      union(interval(2, 7), interval(7, 13)),
      interval(5, 8)
    ).execute();
    expect(result.toString()).toBe('[5, 8]');

    // Intersection([2,7], Union([7,13], [5,8])) == [5,7]
    result = intersection(
      interval(2, 7),
      union(interval(7, 13), interval(5, 8))
    ).execute();
    expect(result.toString()).toBe('[5, 7]');

    // Union(Intersection([2,7], [7,13]), [5,8]) == [5,8]
    result = union(
      intersection(interval(2, 7), interval(7, 13)),
      interval(5, 8)
    ).execute();
    expect(result.toString()).toBe('[5, 8]');
  });
});