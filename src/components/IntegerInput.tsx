import React, { useState, useEffect, useRef } from 'react';

export interface IntegerInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
  id?: string;
  title?: string;
  'aria-label'?: string;
}

/**
 * Robust integer-only numeric input component.
 * - Always displays pure whole numbers (integers, no decimals).
 * - Allows natural keyboard editing: Backspace, Delete, Ctrl+A, typing, arrow keys.
 * - Auto-selects on focus so typing immediately replaces the value.
 * - Never prefixes unwanted '0' (e.g. typing 4 then 1 doesn't produce '04').
 * - Preserves empty state while user is clearing and typing new digits.
 */
export const IntegerInput: React.FC<IntegerInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  className = '',
  id,
  title,
  'aria-label': ariaLabel,
}) => {
  const safeInitial = Math.round(Number(value) || 0);
  const [localText, setLocalText] = useState<string>(() => String(safeInitial));
  const isFocusedRef = useRef(false);

  // Sync external value when not actively focused
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalText(String(Math.round(Number(value) || 0)));
    }
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    // Standard professional tool behavior: auto-select so typing replaces the existing value
    e.currentTarget.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Field completely emptied by Backspace or Delete
    if (raw === '') {
      setLocalText('');
      return;
    }

    // Strip any non-digit character (dots, commas, letters, signs)
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly === '') {
      setLocalText('');
      return;
    }

    // Strip leading zeroes unless the number is simply "0"
    // e.g. "04" -> "4", "00" -> "0"
    let cleaned = digitsOnly;
    if (cleaned.length > 1 && cleaned.startsWith('0')) {
      cleaned = cleaned.replace(/^0+/, '') || '0';
    }

    const parsed = parseInt(cleaned, 10);

    if (!isNaN(parsed)) {
      if (parsed > max) {
        // Clamp to max if exceeding
        setLocalText(String(max));
        onChange(max);
        return;
      }

      setLocalText(cleaned);

      // If within [min, max], propagate change immediately for live preview
      if (parsed >= min && parsed <= max) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;

    if (localText === '') {
      // If left empty, revert safely to prop value clamped within bounds
      const fallback = Math.max(min, Math.min(max, Math.round(Number(value) || min)));
      setLocalText(String(fallback));
      onChange(fallback);
      return;
    }

    let parsed = parseInt(localText, 10);
    if (isNaN(parsed)) {
      parsed = Math.round(Number(value) || min);
    }
    if (parsed < min) parsed = min;
    if (parsed > max) parsed = max;

    setLocalText(String(parsed));
    onChange(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = parseInt(localText, 10);
      const base = isNaN(current) ? Math.round(Number(value) || min) : current;
      const next = Math.min(max, base + 1);
      setLocalText(String(next));
      onChange(next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseInt(localText, 10);
      const base = isNaN(current) ? Math.round(Number(value) || min) : current;
      const next = Math.max(min, base - 1);
      setLocalText(String(next));
      onChange(next);
    } else if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      id={id}
      title={title}
      aria-label={ariaLabel}
      value={localText}
      onFocus={handleFocus}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
};
