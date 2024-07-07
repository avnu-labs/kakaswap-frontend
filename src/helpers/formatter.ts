// Convert hexadecimal value to ascii text
export const hexToAscii = (hexValue: string) => {
  let str = "";
  for (let n = 0; n < hexValue.length; n += 2) {
    str += String.fromCharCode(parseInt(hexValue.substr(n, 2), 16));
  }
  return str.replace(/\0/g, "");
};

export const currencyFormatter = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((innerItem) => {
      return num >= innerItem.value;
    });
  const dollarUSLocale = Intl.NumberFormat("en-US");
  return item
    ? dollarUSLocale.format(parseFloat((num / item.value).toFixed(2))).replace(rx, "$1") + item.symbol
    : num.toFixed(2);
};
