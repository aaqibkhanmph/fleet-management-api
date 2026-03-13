// Mocked db.js — no real MySQL in this project (uses memoryStore for vehicles/sessions).
// All policy data is served from this mock pool.

const MOCK_POLICIES = [
  {
    // Search fields
    policy_number: 'P54321',
    system: 'LEGACY-SYSTEM-A',
    insured_name: 'Insured3',
    dob: '1978-03-12',
    ssn: '111223333',
    status: 'active',
    product_name: 'Product1',
    agent_code: 'A003',
    end_date: '20330223',
    premium_amount: 234234.000000000,
    // Details fields
    owner_name: 'Insured3',
    insurer_name: 'NorthStar Insurance Co.',
    face_amount: 750000,
    insuring_agent: 'Robert Blake',
    policy_status: 'active',
    type_of_coverage: 'Term Life',
    primary_beneficiary: 'Michael Johnson',
    premium_due_amount: 0,
    issue_date: '2018-06-01',
    issue_age: 40
  },
  {
    // Search fields
    policy_number: 'P12345',
    system: 'CORE-SYSTEM-B',
    insured_name: 'Insured1',
    dob: '1965-11-28',
    ssn: '222334444',
    status: 'active',
    product_name: 'Product1',
    agent_code: 'A001',
    end_date: '20270223',
    premium_amount: 12345.000000000,
    // Details fields
    owner_name: 'Insured1',
    insurer_name: 'Summit Life Partners',
    face_amount: 1200000,
    insuring_agent: 'Diana Prince',
    policy_status: 'active',
    type_of_coverage: 'Whole Life',
    primary_beneficiary: 'Sarah Smith',
    premium_due_amount: 340.07,
    issue_date: '2010-01-15',
    issue_age: 44
  },
  {
    // Search fields
    policy_number: 'P67890',
    system: 'DIGITAL-PLATFORM',
    insured_name: 'Insured2',
    dob: '1990-07-04',
    ssn: '333445555',
    status: 'pending',
    product_name: 'Product2',
    agent_code: 'A002',
    end_date: '20290221',
    premium_amount: 23423.000000000,
    // Details fields
    owner_name: 'Insured2',
    insurer_name: 'Apex Life Insurance',
    face_amount: 500000,
    insuring_agent: 'James Carver',
    policy_status: 'pending',
    type_of_coverage: 'Universal Life',
    primary_beneficiary: 'Carlos Garcia',
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

    // Policy Details query — prefix match on policy_number
    if (queryStr.includes('owner_name')) {
      const policyNumber = (params && params[0]) || '';
      const matches = MOCK_POLICIES.filter(p => p.policy_number.startsWith(policyNumber));
      return [matches, []];
    }

    // Policy Search — return all mocks (service applies filter logic)
    return [MOCK_POLICIES, []];
  }
};

export default pool;
