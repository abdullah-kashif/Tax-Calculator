import { useState, useCallback, type ChangeEvent } from 'react';
import type { InvoiceType, TaxRates } from '../lib/types';
import { DEFAULT_RATES, RATE_LABELS } from '../lib/types';

interface Props {
  invoiceType: InvoiceType;
  rates: TaxRates;
  onRateChange: (field: keyof TaxRates, value: number) => void;
  onRestoreDefaults: () => void;
}

interface RateField {
  key: keyof TaxRates;
  label: string;
  show: boolean;
}

export function TaxSettings({ invoiceType, rates, onRateChange, onRestoreDefaults }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleRateChange = useCallback(
    (field: keyof TaxRates) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (Number.isFinite(value)) {
        onRateChange(field, value / 100); // Convert percentage to decimal
      }
    },
    [onRateChange]
  );

  const defaults = DEFAULT_RATES[invoiceType];
  const hasChanges =
    rates.salesTaxRate !== defaults.salesTaxRate ||
    rates.withholdingTaxRate !== defaults.withholdingTaxRate ||
    rates.salesTaxDeductionRate !== defaults.salesTaxDeductionRate;

  const rateFields: RateField[] = [
    {
      key: 'salesTaxRate',
      label: `${RATE_LABELS[invoiceType]} Rate`,
      show: true,
    },
    {
      key: 'withholdingTaxRate',
      label: 'Withholding Tax Rate',
      show: true,
    },
    {
      key: 'salesTaxDeductionRate',
      label: 'Sales Tax Deduction Rate',
      show: invoiceType !== 'sevenPercent', // Always 0 for 7% invoice
    },
  ];

  return (
    <div className="tax-settings">
      <button
        type="button"
        className="tax-settings__toggle"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="tax-settings-panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="tax-settings__icon"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        Tax Settings
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`tax-settings__chevron ${isOpen ? 'tax-settings__chevron--open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div id="tax-settings-panel" className="tax-settings__panel">
          {rateFields
            .filter((f) => f.show)
            .map((field) => (
              <div key={field.key} className="tax-settings__field">
                <label htmlFor={`rate-${field.key}`} className="tax-settings__label">
                  {field.label}
                </label>
                <div className="tax-settings__input-wrapper">
                  <input
                    id={`rate-${field.key}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={Math.round(rates[field.key] * 10000) / 100}
                    onChange={handleRateChange(field.key)}
                    className="tax-settings__input"
                    aria-label={`${field.label} percentage`}
                  />
                  <span className="tax-settings__suffix">%</span>
                </div>
              </div>
            ))}

          {hasChanges && (
            <button
              type="button"
              className="tax-settings__restore"
              onClick={onRestoreDefaults}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Restore Default Rates
            </button>
          )}
        </div>
      )}
    </div>
  );
}
