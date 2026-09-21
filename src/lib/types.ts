export type InvoiceType = 'salesTax' | 'sevenPercent' | 'punjabSalesTax';

export interface TaxRates {
  salesTaxRate: number;
  withholdingTaxRate: number;
  salesTaxDeductionRate: number;
}

export interface CalculationResult {
  buying: number;
  selling: number;
  srbPayable: number;
  salesTax: number;
  invoiceAmount: number;
  withholdingTax: number;
  salesTaxDeduction: number;
  chequeAmount: number;
  takeHome: number;
  profitLoss: number;
  profitLossPercentage: number | null;
}

export interface InvoiceState {
  buying: string;
  selling: string;
  srbPayable: string;
  rates: TaxRates;
}

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  salesTax: 'Sales Tax Invoice',
  sevenPercent: '7% Invoice',
  punjabSalesTax: 'Punjab Sales Tax Invoice',
};

export const DEFAULT_RATES: Record<InvoiceType, TaxRates> = {
  salesTax: {
    salesTaxRate: 0.15,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0.20,
  },
  sevenPercent: {
    salesTaxRate: 0.15,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0,
  },
  punjabSalesTax: {
    salesTaxRate: 0.16,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0.20,
  },
};

export const RATE_LABELS: Record<InvoiceType, string> = {
  salesTax: 'Sales Tax',
  sevenPercent: 'Embedded Sales Tax',
  punjabSalesTax: 'Punjab Sales Tax',
};
