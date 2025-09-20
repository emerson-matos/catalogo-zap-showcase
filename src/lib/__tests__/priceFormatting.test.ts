import { formatPriceBRL } from "../utils";

describe("formatPriceBRL", () => {
  it("should format number prices correctly", () => {
    expect(formatPriceBRL(1234.56)).toBe("R$ 1.234,56");
    expect(formatPriceBRL(0)).toBe("R$ 0,00");
    expect(formatPriceBRL(999.99)).toBe("R$ 999,99");
  });

  it("should format string prices correctly", () => {
    expect(formatPriceBRL("1234.56")).toBe("R$ 1.234,56");
    expect(formatPriceBRL("R$ 1.234,56")).toBe("R$ 1.234,56");
    expect(formatPriceBRL("2999.00")).toBe("R$ 2.999,00");
    expect(formatPriceBRL("0")).toBe("R$ 0,00");
  });

  it("should handle edge cases", () => {
    expect(formatPriceBRL("")).toBe("R$ 0,00");
    expect(formatPriceBRL("invalid")).toBe("R$ 0,00");
    expect(formatPriceBRL(null as any)).toBe("R$ 0,00");
    expect(formatPriceBRL(undefined as any)).toBe("R$ 0,00");
  });

  it("should handle Brazilian currency format", () => {
    expect(formatPriceBRL("R$ 2.999,00")).toBe("R$ 2.999,00");
    expect(formatPriceBRL("R$ 1.234,56")).toBe("R$ 1.234,56");
  });
});