import type { CalculationResult } from '../lib/types';
import { formatNumber, formatPercentage } from '../lib/formatters';

interface Props {
  result: CalculationResult;
}

export function ResultSummary({ result }: Props) {
  const { takeHome, profitLoss, profitLossPercentage } = result;

  const profitLossColor =
    profitLoss > 0 ? 'result-positive' : profitLoss < 0 ? 'result-negative' : 'result-neutral';
  const profitLossLabel = profitLoss > 0 ? '↑ Profit' : profitLoss < 0 ? '↓ Loss' : 'Break-even';

  return (
    <div className="result-summary">
      <div className="result-card result-card--primary">
        <span className="result-card__label">Take-home</span>
        <span className="result-card__value">{formatNumber(takeHome)}</span>
      </div>

      <div className={`result-card result-card--highlight ${profitLossColor}`}>
        <span className="result-card__label">
          Profit / Loss{' '}
          <span className="result-card__indicator" aria-label={profitLossLabel}>
            {profitLossLabel}
          </span>
        </span>
        <span className="result-card__value">{formatNumber(profitLoss)}</span>
      </div>

      <div className={`result-card ${profitLossColor}`}>
        <span className="result-card__label">Profit / Loss %</span>
        <span className="result-card__value result-card__value--pct">
          {formatPercentage(profitLossPercentage)}
        </span>
      </div>
    </div>
  );
}
