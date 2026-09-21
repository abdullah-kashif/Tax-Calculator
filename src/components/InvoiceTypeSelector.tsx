import type { InvoiceType } from '../lib/types';
import { INVOICE_TYPE_LABELS } from '../lib/types';

interface Props {
  activeTab: InvoiceType;
  onTabChange: (tab: InvoiceType) => void;
}

const TABS: InvoiceType[] = ['salesTax', 'sevenPercent', 'punjabSalesTax'];

export function InvoiceTypeSelector({ activeTab, onTabChange }: Props) {
  return (
    <div className="invoice-tabs" role="tablist" aria-label="Invoice type selector">
      {TABS.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          className={`invoice-tab ${activeTab === tab ? 'invoice-tab--active' : ''}`}
          onClick={() => onTabChange(tab)}
          type="button"
        >
          {INVOICE_TYPE_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
