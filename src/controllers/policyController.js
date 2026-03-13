import { policyService } from '../services/policyService.js';

export const policyController = {
  searchPolicies: async (req, res, next) => {
    try {
      const data = await policyService.searchPolicies(req.query);
      
      return res.status(200).json({
        success: true,
        data: {
          total: data.total,
          results: data.results
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getPolicyDetails: async (req, res, next) => {
    try {
      const { policyNumber } = req.query;
      const policy = await policyService.getPolicyDetails(policyNumber);
      
      if (!policy) {
        return res.status(404).json({
          success: false,
          error: {
            code: "POLICY_NOT_FOUND",
            message: "No policy found for the provided policy number."
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: policy
      });
    } catch (error) {
      next(error);
    }
  }
};
