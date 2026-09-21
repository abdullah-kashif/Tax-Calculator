import { useState, useCallback } from 'react';

export function useShareOrCopy() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const shareOrCopy = useCallback(
    async (text: string) => {
      if (navigator.share) {
        try {
          await navigator.share({ text });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(text);
        showToast('Summary copied to clipboard!');
      } catch {
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
    },
    [showToast]
  );

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast('Summary copied to clipboard!');
      } catch {
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
    },
    [showToast]
  );

  return { shareOrCopy, copyToClipboard, toastMessage, showToast };
}
