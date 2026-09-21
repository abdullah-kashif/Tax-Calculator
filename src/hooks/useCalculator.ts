import { useState, useCallback, useEffect, useMemo } from 'react';
import type { InvoiceType, InvoiceState, TaxRates, CalculationResult } from '../lib/types';
import { DEFAULT_RATES } from '../lib/types';
import { calculate, parseInput } from '../lib/calculations';

const STORAGE_KEY = 'tax-calculator-state';

interface CalculatorState {
  activeTab: InvoiceType;
  invoices: Record<InvoiceType, InvoiceState>;
}

function createDefaultInvoiceState(type: InvoiceType): InvoiceState {
  return {
    buying: '',
    selling: '',
    srbPayable: '',
    rates: { ...DEFAULT_RATES[type] },
  };
}

function createDefaultState(): CalculatorState {
  return {
    activeTab: 'salesTax',
    invoices: {
      salesTax: createDefaultInvoiceState('salesTax'),
      sevenPercent: createDefaultInvoiceState('sevenPercent'),
      punjabSalesTax: createDefaultInvoiceState('punjabSalesTax'),
    },
  };
}

function loadState(): CalculatorState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CalculatorState;
      if (parsed.activeTab && parsed.invoices) {
        const defaults = createDefaultState();
        for (const key of Object.keys(defaults.invoices) as InvoiceType[]) {
          if (!parsed.invoices[key]) {
            parsed.invoices[key] = defaults.invoices[key];
          }
        }
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return createDefaultState();
}

function saveState(state: CalculatorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeInvoice = state.invoices[state.activeTab];

  const setActiveTab = useCallback((tab: InvoiceType) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setInput = useCallback(
    (field: 'buying' | 'selling' | 'srbPayable', value: string) => {
      setState((prev) => ({
        ...prev,
        invoices: {
          ...prev.invoices,
          [prev.activeTab]: {
            ...prev.invoices[prev.activeTab],
            [field]: value,
          },
        },
      }));
    },
    []
  );

  const setRate = useCallback(
    (rateField: keyof TaxRates, value: number) => {
      setState((prev) => ({
        ...prev,
        invoices: {
          ...prev.invoices,
          [prev.activeTab]: {
            ...prev.invoices[prev.activeTab],
            rates: {
              ...prev.invoices[prev.activeTab].rates,
              [rateField]: value,
            },
          },
        },
      }));
    },
    []
  );

  const resetRates = useCallback(() => {
    setState((prev) => ({
      ...prev,
      invoices: {
        ...prev.invoices,
        [prev.activeTab]: {
          ...prev.invoices[prev.activeTab],
          rates: { ...DEFAULT_RATES[prev.activeTab] },
        },
      },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      invoices: {
        ...prev.invoices,
        [prev.activeTab]: createDefaultInvoiceState(prev.activeTab),
      },
    }));
  }, []);

  const result: CalculationResult = useMemo(() => {
    const buying = parseInput(activeInvoice.buying);
    const selling = parseInput(activeInvoice.selling);
    const srbPayable = parseInput(activeInvoice.srbPayable);
    return calculate(state.activeTab, buying, selling, srbPayable, activeInvoice.rates);
  }, [state.activeTab, activeInvoice]);

  const allResults: Record<InvoiceType, CalculationResult> = useMemo(() => {
    const types: InvoiceType[] = ['salesTax', 'sevenPercent', 'punjabSalesTax'];
    const results = {} as Record<InvoiceType, CalculationResult>;
    for (const type of types) {
      const inv = state.invoices[type];
      const buying = parseInput(inv.buying);
      const selling = parseInput(inv.selling);
      const srbPayable = parseInput(inv.srbPayable);
      results[type] = calculate(type, buying, selling, srbPayable, inv.rates);
    }
    return results;
  }, [state.invoices]);

  const validation = useMemo(() => {
    const buying = parseInput(activeInvoice.buying);
    const selling = parseInput(activeInvoice.selling);
    return {
      buyingNegative: buying < 0,
      sellingNegative: selling < 0,
    };
  }, [activeInvoice.buying, activeInvoice.selling]);

  return {
    activeTab: state.activeTab,
    activeInvoice,
    result,
    allResults,
    allInvoices: state.invoices,
    validation,
    setActiveTab,
    setInput,
    setRate,
    resetRates,
    resetAll,
  };
}
