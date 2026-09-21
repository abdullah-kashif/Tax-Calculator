import type { CalculationResult, InvoiceType, InvoiceState } from '../lib/types';
import { INVOICE_TYPE_LABELS } from '../lib/types';
import { formatNumber, formatPercentage } from '../lib/formatters';

interface Props {
  allResults: Record<InvoiceType, CalculationResult>;
  allInvoices: Record<InvoiceType, InvoiceState>;
}

const INVOICE_TYPES: InvoiceType[] = ['salesTax', 'sevenPercent', 'punjabSalesTax'];

function getRateBadge(type: InvoiceType, rates: InvoiceState['rates']): string {
  const pct = (rates.salesTaxRate * 100).toFixed(0);
  switch (type) {
    case 'salesTax':
      return `${pct}%`;
    case 'sevenPercent':
      return `${pct}% (embedded)`;
    case 'punjabSalesTax':
      return `${pct}%`;
  }
}

export function DesktopTable({ allResults, allInvoices }: Props) {
  return (
    <div className="desktop-table-wrapper">
      <table className="desktop-table" aria-label="Tax calculations for all invoice types">
        <thead>
          <tr>
            <th className="dt-header">Invoice Type</th>
            <th className="dt-header">Rate</th>
            <th className="dt-header">Buying</th>
            <th className="dt-header">Selling</th>
            <th className="dt-header">Sales Tax</th>
            <th className="dt-header">Total Amount of Invoice</th>
            <th className="dt-header">Withholding Tax</th>
            <th className="dt-header">Sales Tax Deduction</th>
            <th className="dt-header">Cheque</th>
            <th className="dt-header">SRB Payable</th>
            <th className="dt-header">Take-home</th>
            <th className="dt-header">Loss/Profit</th>
            <th className="dt-header">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {INVOICE_TYPES.map((type) => {
            const result = allResults[type];
            const invoice = allInvoices[type];
            const profitClass =
              result.profitLoss > 0
                ? 'dt-profit'
                : result.profitLoss < 0
                  ? 'dt-loss'
                  : '';

            return (
              <tr key={type}>
                <td className="dt-cell dt-cell--type">{INVOICE_TYPE_LABELS[type]}</td>
                <td className="dt-cell dt-cell--rate">{getRateBadge(type, invoice.rates)}</td>
                <td className="dt-cell dt-cell--input">{formatNumber(result.buying)}</td>
                <td className="dt-cell dt-cell--input">{formatNumber(result.selling)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.salesTax)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.invoiceAmount)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.withholdingTax)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.salesTaxDeduction)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.chequeAmount)}</td>
                <td className="dt-cell dt-cell--input">{formatNumber(result.srbPayable)}</td>
                <td className="dt-cell dt-cell--output">{formatNumber(result.takeHome)}</td>
                <td className={`dt-cell dt-cell--output ${profitClass}`}>
                  {formatNumber(result.profitLoss)}
                </td>
                <td className={`dt-cell dt-cell--output ${profitClass}`}>
                  {formatPercentage(result.profitLossPercentage)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
