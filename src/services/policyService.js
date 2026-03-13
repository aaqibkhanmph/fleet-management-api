import pool from '../core/db.js';

function maskSsn(ssn) {
  if (!ssn) return ssn;
  const str = String(ssn);
  if (str.length === 9) {
    return '***-**-' + str.slice(-4);
  }
  return str;
}

function formatYYYYMMDD(val) {
  if (!val) return null;
  if (typeof val === 'string') return val.split('T')[0];
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val);
}

export const policyService = {
  searchPolicies: async (filters) => {
    let query = `
      SELECT 
        p.policy_number,
        p.insured_name,
        p.product_name,
        p.agent_code,
        p.end_date,
        p.premium_amount,
        p.system,
        p.dob,
        p.ssn,
        p.status
      FROM policies p
      WHERE 1=1
    `;
    const params = [];

    if (filters.policyNumber) {
      query += ' AND p.policy_number = ?';
      params.push(filters.policyNumber);
    }
    if (filters.system) {
      query += ' AND p.system = ?';
      params.push(filters.system);
    }
    if (filters.owner) {
      query += ' AND p.insured_name = ?';
      params.push(filters.owner);
    }
    if (filters.dob) {
      query += ' AND p.dob = ?';
      params.push(filters.dob);
    }
    if (filters.ssn) {
      query += ' AND p.ssn = ?';
      params.push(filters.ssn);
    }
    if (filters.status) {
      query += ' AND p.status = ?';
      params.push(filters.status);
    }
    if (filters.product) {
      query += ' AND p.product_name = ?';
      params.push(filters.product);
    }
    if (filters.agentCode) {
      query += ' AND p.agent_code = ?';
      params.push(filters.agentCode);
    }

    const [rows] = await pool.query(query, params);

    // Map to PascalCase response structure
    const Policies = rows.map(row => ({
      PolicyNumber:  row.policy_number   || null,
      InsuredName:   row.insured_name    || null,
      ProductName:   row.product_name    || null,
      AgentCode:     row.agent_code      || null,
      EndDate:       row.end_date        || null,
      PremiumAmount: row.premium_amount  !== undefined ? Number(row.premium_amount) : null
    }));

    return { Policies };
  },

  getPolicyDetails: async (policyNumber) => {
    const query = `
      SELECT 
        p.policy_number,
        o.name AS owner_name,
        i.name AS insurer_name,
        p.face_amount,
        p.insuring_agent,
        p.status AS policy_status,
        p.type_of_coverage,
        pr.name AS product_name,
        p.premium_amount,
        p.premium_due_amount,
        p.issue_date,
        p.issue_age,
        b.name AS primary_beneficiary
      FROM policies p
      LEFT JOIN owners o ON p.owner_id = o.id
      LEFT JOIN insurers i ON p.insurer_id = i.id
      LEFT JOIN products pr ON p.product_id = pr.id
      LEFT JOIN beneficiaries b ON b.policy_id = p.id AND b.is_primary = true
      WHERE p.policy_number LIKE ?
    `;

    const [rows] = await pool.query(query, [policyNumber]);

    if (rows.length === 0) {
      return null;
    }

    // Map all matching rows into detail objects and return as a list
    const results = rows.map(row => ({
      policyNumber:       row.policy_number   || null,
      ownerName:          row.owner_name      || null,
      insurerName:        row.insurer_name    || null,
      faceAmount:         row.face_amount     !== undefined ? Number(row.face_amount)      : null,
      insuringAgent:      row.insuring_agent  || null,
      policyStatus:       row.policy_status   || null,
      typeOfCoverage:     row.type_of_coverage || null,
      productName:        row.product_name    || null,
      primaryBeneficiary: row.primary_beneficiary || null,
      premiumAmount:      row.premium_amount  !== undefined ? Number(row.premium_amount)   : null,
      premiumDueAmount:   row.premium_due_amount !== undefined ? Number(row.premium_due_amount) : null,
      issueDate:          formatYYYYMMDD(row.issue_date),
      issueAge:           row.issue_age       !== undefined ? parseInt(row.issue_age, 10)  : null
    }));

    return { total: results.length, results };
  }
};
