import { useState } from 'react';

interface Props {
  onCopy: () => void;
  onShare: () => void;
  onReset: () => void;
}

export function ActionButtons({ onCopy, onShare, onReset }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    onReset();
    setShowConfirm(false);
  };

  const cancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <div className="action-buttons">
      <button
        type="button"
        className="action-btn action-btn--copy"
        onClick={onCopy}
        aria-label="Copy summary to clipboard"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        Copy Summary
      </button>

      <button
        type="button"
        className="action-btn action-btn--share"
        onClick={onShare}
        aria-label="Share calculation summary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Share
      </button>

      <button
        type="button"
        className="action-btn action-btn--reset"
        onClick={handleReset}
        aria-label="Reset all values"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
        Reset
      </button>

      {showConfirm && (
        <div className="reset-confirm" role="alertdialog" aria-label="Confirm reset">
          <div className="reset-confirm__backdrop" onClick={cancelReset} />
          <div className="reset-confirm__dialog">
            <p className="reset-confirm__message">
              Clear all values for this invoice type?
            </p>
            <div className="reset-confirm__actions">
              <button
                type="button"
                className="reset-confirm__btn reset-confirm__btn--cancel"
                onClick={cancelReset}
              >
                Cancel
              </button>
              <button
                type="button"
                className="reset-confirm__btn reset-confirm__btn--confirm"
                onClick={confirmReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
