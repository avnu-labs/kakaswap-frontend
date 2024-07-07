/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "Kakaswap | AMM on Kakarot",
  titleTemplate: "%s",
  defaultTitle: "Kakaswap | AMM on Kakarot",
  description: "Your main AMM on Kakarot",
  openGraph: {
    url: "https://kakaswap.xyz",
    title: "Kakaswap",
    description: "Your main AMM on Kakarot",
    /* images: [
      {
        url: "https://kakaswap.xyz/xxx.png",
        alt: "Kakaswap logo",
      },
    ], */
    site_name: "Kakaswap",
  },
  twitter: {
    handle: "@KakarotZkEvm",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
