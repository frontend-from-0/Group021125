function sum (a?: number, b?: number) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    console.error('Expected number input for both values');
    return;
  }
  return a +b;
}


describe('sum', () => {
  it('should correctly calculate sum of two numbers', () => {
    expect(sum(1, 5)).toBe(6);
  });

  it('should return undefined if one of the numbers is missing', () => {
    expect(sum(1)).toBe(undefined);
  });


  it('should return undefined if both values are missing', () => {
    expect(sum()).toBe(undefined);
  });
})



// function myRandomNumFunction () {
//   anotherFun();
//   return 11;
// }


// test('random number function should generate number between 10 and 50', () => {
//   const result = myRandomNumFunction();
//   expect(result).toBeGreaterThan(10);
//   expect(result).toBeLessThan(50);

// })