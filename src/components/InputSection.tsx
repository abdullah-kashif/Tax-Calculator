import { useCallback, type ChangeEvent, type WheelEvent } from 'react';

interface Props {
  buying: string;
  selling: string;
  srbPayable: string;
  onInput: (field: 'buying' | 'selling' | 'srbPayable', value: string) => void;
  validation: { buyingNegative: boolean; sellingNegative: boolean };
}

function preventWheel(e: WheelEvent<HTMLInputElement>) {
  (e.target as HTMLInputElement).blur();
}

function sanitizeInput(value: string): string {
  return value.replace(/[^0-9.\-]/g, '');
}

export function InputSection({ buying, selling, srbPayable, onInput, validation }: Props) {
  const handleChange = useCallback(
    (field: 'buying' | 'selling' | 'srbPayable') => (e: ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeInput(e.target.value);
      onInput(field, sanitized);
    },
    [onInput]
  );

  return (
    <div className="input-section">
      <div className="input-group">
        <label htmlFor="input-buying" className="input-label">
          Buying Amount
        </label>
        <input
          id="input-buying"
          type="text"
          inputMode="decimal"
          value={buying}
          onChange={handleChange('buying')}
          onWheel={preventWheel}
          placeholder="0"
          className={`input-field input-field--editable ${validation.buyingNegative ? 'input-field--error' : ''}`}
          autoComplete="off"
          aria-describedby={validation.buyingNegative ? 'buying-error' : undefined}
        />
        {validation.buyingNegative && (
          <span id="buying-error" className="input-error" role="alert">
            Buying amount cannot be negative
          </span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="input-selling" className="input-label">
          Selling Amount
        </label>
        <input
          id="input-selling"
          type="text"
          inputMode="decimal"
          value={selling}
          onChange={handleChange('selling')}
          onWheel={preventWheel}
          placeholder="0"
          className={`input-field input-field--editable ${validation.sellingNegative ? 'input-field--error' : ''}`}
          autoComplete="off"
          aria-describedby={validation.sellingNegative ? 'selling-error' : undefined}
        />
        {validation.sellingNegative && (
          <span id="selling-error" className="input-error" role="alert">
            Selling amount cannot be negative
          </span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="input-srb" className="input-label">
          SRB Payable
        </label>
        <input
          id="input-srb"
          type="text"
          inputMode="decimal"
          value={srbPayable}
          onChange={handleChange('srbPayable')}
          onWheel={preventWheel}
          placeholder="0"
          className="input-field input-field--editable"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
