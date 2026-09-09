import { z } from "zod";

export const stockSchema = z
  .number({ message: "Stock count is required" })
  .finite({ message: "Stock count must be a valid number" })
  .int({ message: "Stock count must be a whole number" })
  .nonnegative({ message: "Stock count cannot be negative" });