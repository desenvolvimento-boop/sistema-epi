export function normalizeKey(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

export function normalizeDigits(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

export type DuplicateCheck<T> = {
  items: T[];
  getValue: (item: T) => string | null | undefined;
  candidate: string;
  excludeId?: number | string | null;
  getId?: (item: T) => number | string;
  mode?: 'text' | 'digits';
  message: string;
};

export function findDuplicate<T>({
  items,
  getValue,
  candidate,
  excludeId,
  getId,
  mode = 'text',
}: DuplicateCheck<T>): T | undefined {
  const key =
    mode === 'digits' ? normalizeDigits(candidate) : normalizeKey(candidate);
  if (!key) return undefined;

  return items.find((item) => {
    if (excludeId != null && getId && getId(item) === excludeId) return false;
    const itemValue = getValue(item);
    const itemKey =
      mode === 'digits' ? normalizeDigits(itemValue) : normalizeKey(itemValue);
    return itemKey === key;
  });
}

export function assertNoDuplicate<T>(check: DuplicateCheck<T>): void {
  const duplicate = findDuplicate(check);
  if (duplicate) {
    throw new Error(check.message);
  }
}

export function validateUserUniqueness(
  users: { usr_id: number; usr_username?: string | null; usr_email?: string | null }[],
  username: string,
  email: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: users,
      getValue: (u) => u.usr_username,
      candidate: username,
      excludeId,
      getId: (u) => u.usr_id,
      message: 'Já existe um usuário com este login.',
    });
    if (email.trim()) {
      assertNoDuplicate({
        items: users,
        getValue: (u) => u.usr_email,
        candidate: email,
        excludeId,
        getId: (u) => u.usr_id,
        message: 'Já existe um usuário com este e-mail.',
      });
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateRoleUniqueness(
  roles: { rol_id: number; rol_description?: string | null; rol_code?: string | null }[],
  description: string,
  code: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: roles,
      getValue: (r) => r.rol_description,
      candidate: description,
      excludeId,
      getId: (r) => r.rol_id,
      message: 'Já existe uma função com este nome.',
    });
    if (code.trim()) {
      assertNoDuplicate({
        items: roles,
        getValue: (r) => r.rol_code,
        candidate: code,
        excludeId,
        getId: (r) => r.rol_id,
        message: 'Já existe uma função com este código interno.',
      });
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateEmployeeUniqueness(
  employees: {
    emp_id: number;
    emp_cpf?: string | null;
    emp_registration?: string | null;
  }[],
  cpf: string,
  registration: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: employees,
      getValue: (e) => e.emp_cpf,
      candidate: cpf,
      excludeId,
      getId: (e) => e.emp_id,
      mode: 'digits',
      message: 'Já existe um colaborador com este CPF.',
    });
    assertNoDuplicate({
      items: employees,
      getValue: (e) => e.emp_registration,
      candidate: registration,
      excludeId,
      getId: (e) => e.emp_id,
      message: 'Já existe um colaborador com esta matrícula.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateSectionUniqueness(
  sections: { sec_id: number; sec_description?: string | null }[],
  description: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: sections,
      getValue: (s) => s.sec_description,
      candidate: description,
      excludeId,
      getId: (s) => s.sec_id,
      message: 'Já existe um setor com este nome.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateEpiTypeUniqueness(
  types: { ept_id: number; ept_description?: string | null }[],
  description: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: types,
      getValue: (t) => t.ept_description,
      candidate: description,
      excludeId,
      getId: (t) => t.ept_id,
      message: 'Já existe um tipo de EPI com esta descrição.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateEpiVariantCaUniqueness(
  variants: { epv_id?: number; ept_id: number; epv_ca?: string | null }[],
  eptId: number,
  ca: string,
  excludeId?: number
): string | null {
  try {
    const sameType = variants.filter((v) => v.ept_id === eptId);
    assertNoDuplicate({
      items: sameType,
      getValue: (v) => v.epv_ca,
      candidate: ca,
      excludeId,
      getId: (v) => v.epv_id ?? 0,
      message: 'Já existe uma variante com este CA para o tipo de EPI selecionado.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateRiskTypeUniqueness(
  types: { rty_id: number; rty_description?: string | null; rty_code?: string | null }[],
  description: string,
  code: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: types,
      getValue: (t) => t.rty_description,
      candidate: description,
      excludeId,
      getId: (t) => t.rty_id,
      message: 'Já existe um tipo de risco com esta descrição.',
    });
    if (code.trim()) {
      assertNoDuplicate({
        items: types,
        getValue: (t) => t.rty_code,
        candidate: code,
        excludeId,
        getId: (t) => t.rty_id,
        message: 'Já existe um tipo de risco com este código.',
      });
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateEpiCategoryUniqueness(
  categories: { eca_id: number; eca_description?: string | null; eca_code?: string | null }[],
  description: string,
  code: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: categories,
      getValue: (c) => c.eca_description,
      candidate: description,
      excludeId,
      getId: (c) => c.eca_id,
      message: 'Já existe uma categoria com esta descrição.',
    });
    if (code.trim()) {
      assertNoDuplicate({
        items: categories,
        getValue: (c) => c.eca_code,
        candidate: code,
        excludeId,
        getId: (c) => c.eca_id,
        message: 'Já existe uma categoria com este código.',
      });
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateUserGroupUniqueness(
  groups: {
    usg_id: number;
    usg_description?: string | null;
    usg_integrationid?: string | null;
  }[],
  integrationId: string,
  description: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: groups,
      getValue: (g) => g.usg_integrationid,
      candidate: integrationId,
      excludeId,
      getId: (g) => g.usg_id,
      message: 'Já existe um tipo de usuário com este identificador.',
    });
    if (description.trim()) {
      assertNoDuplicate({
        items: groups,
        getValue: (g) => g.usg_description,
        candidate: description,
        excludeId,
        getId: (g) => g.usg_id,
        message: 'Já existe um tipo de usuário com esta descrição.',
      });
    }
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateAccessProfileUniqueness(
  profiles: { acp_id: number; acp_description?: string | null }[],
  description: string,
  excludeId?: number
): string | null {
  try {
    assertNoDuplicate({
      items: profiles,
      getValue: (p) => p.acp_description,
      candidate: description,
      excludeId,
      getId: (p) => p.acp_id,
      message: 'Já existe um perfil de acesso com este nome.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}

export function validateEmployerCnpjUniqueness(
  employers: { emr_id: number; emr_tax_id?: string | null }[],
  cnpj: string,
  excludeId?: number
): string | null {
  if (!cnpj.trim()) return null;
  try {
    assertNoDuplicate({
      items: employers,
      getValue: (e) => e.emr_tax_id,
      candidate: cnpj,
      excludeId,
      getId: (e) => e.emr_id,
      mode: 'digits',
      message: 'Já existe uma empresa com este CNPJ.',
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Valor duplicado.';
  }
}
