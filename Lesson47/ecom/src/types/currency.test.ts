import { Currency, formatPrice, isCurrency } from './currency'


describe('isCurrency', () => { 
  it('should return true for supported currecy code', () => {
    expect(isCurrency('EUR')).toBeTruthy()
  })

    it('should return false for unsupported correct currecy code', () => {
    expect(isCurrency('SEK')).toBeFalsy()
  })


    it('should return false for incorrect currecy code', () => {
    expect(isCurrency('euro')).toBeFalsy()
  })
 });

 describe('formatPrice', () => { 

  it('should format price with currency in en-GB locale', () => {
    expect(formatPrice(2340, Currency.EUR)).toBe('€23.40');
  });

    it('should format 0 amount as correct price', () => {
    expect(formatPrice(0, Currency.EUR)).toBe('€0.00');
  });

  })

