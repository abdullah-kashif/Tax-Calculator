import type { CalculationResult, InvoiceType } from './types';
import { INVOICE_TYPE_LABELS } from './types';

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 100) / 100;
  const parts = rounded.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  const sign = integerPart.startsWith('-') ? '-' : '';
  const absInt = integerPart.replace('-', '');
  const formatted = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimalPart) return `${sign}${formatted}.${decimalPart}`;
  return `${sign}${formatted}`;
}

export function formatPercentage(value: number | null): string {
  if (value === null) return '—';
  if (!Number.isFinite(value)) return '—';
  const pct = Math.round(value * 10000) / 100;
  const parts = pct.toString().split('.');
  const intPart = parts[0];
  const decPart = parts[1];
  if (decPart) return `${intPart}.${decPart}%`;
  return `${intPart}%`;
}

export function generateSummaryText(
  invoiceType: InvoiceType,
  result: CalculationResult
): string {
  return `Tax & Profit Calculation

Invoice Type: ${INVOICE_TYPE_LABELS[invoiceType]}
Buying: ${formatNumber(result.buying)}
Selling: ${formatNumber(result.selling)}
Sales Tax: ${formatNumber(result.salesTax)}
Total Invoice: ${formatNumber(result.invoiceAmount)}
Withholding Tax: ${formatNumber(result.withholdingTax)}
Sales Tax Deduction: ${formatNumber(result.salesTaxDeduction)}
Cheque Amount: ${formatNumber(result.chequeAmount)}
SRB Payable: ${formatNumber(result.srbPayable)}
Take-home: ${formatNumber(result.takeHome)}
Profit/Loss: ${formatNumber(result.profitLoss)}
Profit/Loss Percentage: ${formatPercentage(result.profitLossPercentage)}`;
}
