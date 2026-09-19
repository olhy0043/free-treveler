import { describe, expect, it } from "vitest";
import { validateFlightDates } from "@/components/travel-tools/FlightForm";
import { validateHotelDates } from "@/components/travel-tools/HotelForm";

const TODAY = "2026-06-15";
const YESTERDAY = "2026-06-14";
const TOMORROW = "2026-06-16";
const LATER = "2026-06-20";

describe("validateFlightDates", () => {
  it("rejects a departure date before today", () => {
    expect(validateFlightDates(YESTERDAY, LATER, TODAY)).not.toBeNull();
  });

  it("accepts a departure date of today", () => {
    expect(validateFlightDates(TODAY, LATER, TODAY)).toBeNull();
  });

  it("rejects a return date before the departure date", () => {
    expect(validateFlightDates(LATER, TOMORROW, TODAY)).not.toBeNull();
  });

  it("accepts a return date equal to the departure date", () => {
    expect(validateFlightDates(TOMORROW, TOMORROW, TODAY)).toBeNull();
  });

  it("accepts a valid future round trip", () => {
    expect(validateFlightDates(TOMORROW, LATER, TODAY)).toBeNull();
  });
});

describe("validateHotelDates", () => {
  it("rejects a check-in date before today", () => {
    expect(validateHotelDates(YESTERDAY, LATER, TODAY)).not.toBeNull();
  });

  it("accepts a check-in date of today", () => {
    expect(validateHotelDates(TODAY, TOMORROW, TODAY)).toBeNull();
  });

  it("rejects a check-out date equal to check-in", () => {
    expect(validateHotelDates(TOMORROW, TOMORROW, TODAY)).not.toBeNull();
  });

  it("rejects a check-out date before check-in", () => {
    expect(validateHotelDates(LATER, TOMORROW, TODAY)).not.toBeNull();
  });

  it("accepts a check-out date after check-in", () => {
    expect(validateHotelDates(TOMORROW, LATER, TODAY)).toBeNull();
  });
});
