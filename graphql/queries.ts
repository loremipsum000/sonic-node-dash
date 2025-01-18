import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    currentEpoch
    totalStake
    totalActiveStake
    totalSupply
    validatorCommission
    getEpochValidatorIDs(epoch: $currentEpoch) {
      validatorIDs
    }
  }
`;

export const GET_VALIDATOR = gql`
  query GetValidator($validatorId: Int!) {
    getValidator(validatorID: $validatorId) {
      status
      receivedStake
      auth
      createdEpoch
      createdTime
      deactivatedTime
      deactivatedEpoch
    }
  }
`;