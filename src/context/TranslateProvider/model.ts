export interface TranslateState {
  menu: any;
  whitelist: any;
  common: any;
  swap: any;
  pool: any;
}

export interface TranslateManagerState {
  t: TranslateState;
  locale: string | undefined;
}

export const TRANSLATE_STATE_INITIAL_STATE: TranslateManagerState = {
  t: {
    menu: {},
    whitelist: {},
    common: {},
    swap: {},
    pool: {},
  },
  locale: undefined,
};
