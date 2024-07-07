import { fireEvent, render } from "@testing-library/react";

import InputPositiveNumber from "./InputPositiveNumber";

describe("<InputPositiveNumber />", () => {
  it("should display input with given value", () => {
    // Given
    const onChangeNumberMock = jest.fn();
    const container = render(<InputPositiveNumber value="1" onChangeNumber={onChangeNumberMock} />);

    // Then
    expect(container.getByDisplayValue("1")).toBeDefined();
  });

  it("should display call onChangeNumber on change", () => {
    // Given
    const onChangeNumberMock = jest.fn();
    const container = render(<InputPositiveNumber value="1" onChangeNumber={onChangeNumberMock} />);

    // When
    fireEvent.change(container.getByRole("textbox"), { target: { value: "2.5" } });

    // Then
    expect(onChangeNumberMock.mock.calls.length).toBe(1);
    expect(onChangeNumberMock.mock.calls[0][0]).toStrictEqual("2.5");
  });

  it("should call onChangeNumber with empty value when value is empty", () => {
    // Given
    const onChangeNumberMock = jest.fn();
    const container = render(<InputPositiveNumber value="1" onChangeNumber={onChangeNumberMock} />);

    // When
    fireEvent.change(container.getByRole("textbox"), { target: { value: "" } });

    // Then
    expect(onChangeNumberMock.mock.calls.length).toBe(1);
    expect(onChangeNumberMock.mock.calls[0][0]).toStrictEqual("");
  });

  it("should not call onChangeNumber when value is not a positive number", () => {
    // Given
    const onChangeNumberMock = jest.fn();
    const container = render(<InputPositiveNumber value="1" onChangeNumber={onChangeNumberMock} />);

    // When
    fireEvent.change(container.getByRole("textbox"), { target: { value: "e" } });

    // Then
    expect(onChangeNumberMock.mock.calls.length).toBe(0);
  });
});
