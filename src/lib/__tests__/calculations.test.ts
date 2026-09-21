import { describe, it, expect } from 'vitest';
import { calculate, parseInput } from '../calculations';
import { formatNumber, formatPercentage, generateSummaryText } from '../formatters';
import type { TaxRates } from '../types';
import { DEFAULT_RATES } from '../types';

// ─── Helper ────────────────────────────────────────────────────
function approx(actual: number, expected: number, tolerance = 0.005): void {
  expect(Math.abs(actual - expected)).toBeLessThan(tolerance);
}

// ─── Test 1: Sales Tax Invoice ─────────────────────────────────
describe('Sales Tax Invoice', () => {
  const rates: TaxRates = DEFAULT_RATES.salesTax;

  it('should calculate correctly for B=10, S=20, SRB=0', () => {
    const result = calculate('salesTax', 10, 20, 0, rates);

    expect(result.salesTax).toBe(3);
    expect(result.invoiceAmount).toBe(23);
    approx(result.withholdingTax, 1.61);
    approx(result.salesTaxDeduction, 0.60);
    approx(result.chequeAmount, 20.79);
    approx(result.takeHome, 20.79);
    approx(result.profitLoss, 10.79);
    expect(result.profitLossPercentage).not.toBeNull();
    approx(result.profitLossPercentage!, 1.079);
  });

  it('should produce exact unrounded values', () => {
    const result = calculate('salesTax', 10, 20, 0, rates);

    // salesTax = 20 * 0.15 = 3
    expect(result.salesTax).toBe(3);
    // invoiceAmount = 20 + 3 = 23
    expect(result.invoiceAmount).toBe(23);
    // withholdingTax = 23 * 0.07 = 1.61
    expect(result.withholdingTax).toBe(23 * 0.07);
    // salesTaxDeduction = 3 * 0.20 = 0.6
    expect(result.salesTaxDeduction).toBeCloseTo(0.6, 10);
    // chequeAmount = 23 - 1.61 - 0.6 = 20.79
    expect(result.chequeAmount).toBeCloseTo(23 - 23 * 0.07 - 0.6, 10);
  });
});

// ─── Test 2: 7% Invoice ───────────────────────────────────────
describe('7% Invoice', () => {
  const rates: TaxRates = DEFAULT_RATES.sevenPercent;

  it('should calculate correctly for B=1500, S=2000, SRB=0', () => {
    const result = calculate('sevenPercent', 1500, 2000, 0, rates);

    // salesTax = (2000 / 1.15) * 0.15 = 260.8695652173913...
    approx(result.salesTax, 260.8695652173913, 0.0001);
    expect(result.invoiceAmount).toBe(2000);
    expect(result.withholdingTax).toBe(140);
    expect(result.salesTaxDeduction).toBe(0);
    expect(result.chequeAmount).toBe(1860);
    expect(result.takeHome).toBe(1860);
    expect(result.profitLoss).toBe(360);
    expect(result.profitLossPercentage).toBe(0.24);
  });

  it('should always set salesTaxDeduction to 0', () => {
    const result = calculate('sevenPercent', 100, 500, 10, rates);
    expect(result.salesTaxDeduction).toBe(0);
  });
});

// ─── Test 3: Punjab Sales Tax Invoice ─────────────────────────
describe('Punjab Sales Tax Invoice', () => {
  const rates: TaxRates = DEFAULT_RATES.punjabSalesTax;

  it('should calculate correctly for B=1000, S=2000, SRB=0 with 16% rate', () => {
    const result = calculate('punjabSalesTax', 1000, 2000, 0, rates);

    expect(result.salesTax).toBe(320);
    expect(result.invoiceAmount).toBe(2320);
    approx(result.withholdingTax, 162.4);
    expect(result.salesTaxDeduction).toBe(64);
    approx(result.chequeAmount, 2093.6);
    approx(result.takeHome, 2093.6);
    approx(result.profitLoss, 1093.6);
    expect(result.profitLossPercentage).not.toBeNull();
    approx(result.profitLossPercentage!, 1.0936);
  });

  it('should use 16% as the default Punjab Sales Tax rate', () => {
    expect(DEFAULT_RATES.punjabSalesTax.salesTaxRate).toBe(0.16);
  });
});

// ─── Test 4: Zero Buying ──────────────────────────────────────
describe('Zero / empty inputs', () => {
  it('should return all zeros and null percentage for B=0, S=0, SRB=0', () => {
    const result = calculate('salesTax', 0, 0, 0, DEFAULT_RATES.salesTax);

    expect(result.salesTax).toBe(0);
    expect(result.invoiceAmount).toBe(0);
    expect(result.withholdingTax).toBe(0);
    expect(result.salesTaxDeduction).toBe(0);
    expect(result.chequeAmount).toBe(0);
    expect(result.takeHome).toBe(0);
    expect(result.profitLoss).toBe(0);
    expect(result.profitLossPercentage).toBeNull();
  });

  it('should return null percentage for all invoice types when buying is 0', () => {
    for (const type of ['salesTax', 'sevenPercent', 'punjabSalesTax'] as const) {
      const result = calculate(type, 0, 100, 0, DEFAULT_RATES[type]);
      expect(result.profitLossPercentage).toBeNull();
    }
  });
});

// ─── SRB Payable ──────────────────────────────────────────────
describe('SRB Payable', () => {
  it('should subtract SRB Payable from cheque amount to get take-home', () => {
    const result = calculate('salesTax', 10, 20, 5, DEFAULT_RATES.salesTax);
    approx(result.takeHome, result.chequeAmount - 5);
    approx(result.profitLoss, result.takeHome - 10);
  });
});

// ─── Custom Rates ─────────────────────────────────────────────
describe('Custom tax rates', () => {
  it('should use custom rates in calculations', () => {
    const customRates: TaxRates = {
      salesTaxRate: 0.18,
      withholdingTaxRate: 0.10,
      salesTaxDeductionRate: 0.25,
    };
    const result = calculate('salesTax', 100, 200, 0, customRates);

    expect(result.salesTax).toBe(36); // 200 * 0.18
    expect(result.invoiceAmount).toBe(236); // 200 + 36
    approx(result.withholdingTax, 23.6); // 236 * 0.10
    expect(result.salesTaxDeduction).toBe(9); // 36 * 0.25
    approx(result.chequeAmount, 203.4); // 236 - 23.6 - 9
  });
});

// ─── parseInput ───────────────────────────────────────────────
describe('parseInput', () => {
  it('should return 0 for empty string', () => {
    expect(parseInput('')).toBe(0);
  });

  it('should return 0 for whitespace', () => {
    expect(parseInput('   ')).toBe(0);
  });

  it('should parse valid numbers', () => {
    expect(parseInput('1500')).toBe(1500);
    expect(parseInput('25.5')).toBe(25.5);
    expect(parseInput('-100')).toBe(-100);
  });

  it('should return 0 for NaN-producing strings', () => {
    expect(parseInput('abc')).toBe(0);
    expect(parseInput('NaN')).toBe(0);
  });

  it('should return 0 for Infinity', () => {
    expect(parseInput('Infinity')).toBe(0);
    expect(parseInput('-Infinity')).toBe(0);
  });
});

// ─── formatNumber ─────────────────────────────────────────────
describe('formatNumber', () => {
  it('should format with commas', () => {
    expect(formatNumber(1500)).toBe('1,500');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should round to max 2 decimal places', () => {
    expect(formatNumber(260.869565)).toBe('260.87');
  });

  it('should not add trailing zeros', () => {
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(1.5)).toBe('1.5');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234.5)).toBe('-1,234.5');
  });
});

// ─── formatPercentage ─────────────────────────────────────────
describe('formatPercentage', () => {
  it('should show em dash for null', () => {
    expect(formatPercentage(null)).toBe('—');
  });

  it('should format 0.24 as 24%', () => {
    expect(formatPercentage(0.24)).toBe('24%');
  });

  it('should format 1.079 as 107.9%', () => {
    expect(formatPercentage(1.079)).toBe('107.9%');
  });

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('should handle negative percentages', () => {
    expect(formatPercentage(-0.5)).toBe('-50%');
  });
});

// ─── generateSummaryText ──────────────────────────────────────
describe('generateSummaryText', () => {
  it('should produce the correct format', () => {
    const result = calculate('salesTax', 10, 20, 0, DEFAULT_RATES.salesTax);
    const text = generateSummaryText('salesTax', result);

    expect(text).toContain('Tax & Profit Calculation');
    expect(text).toContain('Invoice Type: Sales Tax Invoice');
    expect(text).toContain('Buying: 10');
    expect(text).toContain('Selling: 20');
    expect(text).toContain('Sales Tax: 3');
    expect(text).toContain('Take-home:');
    expect(text).toContain('Profit/Loss:');
    expect(text).toContain('Profit/Loss Percentage:');
  });
});
