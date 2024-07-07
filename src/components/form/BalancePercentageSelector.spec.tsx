import { fireEvent, render } from "@testing-library/react";

import { aTokenState } from "../../context/WalletBaseProvider/wallet.fixture";

import BalancePercentageSelector from "./BalancePercentageSelector";

describe("<BalancePercentageSelector />", () => {
  it("should display only display FontAwesomeIcon when token is undefined", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector token={undefined} disabled={false} onChangeAmount={onChangeAmount} />
    );

    // Then
    expect(container.container.getElementsByClassName("fa-wallet").length).toBe(1);
    expect(container.queryByText("25%")).toBeNull();
    expect(container.queryByText("50%")).toBeNull();
    expect(container.queryByText("75%")).toBeNull();
    expect(container.queryByText("23.50")).toBeNull();
  });

  it("should hide percentage selectors when disabled is true", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.5" }}
        disabled
        onChangeAmount={onChangeAmount}
      />
    );

    // Then
    expect(container.container.getElementsByClassName("fa-wallet").length).toBe(1);
    expect(container.queryByText("25%")).toBeNull();
    expect(container.queryByText("50%")).toBeNull();
    expect(container.queryByText("75%")).toBeNull();
    expect(container.getByText("23.50")).toBeDefined();
  });

  it("should display percentage selectors when token is defined", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.5" }}
        disabled={false}
        onChangeAmount={onChangeAmount}
      />
    );

    // Then
    expect(container.container.getElementsByClassName("fa-wallet").length).toBe(1);
    expect(container.getByText("25%")).toBeDefined();
    expect(container.getByText("50%")).toBeDefined();
    expect(container.getByText("75%")).toBeDefined();
    expect(container.getByText("23.50")).toBeDefined();
  });

  it("should trigger onChangeAmount when click on balance", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.5" }}
        disabled={false}
        onChangeAmount={onChangeAmount}
      />
    );

    // When
    fireEvent.click(container.getByText("23.50"));

    // Then
    expect(onChangeAmount.mock.calls.length).toBe(1);
    expect(onChangeAmount.mock.calls[0][0]).toStrictEqual("23.5");
  });

  it("should trigger onChangeAmount when click on percent", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.5" }}
        disabled={false}
        onChangeAmount={onChangeAmount}
      />
    );

    // When
    fireEvent.click(container.getByText("50%"));

    // Then
    expect(onChangeAmount.mock.calls.length).toBe(1);
    expect(onChangeAmount.mock.calls[0][0]).toStrictEqual("11.75");
  });

  it("should trigger onChangeAmount with toFixed value when decimals are too big", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.7777", decimals: 3 }}
        disabled={false}
        onChangeAmount={onChangeAmount}
      />
    );

    // When
    fireEvent.click(container.getByText("50%"));

    // Then
    expect(onChangeAmount.mock.calls.length).toBe(1);
    expect(onChangeAmount.mock.calls[0][0]).toStrictEqual("11.889");
  });

  it("should not trigger onChangeAmount when click on percent and disabled is true", () => {
    // Given
    const onChangeAmount = jest.fn();
    const container = render(
      <BalancePercentageSelector
        token={{ ...aTokenState(), balance: "23.5" }}
        disabled
        onChangeAmount={onChangeAmount}
      />
    );

    // When
    fireEvent.click(container.getByText("23.50"));

    // Then
    expect(onChangeAmount.mock.calls.length).toBe(0);
  });
});
