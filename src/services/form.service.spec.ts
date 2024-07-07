import { isPositiveNumber } from "./form.service";

describe("Form service", () => {
  describe("isPositiveNumber", () => {
    ["1", "2.55", "213123123.3234", "2."].forEach((value) =>
      it(`should return true when value is '${value}'`, () => {
        // When
        const result = isPositiveNumber(value);

        // Then
        expect(result).toBeTruthy();
      })
    );

    [undefined, "text", "-1", "-2.3234", "2,"].forEach((value) =>
      it(`should return false when value is '${value}'`, () => {
        // When
        const result = isPositiveNumber(value);

        // Then
        expect(result).toBeFalsy();
      })
    );
  });
});
