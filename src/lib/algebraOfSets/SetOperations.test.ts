import { FiniteSet } from './Set';
import { Union, Intersection } from './SetOperations';
import { EMPTY_SET, UNIVERSE } from './constants';
import { describe, it, expect } from 'bun:test';

describe('Intersection', () => {
  it('intersection of identical floatsets returns same', () => {
    const result = new Intersection([
      new FiniteSet(1, 2),
      new FiniteSet(1, 2),
      new FiniteSet(1, 2)
    ]).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('intersection of nested intersection and floatset', () => {
    const result = new Intersection([
      new Intersection([new FiniteSet(1, 2), new FiniteSet(1, 2)]),
      new FiniteSet(1, 2)
    ]).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('intersection of overlapping floatsets', () => {
    const result = new Intersection([
      new FiniteSet(1, 3),
      new FiniteSet(2, 7),
      new FiniteSet(1, 3)
    ]).execute();
    expect(result.toString()).toBe('[2, 3]');
  });

  it('intersection of subset floatsets', () => {
    const result = new Intersection([
      new FiniteSet(0, 10),
      new FiniteSet(4, 6),
      new FiniteSet(4, 6)
    ]).execute();
    expect(result.toString()).toBe('[4, 6]');
  });

  it('intersection of disjoint floatsets is empty', () => {
    const result = new Intersection([
      new FiniteSet(0, 2),
      new FiniteSet(4, 7)
    ]).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection with single point overlap', () => {
    const result = new Intersection([
      new FiniteSet(4, 7),
      new FiniteSet(5, 5)
    ]).execute();
    expect(result.toString()).toBe('[5, 5]');
  });

  it('intersection with full overlap returns subset', () => {
    const result = new Intersection([
      new FiniteSet(4, 6),
      new FiniteSet(0, 10)
    ]).execute();
    expect(result.toString()).toBe('[4, 6]');
  });

  it('intersection of multiple disjoint sets is empty', () => {
    const result = new Intersection([
      new FiniteSet(0, 2),
      new FiniteSet(4, 7),
      new FiniteSet(5, 5)
    ]).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection with empty set is empty', () => {
    const result = new Intersection([EMPTY_SET, UNIVERSE]).execute();
    expect(result.isVoid()).toBe(true);
  });

  it('intersection of universe sets returns universe', () => {
    const result = new Intersection([UNIVERSE, UNIVERSE]).execute();
    expect(result.toString()).toBe('[-Infinity, Infinity]');
  });

  it('intersection is empty checks', () => {
    expect(new Intersection([EMPTY_SET, UNIVERSE]).isVoid()).toBe(true);
    expect(new Intersection([new FiniteSet(1, 2), new FiniteSet(1, 2)]).isVoid()).toBe(false);
    expect(new Intersection([new FiniteSet(1, 5), new FiniteSet(3, 9)]).isVoid()).toBe(false);
    expect(new Intersection([
      new FiniteSet(1, 5),
      new FiniteSet(6, 9),
      new FiniteSet(20, 30)
    ]).isVoid()).toBe(true);
  });

  it('intersection of multiple overlapping sets', () => {
    let result = new Intersection([
      new FiniteSet(0, 10),
      new FiniteSet(2, 8),
      new FiniteSet(5, 6)
    ]).execute();
    expect(result.toString()).toBe('[5, 6]');

    result = new Intersection([
      new FiniteSet(0, 10),
      new FiniteSet(2, 8),
      new FiniteSet(5, 6),
      new FiniteSet(4, 7)
    ]).execute();
    expect(result.toString()).toBe('[5, 6]');
  });

  it('intersection with not single union', () => {
    let result = new Intersection([
      new FiniteSet(0, 10),
      new Union([new FiniteSet(2, 4), new FiniteSet(6, 8)])
    ]).execute();
    expect(result.toString()).toBe('Union([2, 4], [6, 8])');

    const expected = new Union([
      new FiniteSet(3, 4),
      new FiniteSet(6, 7)
    ]).execute();
    result = new Intersection([
      new FiniteSet(0, 10),
      new Union([new FiniteSet(2, 4), new FiniteSet(6, 8)]),
      new FiniteSet(3, 7)
    ]).execute();
    expect(result.toString()).toBe(expected.toString());
  });
});

describe('Union', () => {
  it('union of identical floatsets returns same', () => {
    const result = new Union([
      new FiniteSet(1, 2),
      new FiniteSet(1, 2),
      new FiniteSet(1, 2)
    ]).execute();
    expect(result.toString()).toBe('[1, 2]');
  });

  it('union of overlapping floatsets', () => {
    const result = new Union([
      new FiniteSet(1, 3),
      new FiniteSet(2, 7),
      new FiniteSet(1, 3)
    ]).execute();
    expect(result.toString()).toBe('[1, 7]');
  });

  it('union of subset floatsets', () => {
    const result = new Union([
      new FiniteSet(0, 10),
      new FiniteSet(4, 6),
      new FiniteSet(4, 6)
    ]).execute();
    expect(result.toString()).toBe('[0, 10]');
  });

  it('union of disjoint floatsets', () => {
    const result = new Union([
      new FiniteSet(0, 2),
      new FiniteSet(4, 7)
    ]).execute();
    expect(result.toString()).toBe('Union([0, 2], [4, 7])');
  });

  it('union of disjoint floatsets order', () => {
    const result = new Union([
      new FiniteSet(3, 7),
      new FiniteSet(0, 2)
    ]).execute();
    expect(result.toString()).toBe('Union([0, 2], [3, 7])');
  });

  it('union is void checks', () => {
    expect(new Union([EMPTY_SET, EMPTY_SET]).isVoid()).toBe(true);
    expect(new Union([EMPTY_SET, UNIVERSE]).isVoid()).toBe(false);
    expect(new Union([new FiniteSet(1, 2), new FiniteSet(1, 2)]).isVoid()).toBe(false);
    expect(new Union([new FiniteSet(1, 5), new FiniteSet(3, 9)]).isVoid()).toBe(false);
  });

  it('union of multiple overlapping sets', () => {
    let result = new Union([
      new FiniteSet(0, 3),
      new FiniteSet(2, 8),
      new FiniteSet(5, 26)
    ]).execute();
    expect(result.toString()).toBe('[0, 26]');

    result = new Union([
      new FiniteSet(0, 3),
      new FiniteSet(2, 8),
      new FiniteSet(5, 26),
      new FiniteSet(20, 30)
    ]).execute();
    expect(result.toString()).toBe('[0, 30]');
  });
});

describe('Operations', () => {
  it('combined intersection and union operations', () => {
    // Intersection(Union([2,7], [7,13]), [5,8]) == [5,8]
    let result = new Intersection([
      new Union([new FiniteSet(2, 7), new FiniteSet(7, 13)]),
      new FiniteSet(5, 8)
    ]).execute();
    expect(result.toString()).toBe('[5, 8]');

    // Intersection([2,7], Union([7,13], [5,8])) == [5,7]
    result = new Intersection([
      new FiniteSet(2, 7),
      new Union([new FiniteSet(7, 13), new FiniteSet(5, 8)])
    ]).execute();
    expect(result.toString()).toBe('[5, 7]');

    // Union(Intersection([2,7], [7,13]), [5,8]) == [5,8]
    result = new Union([
      new Intersection([new FiniteSet(2, 7), new FiniteSet(7, 13)]),
      new FiniteSet(5, 8)
    ]).execute();
    expect(result.toString()).toBe('[5, 8]');
  });
});