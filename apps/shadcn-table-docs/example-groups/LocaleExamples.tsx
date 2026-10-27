import type { ReactNode } from 'react';
import { LocaleExampleTabs } from '@/components/locale-example-tabs';
import AR_Table from '@/examples/localization-i18n-ar';
import AZ_Table from '@/examples/localization-i18n-az';
import BG_Table from '@/examples/localization-i18n-bg';
import CS_Table from '@/examples/localization-i18n-cs';
import DA_Table from '@/examples/localization-i18n-da';
import DE_Table from '@/examples/localization-i18n-de';
import EL_Table from '@/examples/localization-i18n-el';
import EN_Table from '@/examples/localization-i18n-en';
import ES_Table from '@/examples/localization-i18n-es';
import ET_Table from '@/examples/localization-i18n-et';
import FA_Table from '@/examples/localization-i18n-fa';
import FI_Table from '@/examples/localization-i18n-fi';
import FR_Table from '@/examples/localization-i18n-fr';
import HE_Table from '@/examples/localization-i18n-he';
import HR_TABLE from '@/examples/localization-i18n-hr';
import HU_Table from '@/examples/localization-i18n-hu';
import HY_Table from '@/examples/localization-i18n-hy';
import ID_Table from '@/examples/localization-i18n-id';
import IT_Table from '@/examples/localization-i18n-it';
import JA_Table from '@/examples/localization-i18n-ja';
import KO_Table from '@/examples/localization-i18n-ko';
import MK_Table from '@/examples/localization-i18n-mk';
import NL_Table from '@/examples/localization-i18n-nl';
import NO_Table from '@/examples/localization-i18n-no';
import NP_Table from '@/examples/localization-i18n-np';
import PL_Table from '@/examples/localization-i18n-pl';
import PT_BR_Table from '@/examples/localization-i18n-pt-BR';
import PT_Table from '@/examples/localization-i18n-pt';
import RO_Table from '@/examples/localization-i18n-ro';
import RU_Table from '@/examples/localization-i18n-ru';
import SK_Table from '@/examples/localization-i18n-sk';
import SR_Cyrl_RS_Table from '@/examples/localization-i18n-sr-Cyrl-RS';
import SR_Latn_RS_Table from '@/examples/localization-i18n-sr-Latn-RS';
import SV_Table from '@/examples/localization-i18n-sv';
import TR_Table from '@/examples/localization-i18n-tr';
import UK_Table from '@/examples/localization-i18n-uk';
import VI_Table from '@/examples/localization-i18n-vi';
import ZH_HANS_Table from '@/examples/localization-i18n-zh-hans';
import ZH_HANT_Table from '@/examples/localization-i18n-zh-hant';

const supportedLocales = [
  'ar',
  'az',
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fa',
  'fi',
  'fr',
  'he',
  'hr',
  'hu',
  'hy',
  'id',
  'it',
  'ja',
  'ko',
  'mk',
  'nl',
  'no',
  'np',
  'pl',
  'pt',
  'pt-BR',
  'ro',
  'ru',
  'sk',
  'sr-Cyrl-RS',
  'sr-Latn-RS',
  'sv',
  'tr',
  'uk',
  'vi',
  'zh-Hans',
  'zh-Hant',
];

const tables: Record<string, ReactNode> = {
  ar: <AR_Table />,
  az: <AZ_Table />,
  bg: <BG_Table />,
  cs: <CS_Table />,
  da: <DA_Table />,
  de: <DE_Table />,
  el: <EL_Table />,
  en: <EN_Table />,
  es: <ES_Table />,
  et: <ET_Table />,
  fa: <FA_Table />,
  fi: <FI_Table />,
  fr: <FR_Table />,
  he: <HE_Table />,
  hr: <HR_TABLE />,
  hu: <HU_Table />,
  hy: <HY_Table />,
  id: <ID_Table />,
  it: <IT_Table />,
  ja: <JA_Table />,
  ko: <KO_Table />,
  mk: <MK_Table />,
  nl: <NL_Table />,
  no: <NO_Table />,
  np: <NP_Table />,
  pl: <PL_Table />,
  pt: <PT_Table />,
  'pt-BR': <PT_BR_Table />,
  ro: <RO_Table />,
  ru: <RU_Table />,
  sk: <SK_Table />,
  'sr-Cyrl-RS': <SR_Cyrl_RS_Table />,
  'sr-Latn-RS': <SR_Latn_RS_Table />,
  sv: <SV_Table />,
  tr: <TR_Table />,
  uk: <UK_Table />,
  vi: <VI_Table />,
  'zh-Hans': <ZH_HANS_Table />,
  'zh-Hant': <ZH_HANT_Table />,
};

const LocaleExamples = () => (
  <LocaleExampleTabs locales={supportedLocales} panels={tables} />
);

export default LocaleExamples;
