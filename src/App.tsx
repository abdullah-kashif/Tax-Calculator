import { useCallback } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useShareOrCopy } from './hooks/useShareOrCopy';
import { generateSummaryText } from './lib/formatters';
import { InvoiceTypeSelector } from './components/InvoiceTypeSelector';
import { InputSection } from './components/InputSection';
import { ResultSummary } from './components/ResultSummary';
import { CalculationBreakdown } from './components/CalculationBreakdown';
import { DesktopTable } from './components/DesktopTable';
import { ActionButtons } from './components/ActionButtons';
import { TaxSettings } from './components/TaxSettings';
import { Toast } from './components/Toast';

function App() {
  const {
    activeTab,
    activeInvoice,
    result,
    allResults,
    allInvoices,
    validation,
    setActiveTab,
    setInput,
    setRate,
    resetRates,
    resetAll,
  } = useCalculator();

  const { shareOrCopy, copyToClipboard, toastMessage } = useShareOrCopy();

  const summaryText = generateSummaryText(activeTab, result);

  const handleCopy = useCallback(() => {
    copyToClipboard(summaryText);
  }, [copyToClipboard, summaryText]);

  const handleShare = useCallback(() => {
    shareOrCopy(summaryText);
  }, [shareOrCopy, summaryText]);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          Tax & Profit Calculator
          <span className="app-currency">PKR</span>
        </h1>
      </header>

      {/* Mobile Layout */}
      <main className="mobile-layout">
        <InvoiceTypeSelector activeTab={activeTab} onTabChange={setActiveTab} />

        <InputSection
          buying={activeInvoice.buying}
          selling={activeInvoice.selling}
          srbPayable={activeInvoice.srbPayable}
          onInput={setInput}
          validation={validation}
        />

        <ResultSummary result={result} />

        <CalculationBreakdown result={result} />

        <ActionButtons onCopy={handleCopy} onShare={handleShare} onReset={resetAll} />

        <TaxSettings
          invoiceType={activeTab}
          rates={activeInvoice.rates}
          onRateChange={setRate}
          onRestoreDefaults={resetRates}
        />
      </main>

      {/* Desktop Layout */}
      <aside className="desktop-layout">
        <DesktopTable allResults={allResults} allInvoices={allInvoices} />
      </aside>

      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
