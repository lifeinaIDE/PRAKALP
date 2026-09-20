/**
 * mockApi.ts
 * Implements every function listed in /DOCS/05-mock-api-contract.md.
 *
 * There is NO real backend. Every function either:
 *   - fetches a static CSV/JSON from /public/CSV/ or /public/JSON/, or
 *   - simulates a write with a 300–600ms delay and updates in-memory state.
 *
 * Field names are identical to CSV headers — see /DOCS/04-data-model.md for schemas.
 */

import { parseCsv, fetchJson } from './csvParser';

/* ============================================================
   TypeScript Interfaces  (field names match CSV/JSON headers)
   ============================================================ */

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;              // "CPSE Data Steward" | "Technical Reviewer" | "National Admin"
  plant_code: string;        // blank for reviewers/admins
  designation: string;
  status: string;
  last_login: string;
}

export interface CpseMaster {
  plant_code: string;
  cpse_short_code: string;
  plant_name: string;
  sector: string;
  location: string;
  onboarded_date: string;
  status: string;
}

export interface RawMaterial {
  local_code: string;
  cpse_name: string;
  description: string;
  uom: string;
  specification: string;
  category: string;
  material_ref: string;
  is_complete: string;
  validation_status: string;
  quality_score: string;
}

export interface DataQualityAlert {
  alert_id: string;
  local_code: string;
  alert_type: string;
  severity: string;
  status: string;
  assigned_to: string;
}

export interface MatchResult {
  material_group_id: string;
  cpse_1_code: string;
  cpse_1_desc: string;
  cpse_1_plant: string;
  cpse_2_code: string;
  cpse_2_desc: string;
  cpse_2_plant: string;
  trust_score: string;
  match_type: string;
  review_type: string;
  why_match: string;
  why_not: string;
  status: string;
  assigned_reviewer: string;
}

export interface CnmcRegistry {
  cnmc_code: string;
  canonical_description: string;
  standardized_uom: string;
  standardized_specs: string;
  material_fingerprint: string;
  legacy_codes: string;
  category?: string;
  created_date: string;
  version: string;
  approval_status: string;
}

export interface NationalPassport {
  passport_id: string;
  cnmc_code: string;
  canonical_description: string;
  technical_specifications: string;
  manufacturer_info: string;
  lifecycle_status: string;
  functional_equivalents: string;
  audit_trail_reference: string;
}

export interface ClarificationRequest {
  request_id: string;
  material_group_id: string;
  local_code: string;
  reviewer_id: string;
  steward_id: string;
  message: string;
  response: string;
  status: string;
  requested_date: string;
  responded_date: string;
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  user_id: string;
  user_role: string;
  action: string;
  material_code: string;
  cnmc_code: string;
  ip_address: string;
  hash_chain: string;
}

/* Dashboard stat shapes */
export interface DashboardStatsAdmin {
  generated_on: string;
  summary_cards: {
    total_cpse_plants_onboarded: number;
    total_records_in_system: number;
    total_cnmc_entries_approved: number;
    pending_technical_reviews: number;
    open_data_quality_alerts: number;
    open_disputes: number;
  };
  records_by_plant: Record<string, number>;
  data_quality_by_plant: Record<string, number>;
  migration_progress: {
    total_source_records: number;
    records_mapped_to_cnmc: number;
    migration_percentage: number;
  };
}

export interface DashboardStatsReviewer {
  reviewer_id: string;
  generated_on: string;
  summary_cards: {
    pending_matches_in_queue: number;
    approved_this_quarter: number;
    rejected_this_quarter: number;
    clarifications_awaiting_steward_response: number;
    average_trust_score_reviewed: number;
  };
  match_queue_by_type: Record<string, number>;
  trust_score_distribution: Record<string, number>;
}

export interface DashboardStatsSteward {
  plant_code: string;
  generated_on: string;
  summary_cards: {
    total_records_submitted: number;
    records_pending_correction: number;
    records_flagged_for_review: number;
    approved_cnmc_mappings: number;
    open_clarification_requests: number;
  };
  data_quality_by_alert_type: Record<string, number>;
  recent_activity: { date: string; action: string; records: number }[];
}

/* ============================================================
   In-memory local state
   Simulated writes update these maps for the session lifetime.
   A page refresh resets everything to the static baseline.
   ============================================================ */

const localAlertStatus     = new Map<string, string>();   // alertId → status
const localClarifications  = new Map<string, ClarificationRequest>();
const localMatchStatus     = new Map<string, string>();   // groupId → status
const localMatchResults    = new Map<string, MatchResult>();

/* ============================================================
   Demo scenario trigger rules  (from /JSON/demo_scenario_map.json)
   ============================================================ */
const VALIDATE_SUCCESS_TRIGGERS = ['bhel', 'bhel-heep'];
const VALIDATE_FAILURE_TRIGGERS = ['sail', 'sail-rsp'];
const DUPLICATE_MATCH_KEYWORDS  = ['ball bearing 6205', '6205'];

/* ============================================================
   Utility helpers
   ============================================================ */

/** Returns a promise that resolves after 300–600ms (simulates network I/O) */
function fakeDelay(): Promise<void> {
  const ms = 300 + Math.random() * 300;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generate a simple fake reference ID */
function fakeRef(prefix: string): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `${prefix}-2026-${n}`;
}

/* ============================================================
   API Functions
   ============================================================ */

/** GET users.csv — all 11 demo users */
export async function getUsers(): Promise<User[]> {
  return parseCsv<User>('users.csv');
}

/** GET cpse_master.csv — all 6 CPSE plants */
export async function getCpseMaster(): Promise<CpseMaster[]> {
  return parseCsv<CpseMaster>('cpse_master.csv');
}

/** GET raw_material_data.csv filtered by plant */
export async function getRawMaterialsByPlant(plantCode: string): Promise<RawMaterial[]> {
  const all = await parseCsv<RawMaterial>('raw_material_data.csv');
  return all.filter((r) => r.cpse_name.toLowerCase() === plantCode.toLowerCase());
}

/**
 * POST (simulated) validateUpload
 * sampleId: "success" → returns validation_result_success.json
 *           "failure" → returns validation_result_failure.json
 * Also respects trigger keywords from demo_scenario_map.json:
 *   bhel/bhel-heep → success; sail/sail-rsp → failure
 */
export async function validateUpload(sampleId: string): Promise<unknown> {
  await fakeDelay();
  const key = sampleId.toLowerCase();
  const isSuccess = VALIDATE_SUCCESS_TRIGGERS.some((t) => key.includes(t));
  const isFailure = VALIDATE_FAILURE_TRIGGERS.some((t) => key.includes(t));

  if (isSuccess) return fetchJson('validation_result_success.json');
  if (isFailure) return fetchJson('validation_result_failure.json');
  // default: success
  return fetchJson('validation_result_success.json');
}

/** GET data_quality_alerts.csv filtered by assigned_to == userId */
export async function getAlertsForSteward(userId: string): Promise<DataQualityAlert[]> {
  const all = await parseCsv<DataQualityAlert>('data_quality_alerts.csv');
  return all
    .filter((a) => a.assigned_to === userId)
    .map((a) => ({
      ...a,
      status: localAlertStatus.get(a.alert_id) ?? a.status,
    }));
}

/** PATCH (simulated) resolveAlert — updates local state only */
export async function resolveAlert(alertId: string): Promise<{ success: true; ref: string }> {
  await fakeDelay();
  localAlertStatus.set(alertId, 'Resolved');
  return { success: true, ref: alertId };
}

/** GET clarification_requests.csv filtered by steward_id */
export async function getClarificationsForSteward(userId: string): Promise<ClarificationRequest[]> {
  const all = await parseCsv<ClarificationRequest>('clarification_requests.csv');
  return all
    .filter((c) => c.steward_id === userId)
    .map((c) => localClarifications.get(c.request_id) ?? c);
}

/** GET clarification_requests.csv filtered by reviewer_id */
export async function getClarificationsForReviewer(userId: string): Promise<ClarificationRequest[]> {
  const all = await parseCsv<ClarificationRequest>('clarification_requests.csv');
  return all
    .filter((c) => c.reviewer_id === userId)
    .map((c) => localClarifications.get(c.request_id) ?? c);
}

/** PATCH (simulated) respondToClarification — updates local state only */
export async function respondToClarification(
  requestId: string,
  text: string,
): Promise<{ success: true; ref: string }> {
  await fakeDelay();
  const all = await parseCsv<ClarificationRequest>('clarification_requests.csv');
  const base = all.find((c) => c.request_id === requestId);
  if (base) {
    localClarifications.set(requestId, {
      ...base,
      response: text,
      status: 'Resolved',
      responded_date: new Date().toISOString().split('T')[0],
    });
  }
  return { success: true, ref: requestId };
}

/** GET cnmc_registry.csv filtered client-side by query (cnmc_code or canonical_description) */
export async function searchCnmcRegistry(query: string): Promise<CnmcRegistry[]> {
  const all = await parseCsv<CnmcRegistry>('cnmc_registry.csv');
  if (!query.trim()) return all;
  const q = query.toLowerCase();
  return all.filter(
    (r) =>
      r.cnmc_code.toLowerCase().includes(q) ||
      r.canonical_description.toLowerCase().includes(q),
  );
}

/** GET national_material_passports.csv + cnmc_registry.csv joined by cnmc_code */
export async function getPassport(
  cnmcCode: string,
): Promise<{ passport: NationalPassport; cnmc: CnmcRegistry } | null> {
  const [passports, registry] = await Promise.all([
    parseCsv<NationalPassport>('national_material_passports.csv'),
    parseCsv<CnmcRegistry>('cnmc_registry.csv'),
  ]);

  const passport = passports.find((p) => p.cnmc_code === cnmcCode);
  const reg      = registry.find((r) => r.cnmc_code === cnmcCode);

  if (!passport || !reg) return null;
  return { passport, cnmc: reg };
}

/**
 * POST (simulated) checkDuplicate
 * Trigger: description containing "ball bearing 6205" or "6205" → match_found
 * Otherwise → no_match
 */
export async function checkDuplicate(description: string): Promise<unknown> {
  await fakeDelay();
  const d = description.toLowerCase();
  const isMatch = DUPLICATE_MATCH_KEYWORDS.some((kw) => d.includes(kw));
  return fetchJson(
    isMatch
      ? 'duplicate_prevention_check_match_found.json'
      : 'duplicate_prevention_check_no_match.json',
  );
}

/** GET match_results.csv where status == "Pending" */
export async function getMatchQueue(): Promise<MatchResult[]> {
  const all = await parseCsv<MatchResult>('match_results.csv');
  return all
    .map((r) => ({
      ...r,
      status: localMatchStatus.get(r.material_group_id) ?? r.status,
    }))
    .filter((r) => r.status === 'Pending');
}

/** GET one row from match_results.csv by material_group_id */
export async function getMatchDetail(groupId: string): Promise<MatchResult | null> {
  const all = await parseCsv<MatchResult>('match_results.csv');
  const row = all.find((r) => r.material_group_id === groupId);
  if (!row) return null;
  return localMatchResults.get(groupId) ?? {
    ...row,
    status: localMatchStatus.get(groupId) ?? row.status,
  };
}

/**
 * POST (simulated) approveMatch
 * Looks up the related cnmc_registry + national_material_passports row
 * and returns them alongside the approval confirmation.
 */
export async function approveMatch(groupId: string): Promise<{
  approved: true;
  cnmc: CnmcRegistry | null;
  passport: NationalPassport | null;
  ref: string;
}> {
  await fakeDelay();
  localMatchStatus.set(groupId, 'Approved');

  const matchRow = await getMatchDetail(groupId);
  const [registry, passports] = await Promise.all([
    parseCsv<CnmcRegistry>('cnmc_registry.csv'),
    parseCsv<NationalPassport>('national_material_passports.csv'),
  ]);

  // Attempt to find by matching cpse codes in legacy_codes field
  const cpse1 = matchRow?.cpse_1_code ?? '';
  const cpse2 = matchRow?.cpse_2_code ?? '';
  const cnmcRow = registry.find(
    (r) => r.legacy_codes.includes(cpse1) || r.legacy_codes.includes(cpse2),
  ) ?? registry[0];

  const passportRow = cnmcRow
    ? passports.find((p) => p.cnmc_code === cnmcRow.cnmc_code) ?? null
    : null;

  return {
    approved: true,
    cnmc: cnmcRow ?? null,
    passport: passportRow,
    ref: fakeRef('LOG'),
  };
}

/** POST (simulated) rejectMatch — updates local state only */
export async function rejectMatch(
  groupId: string,
  reason: string,
): Promise<{ rejected: true; ref: string }> {
  await fakeDelay();
  localMatchStatus.set(groupId, 'Rejected');
  console.info(`[mockApi] rejectMatch(${groupId}): ${reason}`);
  return { rejected: true, ref: fakeRef('LOG') };
}

/**
 * POST (simulated) sendClarificationRequest
 * Creates a new entry in local state mirroring the clarification_requests.csv shape.
 */
export async function sendClarificationRequest(
  groupId: string,
  stewardId: string,
  message: string,
): Promise<{ sent: true; ref: string }> {
  await fakeDelay();
  const ref = `CLR-${String(Date.now()).slice(-4)}`;
  localClarifications.set(ref, {
    request_id: ref,
    material_group_id: groupId,
    local_code: '',
    reviewer_id: '',
    steward_id: stewardId,
    message,
    response: '',
    status: 'Awaiting Response',
    requested_date: new Date().toISOString().split('T')[0],
    responded_date: '',
  });
  return { sent: true, ref };
}

/** GET dashboard stats — routes to role-specific JSON file */
export async function getDashboardStats(
  role: 'steward' | 'reviewer' | 'admin',
): Promise<DashboardStatsSteward | DashboardStatsReviewer | DashboardStatsAdmin> {
  const fileMap = {
    steward:  'dashboard_stats_steward.json',
    reviewer: 'dashboard_stats_reviewer.json',
    admin:    'dashboard_stats_admin.json',
  };
  return fetchJson(fileMap[role]);
}

/** GET audit_logs.csv — all 87 rows, with optional client-side filters */
export async function getAuditLogs(filters: {
  user?: string;
  role?: string;
  action?: string;
  from?: string;
  to?: string;
} = {}): Promise<AuditLog[]> {
  const all = await parseCsv<AuditLog>('audit_logs.csv');
  return all.filter((log) => {
    if (filters.user   && !log.user_id.toLowerCase().includes(filters.user.toLowerCase()))   return false;
    if (filters.role   && !log.user_role.toLowerCase().includes(filters.role.toLowerCase())) return false;
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase()))  return false;
    if (filters.from   && log.timestamp < filters.from)                                       return false;
    if (filters.to     && log.timestamp > filters.to)                                         return false;
    return true;
  });
}

/** GET match_results.csv where status == "Rejected" (used as disputes for demo) */
export async function getDisputes(): Promise<MatchResult[]> {
  const all = await parseCsv<MatchResult>('match_results.csv');
  return all
    .map((r) => ({
      ...r,
      status: localMatchStatus.get(r.material_group_id) ?? r.status,
    }))
    .filter((r) => r.status === 'Rejected');
}
