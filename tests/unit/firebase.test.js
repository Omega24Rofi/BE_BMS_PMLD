const firebaseService = require("../../src/services/firebaseService");

describe("Firebase Service Tests", () => {
  test("should save battery data to Firebase", async () => {
    const testData = {
      voltage: 12.5,
      current: 2.3,
      temperature: 25.5,
      soc: 85,
      status: "charging",
    };

    const result = await firebaseService.saveBatteryData(testData);
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("timestamp");
  });

  test("should retrieve last month data", async () => {
    const data = await firebaseService.getBatteryDataLastMonth();
    expect(Array.isArray(data)).toBe(true);
  });

  test("should retrieve latest battery data", async () => {
    const data = await firebaseService.getLatestBatteryData(5);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeLessThanOrEqual(5);
  });
});
