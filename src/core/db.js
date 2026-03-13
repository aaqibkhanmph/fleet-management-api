// Mocked db.js — no real MySQL in this project (uses memoryStore for vehicles/sessions).
// All policy data is served from this mock pool.

const MOCK_POLICIES = [
  {
    // --- Search fields ---
    policy_number: 'POL-001',
    system: 'LEGACY-SYSTEM-A',
    owner: 'Alice Johnson',
    dob: '1978-03-12',
    ssn: '111223333',
    status: 'active',
    product: 'Term Life Guard',
    agent_code: 'AGT-101',
    // --- Details fields ---
    owner_name: 'Alice Johnson',
    insurer_name: 'NorthStar Insurance Co.',
    face_amount: 750000,
    insuring_agent: 'Robert Blake',
    policy_status: 'active',
    type_of_coverage: 'Term Life',
    product_name: 'Term Life Guard',
    primary_beneficiary: 'Michael Johnson',
    premium_amount: 1850.00,
    premium_due_amount: 0,
    issue_date: '2018-06-01',
    issue_age: 40
  },
  {
    // --- Search fields ---
    policy_number: 'POL-002',
    system: 'CORE-SYSTEM-B',
    owner: 'Robert Smith',
    dob: '1965-11-28',
    ssn: '222334444',
    status: 'active',
    product: 'Whole Life Plus',
    agent_code: 'AGT-202',
    // --- Details fields ---
    owner_name: 'Robert Smith',
    insurer_name: 'Summit Life Partners',
    face_amount: 1200000,
    insuring_agent: 'Diana Prince',
    policy_status: 'active',
    type_of_coverage: 'Whole Life',
    product_name: 'Whole Life Plus',
    primary_beneficiary: 'Sarah Smith',
    premium_amount: 3400.75,
    premium_due_amount: 340.07,
    issue_date: '2010-01-15',
    issue_age: 44
  },
  {
    // --- Search fields ---
    policy_number: 'POL-003',
    system: 'DIGITAL-PLATFORM',
    owner: 'Maria Garcia',
    dob: '1990-07-04',
    ssn: '333445555',
    status: 'pending',
    product: 'Universal Shield',
    agent_code: 'AGT-303',
    // --- Details fields ---
    owner_name: 'Maria Garcia',
    insurer_name: 'Apex Life Insurance',
    face_amount: 500000,
    insuring_agent: 'James Carver',
    policy_status: 'pending',
    type_of_coverage: 'Universal Life',
    product_name: 'Universal Shield',
    primary_beneficiary: 'Carlos Garcia',
    premium_amount: 980.50,
    premium_due_amount: 980.50,
    issue_date: '2023-09-20',
    issue_age: 33
  }
];

export const pool = {
  query: async (queryStr, params) => {
    console.log(`[MOCK DB] Executing query: ${queryStr}`);
    console.log(`[MOCK DB] With params:`, params);

    if (queryStr.includes('COUNT(*)')) {
      return [[{ total: MOCK_POLICIES.length }], []];
    }

    // Policy Details query — identified by selecting owner_name column
    if (queryStr.includes('owner_name')) {
      const policyNumber = (params && params[0]) || '';
      const match = MOCK_POLICIES.find(p => p.policy_number === policyNumber);
      if (match) {
        return [[match], []];
      }
      return [[], []]; // Not found — triggers 404
    }

    // Policy Search — return all 3 mocks (service applies filter logic)
    return [MOCK_POLICIES, []];
  }
};

export default pool;
