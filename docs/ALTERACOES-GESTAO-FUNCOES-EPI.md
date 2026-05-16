# Alterações — Gestão de Funções, EPIs, Riscos e Integrações

Documentação das mudanças implementadas nos repositórios **sistema-epi** (frontend) e **APIMOBEPI** (API).

## Resumo executivo

- Tabela `roles` ampliada (ALTER) com descrição de atividades, código interno e origem de integração ERP.
- Novas tabelas: `epis`, `role_epi`, `role_risks`.
- CRUD de EPIs com campos para TOTVS/Senior/Manual.
- Vínculo função × EPI compartilhado entre **Gestão de Funções** e **Matriz Função × EPI**.
- Riscos por função com integração TOTVS (cadastro manual ou importação futura).
- Frontend integrado à API (removida dependência de mocks `ROLES`/`EPIS` nessas telas).

---

## Scripts SQL

**Localização:** `APIMOBEPI/scripts/migrations/`

**Ordem de execução:** `001` → `002` → `003` → `004`

| Arquivo | Ação |
|---------|------|
| `001_alter_roles.sql` | ALTER na tabela `roles` existente |
| `001b_migrate_roles_legacy_data.sql` | Opcional — migrar descrições gravadas em `rol_integration_id` |
| `002_create_epis.sql` | CREATE `epis` |
| `003_create_role_epi.sql` | CREATE `role_epi` |
| `004_create_role_risks.sql` | CREATE `role_risks` |

### Instrução

- **`roles`:** apenas ALTER (não recriar).
- **Demais tabelas:** CREATE IF NOT EXISTS.

Exemplo (MySQL CLI):

```bash
mysql -u usuario -p nome_banco < scripts/migrations/001_alter_roles.sql
mysql -u usuario -p nome_banco < scripts/migrations/002_create_epis.sql
mysql -u usuario -p nome_banco < scripts/migrations/003_create_role_epi.sql
mysql -u usuario -p nome_banco < scripts/migrations/004_create_role_risks.sql
```

---

## Endpoints da API (APIMOBEPI)

Base: `/` (com `authMiddleware` e Bearer token).

### EPIs — `/epi`

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/epi` | Criar EPI |
| GET | `/epi` | Listar todos |
| GET | `/epi/active` | Listar ativos |
| GET | `/epi/:id` | Detalhe |
| PUT | `/epi/:id` | Atualizar (campos mestres bloqueados se origem ≠ Manual) |
| DELETE | `/epi/:id` | Inativar (`epi_active = 0`) |

**Payload exemplo (POST):**

```json
{
  "epi_active": 1,
  "epi_description": "Bota de Segurança",
  "epi_ca": "45678",
  "epi_manufacturer": "Marluvas",
  "epi_category": "Proteção de Pés",
  "epi_lifespan_days": 180,
  "epi_technical_description": null,
  "epi_integration_id": "PROD-00012345",
  "epi_integration_source": "TOTVS",
  "epi_external_code": null
}
```

### Funções — `/role`

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/role` | Criar função |
| GET | `/role` | Listar (com `epi_count`, `employee_count`) |
| GET | `/role/active` | Listar ativas |
| GET | `/role/matrix` | Matriz função × EPI |
| GET | `/role/:id` | Detalhe (`?include=relations` inclui EPIs e riscos) |
| PUT | `/role/:id` | Atualizar |
| DELETE | `/role/:id` | Inativar |
| GET | `/role/:id/epis` | EPIs vinculados |
| PUT | `/role/:id/epis` | Substituir vínculos (`{ "items": [{ "epi_id": 1, "rle_mandatory": 1 }] }`) |
| GET | `/role/:id/risks` | Riscos da função |
| POST | `/role/:id/risks` | Criar risco |
| PUT | `/role/:id/risks/:rskId` | Atualizar risco |
| DELETE | `/role/:id/risks/:rskId` | Inativar risco |

**Payload função (POST):**

```json
{
  "rol_active": 1,
  "rol_description": "Levante",
  "rol_activities": "Movimentação manual de cargas",
  "rol_code": "LEV-001",
  "rol_integration_id": "TOTVS-CARGO-042",
  "rol_integration_source": "TOTVS",
  "rol_cbo": null
}
```

**Payload risco (POST `/role/:id/risks`):**

```json
{
  "rsk_active": 1,
  "rsk_type": "Ergonômico",
  "rsk_agent": "Movimentação manual de cargas",
  "rsk_severity": "Alta",
  "rsk_pgr_reference": "PGR-ERG-01",
  "rsk_integration_id": "TOTVS-RISCO-ERG-019",
  "rsk_integration_source": "TOTVS"
}
```

---

## Mapeamento campos ↔ formulários

### Função (`roles`)

| Campo API | Label no front |
|-----------|----------------|
| `rol_description` | Nome da Função |
| `rol_activities` | Descrição das Atividades |
| `rol_active` | Status |
| `rol_code` | Código interno |
| `rol_integration_source` | Sistema de origem |
| `rol_integration_id` | ID no ERP (TOTVS) |
| `rol_cbo` | CBO (opcional) |

### EPI (`epis`)

| Campo API | Label no front |
|-----------|----------------|
| `epi_description` | Nome do EPI |
| `epi_ca` | CA |
| `epi_manufacturer` | Fabricante |
| `epi_category` | Categoria |
| `epi_lifespan_days` | Vida Útil (dias) |
| `epi_technical_description` | Descrição Técnica |
| `epi_active` | Status |
| `epi_integration_source` | Sistema de origem |
| `epi_integration_id` | ID no ERP |
| `epi_external_code` | Código alternativo |
| `epi_integration_sync_at` | Última sincronização (somente leitura) |

### Risco (`role_risks`)

| Campo API | Label no front |
|-----------|----------------|
| `rsk_type` | Tipo de Risco |
| `rsk_agent` | Descrição do agente |
| `rsk_severity` | Severidade |
| `rsk_pgr_reference` | Ref. PGR |
| `rsk_integration_source` | Origem |
| `rsk_integration_id` | ID TOTVS/ERP |

### Vínculo função × EPI (`role_epi`)

Gerenciado por checkboxes em **Gestão de Funções** e **Matriz Função × EPI** (mesma API `PUT /role/:id/epis`).

---

## Integração TOTVS / ERP

| Entidade | Campos | Comportamento na UI |
|----------|--------|---------------------|
| Função | `rol_integration_id`, `rol_integration_source` | Seção colapsável; campos mestres bloqueados se importado |
| EPI | `epi_integration_*`, `epi_external_code` | Idem |
| Risco | `rsk_integration_*`, `rsk_pgr_reference` | Badge de origem; exclusão só para `Manual` |

**Cadastro manual:** `*_integration_source = 'Manual'`.

**Pendência:** job/endpoint `POST /integrations/totvs/sync` para importação em lote.

---

## Migração de dados legados

Se `rol_integration_id` foi usado como texto longo no cadastro rápido de colaborador, executar `001b_migrate_roles_legacy_data.sql` antes de usar o campo apenas para código ERP.

O **ColaboradorForm** agora grava:
- `rol_description` ← nome da função
- `rol_activities` ← descrição no modal auxiliar
- `rol_integration_id` ← null no cadastro rápido

---

## Arquivos alterados

### APIMOBEPI

- `scripts/migrations/001_alter_roles.sql`
- `scripts/migrations/001b_migrate_roles_legacy_data.sql`
- `scripts/migrations/002_create_epis.sql`
- `scripts/migrations/003_create_role_epi.sql`
- `scripts/migrations/004_create_role_risks.sql`
- `src/models/Role.model.js`
- `src/models/Epi.model.js`
- `src/models/RoleEpi.model.js`
- `src/models/RoleRisk.model.js`
- `src/models/associations.js`
- `src/services/epi.service.js`
- `src/services/role.service.js`
- `src/controllers/epi.controller.js`
- `src/controllers/role.controller.js`
- `src/routes/epi.route.js`
- `src/routes/role.route.js`
- `src/routes/routes.js`
- `src/server.js`

### sistema-epi

- `src/services/epiService.ts` (novo)
- `src/services/roleService.ts`
- `src/components/forms/EPIForm.tsx`
- `src/components/forms/FuncaoForm.tsx`
- `src/components/forms/MatrizForm.tsx`
- `src/components/forms/ColaboradorForm.tsx`
- `src/pages/EPIs/index.tsx`
- `src/pages/Funcoes/index.tsx`
- `src/pages/FuncaoDetalhes/index.tsx`
- `src/pages/FuncaoEditar/index.tsx`
- `src/pages/MatrizFuncaoEPI/index.tsx`
- Estilos CSS associados

**Nota:** mocks `ROLES` e `EPIS` em `src/services/api.ts` podem permanecer para telas ainda não migradas (dashboard, etc.).

---

## Plano de testes manual

1. Executar scripts SQL `001`–`004` no banco de desenvolvimento.
2. Subir APIMOBEPI e sistema-epi.
3. **EPIs:** cadastrar EPI manual + um com `epi_integration_source: TOTVS`.
4. **Função:** criar "Levante" com atividades e vincular EPIs.
5. **Matriz:** conferir cruzamento e editar vínculos pela matriz.
6. **Riscos:** em Editar função, adicionar risco manual e um com origem TOTVS.
7. **Colaborador:** criar função pelo modal auxiliar e verificar `rol_activities` no banco.
8. **Detalhes:** validar badges de origem e contagem de colaboradores/EPIs.

---

## Pendências futuras

- Job de sincronização TOTVS (`POST /integrations/totvs/sync`).
- Importação em lote de funções, EPIs e riscos.
- Desvincular registro importado para edição local.
- Remover mocks `ROLES`/`EPIS` das demais telas do sistema.
