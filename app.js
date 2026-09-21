/**
 * Tax & Profit Calculator — Pure Vanilla JavaScript
 * Preserves 100% calculation logic and design specifications.
 */

// ─── Constants & Configuration ────────────────────────────────
const STORAGE_KEY = 'tax-calculator-state';

const INVOICE_TYPE_LABELS = {
  salesTax: 'Sales Tax Invoice',
  sevenPercent: '7% Invoice',
  punjabSalesTax: 'Punjab Sales Tax Invoice',
};

const RATE_LABELS = {
  salesTax: 'Sales Tax',
  sevenPercent: 'Embedded Sales Tax',
  punjabSalesTax: 'Punjab Sales Tax',
};

const DEFAULT_RATES = {
  salesTax: {
    salesTaxRate: 0.15,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0.20,
  },
  sevenPercent: {
    salesTaxRate: 0.15,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0,
  },
  punjabSalesTax: {
    salesTaxRate: 0.16,
    withholdingTaxRate: 0.07,
    salesTaxDeductionRate: 0.20,
  },
};

const INVOICE_TYPES = ['salesTax', 'sevenPercent', 'punjabSalesTax'];

// ─── Core Calculations ────────────────────────────────────────
function parseInput(value) {
  if (!value || typeof value !== 'string' || value.trim() === '') return 0;
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return num;
}

function calculateSalesTaxInvoice(buying, selling, srbPayable, rates) {
  const salesTax = selling * rates.salesTaxRate;
  const invoiceAmount = selling + salesTax;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = salesTax * rates.salesTaxDeductionRate;
  const chequeAmount = invoiceAmount - withholdingTax - salesTaxDeduction;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

function calculateSevenPercentInvoice(buying, selling, srbPayable, rates) {
  const salesTax = (selling / (1 + rates.salesTaxRate)) * rates.salesTaxRate;
  const invoiceAmount = selling;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = 0;
  const chequeAmount = invoiceAmount - withholdingTax;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

function calculatePunjabSalesTaxInvoice(buying, selling, srbPayable, rates) {
  const salesTax = selling * rates.salesTaxRate;
  const invoiceAmount = selling + salesTax;
  const withholdingTax = invoiceAmount * rates.withholdingTaxRate;
  const salesTaxDeduction = salesTax * rates.salesTaxDeductionRate;
  const chequeAmount = invoiceAmount - withholdingTax - salesTaxDeduction;
  const takeHome = chequeAmount - srbPayable;
  const profitLoss = takeHome - buying;
  const profitLossPercentage = buying > 0 ? profitLoss / buying : null;

  return {
    buying, selling, srbPayable,
    salesTax, invoiceAmount, withholdingTax,
    salesTaxDeduction, chequeAmount, takeHome,
    profitLoss, profitLossPercentage,
  };
}

function calculate(invoiceType, buying, selling, srbPayable, rates) {
  switch (invoiceType) {
    case 'salesTax':
      return calculateSalesTaxInvoice(buying, selling, srbPayable, rates);
    case 'sevenPercent':
      return calculateSevenPercentInvoice(buying, selling, srbPayable, rates);
    case 'punjabSalesTax':
      return calculatePunjabSalesTaxInvoice(buying, selling, srbPayable, rates);
    default:
      return calculateSalesTaxInvoice(buying, selling, srbPayable, rates);
  }
}

// ─── Formatters ───────────────────────────────────────────────
function formatNumber(value) {
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

function formatPercentage(value) {
  if (value === null || !Number.isFinite(value)) return '—';
  const pct = Math.round(value * 10000) / 100;
  const parts = pct.toString().split('.');
  const intPart = parts[0];
  const decPart = parts[1];
  if (decPart) return `${intPart}.${decPart}%`;
  return `${intPart}%`;
}

function generateSummaryText(invoiceType, result) {
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

// ─── State Management ─────────────────────────────────────────
function createDefaultInvoiceState(type) {
  return {
    buying: '',
    selling: '',
    srbPayable: '',
    rates: { ...DEFAULT_RATES[type] },
  };
}

function createDefaultState() {
  return {
    activeTab: 'salesTax',
    invoices: {
      salesTax: createDefaultInvoiceState('salesTax'),
      sevenPercent: createDefaultInvoiceState('sevenPercent'),
      punjabSalesTax: createDefaultInvoiceState('punjabSalesTax'),
    },
  };
}

function loadState() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.activeTab && parsed.invoices) {
          const defaults = createDefaultState();
          for (const key of INVOICE_TYPES) {
            if (!parsed.invoices[key]) {
              parsed.invoices[key] = defaults.invoices[key];
            }
          }
          return parsed;
        }
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return createDefaultState();
}

function saveState(state) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    // Ignore storage errors
  }
}

// Global App State
let state = loadState();
let isTaxSettingsOpen = false;

// ─── DOM References ───────────────────────────────────────────
const elements = {};

function initElements() {
  if (typeof document === 'undefined') return;

  elements.tabs = document.querySelectorAll('.invoice-tab');
  elements.inputBuying = document.getElementById('input-buying');
  elements.inputSelling = document.getElementById('input-selling');
  elements.inputSrb = document.getElementById('input-srb');
  elements.buyingError = document.getElementById('buying-error');
  elements.sellingError = document.getElementById('selling-error');

  elements.resultTakeHome = document.getElementById('result-take-home');
  elements.resultProfitLoss = document.getElementById('result-profit-loss');
  elements.resultProfitIndicator = document.getElementById('result-profit-indicator');
  elements.resultProfitCard = document.getElementById('result-profit-card');
  elements.resultProfitPct = document.getElementById('result-profit-pct');
  elements.resultProfitPctCard = document.getElementById('result-profit-pct-card');

  elements.bdBuying = document.getElementById('bd-buying');
  elements.bdSelling = document.getElementById('bd-selling');
  elements.bdSalesTax = document.getElementById('bd-sales-tax');
  elements.bdInvoiceAmount = document.getElementById('bd-invoice-amount');
  elements.bdWithholdingTax = document.getElementById('bd-withholding-tax');
  elements.bdSalesTaxDeduction = document.getElementById('bd-sales-tax-deduction');
  elements.bdChequeAmount = document.getElementById('bd-cheque-amount');
  elements.bdSrbPayable = document.getElementById('bd-srb-payable');
  elements.bdTakeHome = document.getElementById('bd-take-home');
  elements.bdProfitLoss = document.getElementById('bd-profit-loss');
  elements.bdPercentage = document.getElementById('bd-percentage');

  elements.btnCopy = document.getElementById('btn-copy');
  elements.btnShare = document.getElementById('btn-share');
  elements.btnPdf = document.getElementById('btn-pdf');
  elements.btnReset = document.getElementById('btn-reset');

  elements.resetConfirm = document.getElementById('reset-confirm');
  elements.btnConfirmReset = document.getElementById('btn-confirm-reset');
  elements.btnCancelReset = document.getElementById('btn-cancel-reset');
  elements.resetBackdrop = document.getElementById('reset-backdrop');

  elements.taxSettingsToggle = document.getElementById('tax-settings-toggle');
  elements.taxSettingsChevron = document.getElementById('tax-settings-chevron');
  elements.taxSettingsPanel = document.getElementById('tax-settings-panel');
  elements.rateSalesGroup = document.getElementById('rate-sales-group');
  elements.rateSalesLabel = document.getElementById('rate-sales-label');
  elements.rateSalesInput = document.getElementById('rate-sales-input');
  elements.rateWithholdingGroup = document.getElementById('rate-withholding-group');
  elements.rateWithholdingInput = document.getElementById('rate-withholding-input');
  elements.rateDeductionGroup = document.getElementById('rate-deduction-group');
  elements.rateDeductionInput = document.getElementById('rate-deduction-input');
  elements.btnRestoreRates = document.getElementById('btn-restore-rates');

  elements.desktopTableBody = document.getElementById('desktop-table-body');
  elements.toast = document.getElementById('toast');
  elements.toastMessage = document.getElementById('toast-message');
}

// ─── Toast System ─────────────────────────────────────────────
let toastTimeout = null;

function showToast(message) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  elements.toastMessage.textContent = message;
  elements.toast.classList.remove('hidden');
  toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2500);
}

// ─── Calculations & Rendering ─────────────────────────────────
function getCurrentInvoice() {
  return state.invoices[state.activeTab];
}

function calculateActiveResult() {
  const inv = getCurrentInvoice();
  const buying = parseInput(inv.buying);
  const selling = parseInput(inv.selling);
  const srbPayable = parseInput(inv.srbPayable);
  return calculate(state.activeTab, buying, selling, srbPayable, inv.rates);
}

function calculateAllResultMap() {
  const results = {};
  for (const type of INVOICE_TYPES) {
    const inv = state.invoices[type];
    const buying = parseInput(inv.buying);
    const selling = parseInput(inv.selling);
    const srbPayable = parseInput(inv.srbPayable);
    results[type] = calculate(type, buying, selling, srbPayable, inv.rates);
  }
  return results;
}

function getRateBadge(type, rates) {
  const pct = (rates.salesTaxRate * 100).toFixed(0);
  switch (type) {
    case 'salesTax':
      return `${pct}%`;
    case 'sevenPercent':
      return `${pct}% (embedded)`;
    case 'punjabSalesTax':
      return `${pct}%`;
    default:
      return `${pct}%`;
  }
}

function render() {
  const activeTab = state.activeTab;
  const inv = getCurrentInvoice();
  const result = calculateActiveResult();
  const allResults = calculateAllResultMap();

  // 1. Tab buttons
  elements.tabs.forEach((tabBtn) => {
    const tabName = tabBtn.dataset.tab;
    const isActive = tabName === activeTab;
    tabBtn.classList.toggle('invoice-tab--active', isActive);
    tabBtn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // 2. Input Fields
  if (elements.inputBuying.value !== inv.buying) {
    elements.inputBuying.value = inv.buying;
  }
  if (elements.inputSelling.value !== inv.selling) {
    elements.inputSelling.value = inv.selling;
  }
  if (elements.inputSrb.value !== inv.srbPayable) {
    elements.inputSrb.value = inv.srbPayable;
  }

  // 3. Validation States
  const buyingNum = parseInput(inv.buying);
  const sellingNum = parseInput(inv.selling);
  const buyingNegative = buyingNum < 0;
  const sellingNegative = sellingNum < 0;

  elements.inputBuying.classList.toggle('input-field--error', buyingNegative);
  elements.buyingError.style.display = buyingNegative ? 'block' : 'none';

  elements.inputSelling.classList.toggle('input-field--error', sellingNegative);
  elements.sellingError.style.display = sellingNegative ? 'block' : 'none';

  // 4. Result Summary Cards
  elements.resultTakeHome.textContent = formatNumber(result.takeHome);
  elements.resultProfitLoss.textContent = formatNumber(result.profitLoss);
  elements.resultProfitPct.textContent = formatPercentage(result.profitLossPercentage);

  const profitLossClass =
    result.profitLoss > 0
      ? 'result-positive'
      : result.profitLoss < 0
        ? 'result-negative'
        : 'result-neutral';

  const profitLossLabel =
    result.profitLoss > 0 ? '↑ Profit' : result.profitLoss < 0 ? '↓ Loss' : 'Break-even';

  elements.resultProfitIndicator.textContent = profitLossLabel;
  elements.resultProfitIndicator.setAttribute('aria-label', profitLossLabel);

  // Update card classes
  elements.resultProfitCard.className = `result-card result-card--highlight ${profitLossClass}`;
  elements.resultProfitPctCard.className = `result-card ${profitLossClass}`;

  // 5. Calculation Breakdown
  elements.bdBuying.textContent = formatNumber(result.buying);
  elements.bdSelling.textContent = formatNumber(result.selling);
  elements.bdSalesTax.textContent = formatNumber(result.salesTax);
  elements.bdInvoiceAmount.textContent = formatNumber(result.invoiceAmount);
  elements.bdWithholdingTax.textContent = formatNumber(result.withholdingTax);
  elements.bdSalesTaxDeduction.textContent = formatNumber(result.salesTaxDeduction);
  elements.bdChequeAmount.textContent = formatNumber(result.chequeAmount);
  elements.bdSrbPayable.textContent = formatNumber(result.srbPayable);
  elements.bdTakeHome.textContent = formatNumber(result.takeHome);
  elements.bdProfitLoss.textContent = formatNumber(result.profitLoss);
  elements.bdPercentage.textContent = formatPercentage(result.profitLossPercentage);

  // 6. Tax Settings Panel
  elements.rateSalesLabel.textContent = `${RATE_LABELS[activeTab]} Rate`;
  elements.rateSalesInput.value = Math.round(inv.rates.salesTaxRate * 10000) / 100;
  elements.rateWithholdingInput.value = Math.round(inv.rates.withholdingTaxRate * 10000) / 100;
  elements.rateDeductionInput.value = Math.round(inv.rates.salesTaxDeductionRate * 10000) / 100;

  // 7% invoice hides deduction rate
  elements.rateDeductionGroup.classList.toggle('hidden', activeTab === 'sevenPercent');

  // Show "Restore Default Rates" if rates differ from defaults
  const defaults = DEFAULT_RATES[activeTab];
  const hasChanges =
    inv.rates.salesTaxRate !== defaults.salesTaxRate ||
    inv.rates.withholdingTaxRate !== defaults.withholdingTaxRate ||
    inv.rates.salesTaxDeductionRate !== defaults.salesTaxDeductionRate;

  elements.btnRestoreRates.classList.toggle('hidden', !hasChanges);

  // 7. Desktop Comparative Table
  renderDesktopTable(allResults);

  // Save State
  saveState(state);
}

function renderDesktopTable(allResults) {
  if (!elements.desktopTableBody) return;

  elements.desktopTableBody.innerHTML = '';
  INVOICE_TYPES.forEach((type) => {
    const res = allResults[type];
    const inv = state.invoices[type];
    const profitClass =
      res.profitLoss > 0 ? 'dt-profit' : res.profitLoss < 0 ? 'dt-loss' : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="dt-cell dt-cell--type">${INVOICE_TYPE_LABELS[type]}</td>
      <td class="dt-cell dt-cell--rate">${getRateBadge(type, inv.rates)}</td>
      <td class="dt-cell dt-cell--input">${formatNumber(res.buying)}</td>
      <td class="dt-cell dt-cell--input">${formatNumber(res.selling)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.salesTax)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.invoiceAmount)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.withholdingTax)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.salesTaxDeduction)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.chequeAmount)}</td>
      <td class="dt-cell dt-cell--input">${formatNumber(res.srbPayable)}</td>
      <td class="dt-cell dt-cell--output">${formatNumber(res.takeHome)}</td>
      <td class="dt-cell dt-cell--output ${profitClass}">${formatNumber(res.profitLoss)}</td>
      <td class="dt-cell dt-cell--output ${profitClass}">${formatPercentage(res.profitLossPercentage)}</td>
    `;
    elements.desktopTableBody.appendChild(tr);
  });
}

// ─── Sanitization & Input Handlers ────────────────────────────
function sanitizeInput(value) {
  return value.replace(/[^0-9.\-]/g, '');
}

function handleInputChange(field, value) {
  const sanitized = sanitizeInput(value);
  state.invoices[state.activeTab][field] = sanitized;
  render();
}

function handleRateChange(field, valueStr) {
  const value = parseFloat(valueStr);
  if (Number.isFinite(value)) {
    state.invoices[state.activeTab].rates[field] = value / 100;
    render();
  }
}

// ─── Clipboard & Share ────────────────────────────────────────
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Summary copied to clipboard!');
  } catch (err) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Summary copied to clipboard!');
    } catch {
      showToast('Unable to copy. Please copy manually.');
    }
  }
}

async function shareOrCopy(text) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Tax & Profit Calculation',
        text: text,
      });
      return;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
    }
  }
  await copyToClipboard(text);
}

// ─── PDF Generation & Download ────────────────────────────────
function downloadPdfRecord() {
  const result = calculateActiveResult();
  const inv = getCurrentInvoice();
  const invoiceType = state.activeTab;
  const invoiceLabel = INVOICE_TYPE_LABELS[invoiceType];
  const allResults = calculateAllResultMap();

  // Check if jsPDF is available
  const jspdfLib = window.jspdf ? window.jspdf.jsPDF : null;

  if (!jspdfLib) {
    // Graceful fallback to browser print dialog
    showToast('Opening print dialog for PDF...');
    window.print();
    return;
  }

  try {
    const doc = new jspdfLib({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Header Background Accent Bar
    doc.setFillColor(30, 41, 59); // Slate 800
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX & PROFIT CALCULATION RECORD', 14, 13);

    // Currency & Date Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225); // Slate 300
    doc.text(`Currency: PKR  |  Date: ${dateStr} at ${timeStr}`, 14, 20);

    // Invoice Type Badge
    doc.setFillColor(99, 102, 241); // Indigo
    doc.roundedRect(pageWidth - 68, 8, 54, 12, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(invoiceLabel, pageWidth - 41, 15.5, { align: 'center' });

    let currentY = 38;

    // ── Key Metrics Summary Cards (3 Columns) ──────────────────
    const cardWidth = (pageWidth - 28 - 8) / 3;
    const cardHeight = 22;

    // Card 1: Take-Home
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TAKE-HOME', 18, currentY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`PKR ${formatNumber(result.takeHome)}`, 18, currentY + 16);

    // Card 2: Net Profit / Loss
    const isProfit = result.profitLoss > 0;
    const isLoss = result.profitLoss < 0;
    const profitColor = isProfit ? [16, 185, 129] : isLoss ? [239, 68, 68] : [100, 116, 139];
    const profitLabel = isProfit ? 'NET PROFIT' : isLoss ? 'NET LOSS' : 'BREAK-EVEN';

    doc.setFillColor(isProfit ? 236 : isLoss ? 254 : 248, isProfit ? 253 : isLoss ? 242 : 250, isProfit ? 245 : isLoss ? 242 : 252);
    doc.setDrawColor(profitColor[0], profitColor[1], profitColor[2]);
    doc.roundedRect(14 + cardWidth + 4, currentY, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
    doc.text(profitLabel, 18 + cardWidth + 4, currentY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
    doc.text(`PKR ${formatNumber(result.profitLoss)}`, 18 + cardWidth + 4, currentY + 16);

    // Card 3: Margin Percentage
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14 + (cardWidth + 4) * 2, currentY, cardWidth, cardHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('PROFIT MARGIN %', 18 + (cardWidth + 4) * 2, currentY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
    doc.text(formatPercentage(result.profitLossPercentage), 18 + (cardWidth + 4) * 2, currentY + 16);

    currentY += 28;

    // ── Primary Breakdown Table ─────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text('Calculation Breakdown', 14, currentY);
    currentY += 4;

    const breakdownData = [
      ['Buying Amount', 'Input', formatNumber(result.buying)],
      ['Selling Amount', 'Input', formatNumber(result.selling)],
      ['Sales Tax', `${(inv.rates.salesTaxRate * 100).toFixed(1)}% applied`, formatNumber(result.salesTax)],
      ['Total Invoice Amount', 'Gross Invoice Total', formatNumber(result.invoiceAmount)],
      ['Withholding Tax', `${(inv.rates.withholdingTaxRate * 100).toFixed(1)}% applied`, formatNumber(result.withholdingTax)],
      ['Sales Tax Deduction', invoiceType === 'sevenPercent' ? 'N/A (0%)' : `${(inv.rates.salesTaxDeductionRate * 100).toFixed(1)}% applied`, formatNumber(result.salesTaxDeduction)],
      ['Cheque Amount', 'Net Received via Cheque', formatNumber(result.chequeAmount)],
      ['SRB Payable', 'Input (Service Tax)', formatNumber(result.srbPayable)],
      ['Take-home Amount', 'Net Realized Cash', formatNumber(result.takeHome)],
      ['Profit / Loss', isProfit ? 'Profit' : isLoss ? 'Loss' : 'Neutral', formatNumber(result.profitLoss)],
      ['Profit / Loss %', 'Based on Buying Cost', formatPercentage(result.profitLossPercentage)],
    ];

    if (doc.autoTable) {
      doc.autoTable({
        startY: currentY,
        head: [['Item Description', 'Basis / Rate', 'Amount (PKR)']],
        body: breakdownData,
        theme: 'striped',
        headStyles: {
          fillColor: [37, 99, 235], // Blue 600
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
          halign: 'left',
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 60, textColor: [100, 116, 139] },
          2: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        didParseCell: function (data) {
          if (data.section === 'body') {
            if (data.row.index === 9 || data.row.index === 10) {
              // Highlight profit/loss row
              if (isProfit) {
                data.cell.styles.textColor = [5, 150, 105];
              } else if (isLoss) {
                data.cell.styles.textColor = [220, 38, 38];
              }
            }
          }
        },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // ── Comparative Table for All 3 Invoice Types ───────────────
    if (doc.autoTable && currentY < 235) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Comparative Summary (All Invoice Types)', 14, currentY);
      currentY += 4;

      const compData = INVOICE_TYPES.map((type) => {
        const r = allResults[type];
        const invoice = state.invoices[type];
        return [
          INVOICE_TYPE_LABELS[type],
          getRateBadge(type, invoice.rates),
          formatNumber(r.buying),
          formatNumber(r.selling),
          formatNumber(r.salesTax),
          formatNumber(r.invoiceAmount),
          formatNumber(r.takeHome),
          formatNumber(r.profitLoss),
          formatPercentage(r.profitLossPercentage),
        ];
      });

      doc.autoTable({
        startY: currentY,
        head: [['Invoice Type', 'Rate', 'Buying', 'Selling', 'Sales Tax', 'Invoice', 'Take-Home', 'Profit/Loss', 'Margin']],
        body: compData,
        theme: 'grid',
        headStyles: {
          fillColor: [79, 70, 229], // Indigo 600
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
          halign: 'center',
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          halign: 'right',
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold' },
          1: { halign: 'center' },
        },
      });
      currentY = doc.lastAutoTable.finalY + 8;
    }

    // ── Footer ──────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      'Generated by Tax & Profit Calculator — All calculations adhere to Pakistani Tax regulations.',
      14,
      doc.internal.pageSize.getHeight() - 8
    );

    // Save PDF
    const filename = `Tax_Calculation_${invoiceType}_${now.toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    showToast('PDF record downloaded successfully!');
  } catch (error) {
    console.error('PDF export error:', error);
    showToast('Opening print dialog for PDF...');
    window.print();
  }
}

// ─── Event Listeners Setup ────────────────────────────────────
function setupEventListeners() {
  // Tab switching
  elements.tabs.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      state.activeTab = tabBtn.dataset.tab;
      render();
    });
  });

  // Inputs
  const preventWheel = (e) => e.target.blur();

  elements.inputBuying.addEventListener('input', (e) => handleInputChange('buying', e.target.value));
  elements.inputBuying.addEventListener('wheel', preventWheel);

  elements.inputSelling.addEventListener('input', (e) => handleInputChange('selling', e.target.value));
  elements.inputSelling.addEventListener('wheel', preventWheel);

  elements.inputSrb.addEventListener('input', (e) => handleInputChange('srbPayable', e.target.value));
  elements.inputSrb.addEventListener('wheel', preventWheel);

  // Action buttons
  elements.btnCopy.addEventListener('click', () => {
    const result = calculateActiveResult();
    const text = generateSummaryText(state.activeTab, result);
    copyToClipboard(text);
  });

  elements.btnShare.addEventListener('click', () => {
    const result = calculateActiveResult();
    const text = generateSummaryText(state.activeTab, result);
    shareOrCopy(text);
  });

  elements.btnPdf.addEventListener('click', () => {
    downloadPdfRecord();
  });

  elements.btnReset.addEventListener('click', () => {
    elements.resetConfirm.classList.remove('hidden');
  });

  // Reset confirmation modal
  const hideResetDialog = () => {
    elements.resetConfirm.classList.add('hidden');
  };

  elements.btnCancelReset.addEventListener('click', hideResetDialog);
  elements.resetBackdrop.addEventListener('click', hideResetDialog);

  elements.btnConfirmReset.addEventListener('click', () => {
    state.invoices[state.activeTab] = createDefaultInvoiceState(state.activeTab);
    hideResetDialog();
    render();
    showToast('Values reset for this invoice type');
  });

  // Tax settings toggle
  elements.taxSettingsToggle.addEventListener('click', () => {
    isTaxSettingsOpen = !isTaxSettingsOpen;
    elements.taxSettingsToggle.setAttribute('aria-expanded', isTaxSettingsOpen ? 'true' : 'false');
    elements.taxSettingsChevron.classList.toggle('tax-settings__chevron--open', isTaxSettingsOpen);
    elements.taxSettingsPanel.classList.toggle('hidden', !isTaxSettingsOpen);
  });

  // Tax rates inputs
  elements.rateSalesInput.addEventListener('input', (e) => handleRateChange('salesTaxRate', e.target.value));
  elements.rateWithholdingInput.addEventListener('input', (e) => handleRateChange('withholdingTaxRate', e.target.value));
  elements.rateDeductionInput.addEventListener('input', (e) => handleRateChange('salesTaxDeductionRate', e.target.value));

  // Restore default rates
  elements.btnRestoreRates.addEventListener('click', () => {
    state.invoices[state.activeTab].rates = { ...DEFAULT_RATES[state.activeTab] };
    render();
    showToast('Tax rates restored to defaults');
  });
}

// ─── Initialization ───────────────────────────────────────────
if (typeof document !== 'undefined') {
  const initApp = () => {
    initElements();
    setupEventListeners();
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}

// Export calculation functions for automated verification
if (typeof globalThis !== 'undefined') {
  globalThis.taxCalc = {
    calculate,
    parseInput,
    formatNumber,
    formatPercentage,
    generateSummaryText,
    DEFAULT_RATES,
  };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalThis.taxCalc;
}
