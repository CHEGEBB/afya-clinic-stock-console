import { stockSchema } from '../validation';

describe('stockSchema', () => {
  it('accepts a valid non-negative integer', () => {
    const result = stockSchema.safeParse(42);
    expect(result.success).toBe(true);
  });

  it('accepts zero as a valid stock count', () => {
    const result = stockSchema.safeParse(0);
    expect(result.success).toBe(true);
  });

  it('rejects a negative number', () => {
    const result = stockSchema.safeParse(-5);
    expect(result.success).toBe(false);
  });

  it('rejects a decimal number', () => {
    const result = stockSchema.safeParse(4.5);
    expect(result.success).toBe(false);
  });

  it('rejects NaN from a non-numeric input', () => {
    const result = stockSchema.safeParse(Number('abc'));
    expect(result.success).toBe(false);
  });
});
