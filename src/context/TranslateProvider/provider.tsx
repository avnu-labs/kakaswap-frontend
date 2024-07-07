import { useRouter } from "next/router";
import type React from "react";
import { useMemo, useEffect, useState } from "react";

import en from "../../assets/locales/en";
import fr from "../../assets/locales/fr";
import type { TranslateState } from "context/TranslateProvider/model";

import { TranslateContext } from "./context";

export interface TranslateProviderProps {
  children: React.ReactNode;
}

export function TranslateProvider({ children }: TranslateProviderProps): JSX.Element {
  const router = useRouter();
  const getLocale = () => {
    return router.locale === "en" ? en : fr;
  };
  const [locale, setLocale] = useState<TranslateState>(getLocale());

  useEffect(() => {
    setLocale(getLocale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale]);

  const contextValue = useMemo(() => ({ t: locale, locale: router.locale }), [locale, router.locale]);

  return <TranslateContext.Provider value={contextValue}>{children}</TranslateContext.Provider>;
}
