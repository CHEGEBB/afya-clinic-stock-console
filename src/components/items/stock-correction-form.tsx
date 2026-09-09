"use client";

import { useState } from "react";
import { z } from "zod";
import { updateStock } from "@/services/products";
import { ApiError } from "@/services/api-client";

const stockSchema = z
  .number({ message: "Stock count is required" })
  .int({ message: "Stock count must be a whole number" })
  .nonnegative({ message: "Stock count cannot be negative" });

interface StockCorrectionFormProps {
  productId: number;
  currentStock: number;
  onSaved: (newStock: number) => void;
  onCancel: () => void;
}

export function StockCorrectionForm({
  productId,
  currentStock,
  onSaved,
  onCancel,
}: StockCorrectionFormProps) {
  const [value, setValue] = useState(String(currentStock));
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const parsed = stockSchema.safeParse(Number(value));
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0].message);
      return;
    }
    setFieldError(null);
    setIsSaving(true);

    try {
      const updated = await updateStock(productId, parsed.data);
      onSaved(updated.stock);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? `Save failed (${err.status}). Please try again.`
          : "Save failed. Check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-text-primary">
          New stock count
        </label>
        <input
          id="stock"
          type="number"
          min={0}
          step={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full max-w-[160px] rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {fieldError && (
          <p className="mt-1 text-sm text-error-700" role="alert">
            {fieldError}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-error-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}