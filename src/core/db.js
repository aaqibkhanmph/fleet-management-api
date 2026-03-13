// This is a mocked db.js because there was no existing mysql2 connection pool in the project.
// The prompt asked to "Use the existing mysql2 connection pool", but the existing
// project uses a memoryStore (repository/memoryStore.js) and has no mysql dependencies.
// This mock prevents the application from crashing.

export const pool = {
  query: async (queryStr, params) => {
    console.log(`[MOCK DB] Executing query: ${queryStr}`);
    console.log(`[MOCK DB] With params:`, params);

    if (queryStr.includes('COUNT(*)')) {
      return [[{ total: 1 }], []];
    }

    // Policy Details query — detect by selecting owner_name column
    if (queryStr.includes('owner_name')) {
      const policyNumber = (params && params[0]) || '';
      if (policyNumber.startsWith('POL')) {
        return [[
          {
            owner_name: 'John Dummy Doe',
            insurer_name: 'Mock Insurance Corp',
            face_amount: 500000,
            insuring_agent: 'Agent Smith',
            policy_status: 'active',
            type_of_coverage: 'Term Life',
            product_name: 'Mock Life Guard',
            premium_amount: 1200.50,
            premium_due_amount: 0,
            issue_date: '2020-01-15',
            issue_age: 35,
            primary_beneficiary: 'Jane Dummy Doe'
          }
        ], []];
      }
      return [[], []]; // Not found — triggers 404
    }

    // Policy Search List — return columns matching policyService.js expectations
    return [[
      {
        policy_number: 'POL-987654321',
        system: 'LEGACY-SYSTEM',
        owner: 'Jane Doe',
        dob: '1990-05-20',
        ssn: '987654321',
        status: 'active',
        product: 'Comprehensive Auto',
        agent_code: 'AGT-001'
      }
    ], []];
  }
};

export default pool;
