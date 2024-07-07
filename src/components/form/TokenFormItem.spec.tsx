import { render } from "@testing-library/react";

import { aTokenState } from "../../context/WalletBaseProvider/wallet.fixture";

import TokenFormItem from "./TokenFormItem";

jest.mock("./../coin/CoinChooser", () => () => <span>CoinChooser</span>);
jest.mock("./InputPositiveNumber", () => () => <span>InputPositiveNumber</span>);
jest.mock("./BalancePercentageSelector", () => () => <span>BalancePercentageSelector</span>);

describe("<TokenFormItem />", () => {
  it(`should display token's label, BalancePercentageSelector, InputPositiveNumber and CoinChooser`, () => {
    // Given
    const onChangeTokenMock = jest.fn();
    const onChangeAmountMock = jest.fn();
    const container = render(
      <TokenFormItem
        label="Token 1"
        amount="1"
        token={aTokenState()}
        onChangeToken={onChangeTokenMock}
        onChangeAmount={onChangeAmountMock}
      />
    );

    // Then
    expect(container.getByText("Token 1")).toBeDefined();
    expect(container.getByText("CoinChooser")).toBeDefined();
    expect(container.getByText("InputPositiveNumber")).toBeDefined();
    expect(container.getByText("BalancePercentageSelector")).toBeDefined();
  });

  it(`should hide balance percentages when onlyStatus is true`, () => {
    // Given
    const onChangeTokenMock = jest.fn();
    const onChangeAmountMock = jest.fn();
    const container = render(
      <TokenFormItem
        label="Token 1"
        amount="1"
        token={aTokenState()}
        onChangeToken={onChangeTokenMock}
        onChangeAmount={onChangeAmountMock}
        onlyStatus
      />
    );

    // Then
    expect(container.queryByText("BalancePercentageSelector")).toBeNull();
  });
});
