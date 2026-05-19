import { NOMENCLATURE_KEYS } from '../config/nomenclatureKeys';
import type { ExchangeRuleScope } from '../services/exchangeRuleService';

export function getExchangeScopeLabels(
  t: (key: string, fallback?: string) => string
): Record<ExchangeRuleScope, string> {
  return {
    GLOBAL: t(NOMENCLATURE_KEYS.scope.global),
    COMPANY: t(NOMENCLATURE_KEYS.scope.company),
    SECTION: t(NOMENCLATURE_KEYS.scope.section),
    ROLE: t(NOMENCLATURE_KEYS.scope.role),
    EMPLOYEE: t(NOMENCLATURE_KEYS.scope.employee),
  };
}
