import type { InvoiceType, TaxRates, CalculationResult } from './types';

/**
 * Parse a user-entered string into a number.
 * Returns 0 for empty, NaN, or Infinity values.
 */
export function parseInput(value: string): number {
  if (!value || value.trim() === '') return 0;
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return num;
}

function calculateSalesTaxInvoice(
  buying: number,
  selling: number,
  srbPayable: number,
  rates: TaxRates
): CalculationResult {
  const salesTax = selling * rates.salesTaxRate;
  const invoiceAmount = selling + salesTax;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = salesTax * rates.salesTaxDeductionRate;
  const chequeAmount = invoiceAmount - withholdingTax - salesTaxDeduction;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

function calculateSevenPercentInvoice(
  buying: number,
  selling: number,
  srbPayable: number,
  rates: TaxRates
): CalculationResult {
  const salesTax = (selling / (1 + rates.salesTaxRate)) * rates.salesTaxRate;
  const invoiceAmount = selling;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = 0;
  const chequeAmount = invoiceAmount - withholdingTax;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

function calculatePunjabSalesTaxInvoice(
  buying: number,
  selling: number,
  srbPayable: number,
  rates: TaxRates
): CalculationResult {
  const salesTax = selling * rates.salesTaxRate;
  const invoiceAmount = selling + salesTax;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = salesTax * rates.salesTaxDeductionRate;
  const chequeAmount = invoiceAmount - withholdingTax - salesTaxDeduction;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

export function calculate(
  invoiceType: InvoiceType,
  buying: number,
  selling: number,
  srbPayable: number,
  rates: TaxRates
): CalculationResult {
  switch (invoiceType) {
    case 'salesTax':
      return calculateSalesTaxInvoice(buying, selling, srbPayable, rates);
    case 'sevenPercent':
      return calculateSevenPercentInvoice(buying, selling, srbPayable, rates);
    case 'punjabSalesTax':
      return calculatePunjabSalesTaxInvoice(buying, selling, srbPayable, rates);
  }
}
