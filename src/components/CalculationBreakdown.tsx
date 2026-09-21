import type { CalculationResult } from '../lib/types';
import { formatNumber, formatPercentage } from '../lib/formatters';

interface Props {
  result: CalculationResult;
}

interface RowData {
  label: string;
  value: string;
  isInput?: boolean;
}

export function CalculationBreakdown({ result }: Props) {
  const rows: RowData[] = [
    { label: 'Buying', value: formatNumber(result.buying), isInput: true },
    { label: 'Selling', value: formatNumber(result.selling), isInput: true },
    { label: 'Sales Tax', value: formatNumber(result.salesTax) },
    { label: 'Total Amount of Invoice', value: formatNumber(result.invoiceAmount) },
    { label: 'Withholding Tax', value: formatNumber(result.withholdingTax) },
    { label: 'Sales Tax Deduction', value: formatNumber(result.salesTaxDeduction) },
    { label: 'Cheque Amount', value: formatNumber(result.chequeAmount) },
    { label: 'SRB Payable', value: formatNumber(result.srbPayable), isInput: true },
    { label: 'Take-home', value: formatNumber(result.takeHome) },
    { label: 'Loss / Profit', value: formatNumber(result.profitLoss) },
    { label: 'Percentage', value: formatPercentage(result.profitLossPercentage) },
  ];

  return (
    <div className="breakdown">
      <h3 className="breakdown__title">Calculation Breakdown</h3>
      <div className="breakdown__table" role="table" aria-label="Calculation breakdown">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`breakdown__row ${row.isInput ? 'breakdown__row--input' : ''}`}
            role="row"
          >
            <span className="breakdown__label" role="rowheader">
              {row.label}
            </span>
            <span className="breakdown__value" role="cell">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
