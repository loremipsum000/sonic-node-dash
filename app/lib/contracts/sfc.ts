function hexToDecimal(hex: string): number {
  return parseInt(hex.replace('0x', ''), 16);
}

const GRAPHQL_ENDPOINT = '/api/graphql';

export interface Validator {
  id: string;
  address: string;
  totalStake: string;
  stake: string;
  delegatedMe: string;
  isActive: boolean;
  isCheater: boolean;
  isOffline: boolean;
  createdTime: string;
  downtime: string;
  name?: string;
  logoUrl?: string;
}

export interface StakingInfo {
  totalStake: bigint;
  totalDelegated: bigint;
  validators: Validator[];
}

export interface EpochData {
  id: string;
  endTime: string;
  duration: string;
  epochFee: string;
  totalSupply: string;
}

const GET_STAKING_INFO = `
  query {
    stakersNum
    stakers {
      id
      stakerAddress
      totalStake
      stake
      delegatedMe
      isActive
      isCheater
      isOffline
      createdTime
      downtime
      status
      stakerInfo {
        name
        logoUrl
      }
    }
  }
`;

const GET_CURRENT_EPOCH = `
  query {
    currentEpoch
  }
`;

const GET_EPOCH_DATA = `
  query {
    epoch {
      id
      endTime
      duration
      epochFee
      totalSupply
    }
  }
`;

export class SFCContract {
  private async fetchGraphQL(query: string) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
          cache: 'no-store'
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }

        const data = await response.json();

        if (data.errors) {
          const errorMessage = data.errors.map((e: any) => e.message).join(', ');
          throw new Error(`GraphQL Error: ${errorMessage}`);
        }

        return data.data;
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw lastError;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  async getStakingInfo(): Promise<StakingInfo> {
    const data = await this.fetchGraphQL(GET_STAKING_INFO);
    return {
      totalStake: BigInt(data.stakers.reduce((acc: bigint, v: any) => acc + BigInt(v.totalStake || 0), BigInt(0))),
      totalDelegated: BigInt(data.stakers.reduce((acc: bigint, v: any) => acc + BigInt(v.delegatedMe || 0), BigInt(0))),
      validators: data.stakers.map((v: any) => ({
        id: v.id,
        address: v.stakerAddress,
        totalStake: v.totalStake || '0',
        stake: v.stake || '0',
        delegatedMe: v.delegatedMe || '0',
        isActive: v.isActive,
        isCheater: v.isCheater,
        isOffline: v.isOffline,
        createdTime: v.createdTime,
        downtime: v.downtime,
        name: v.stakerInfo?.name,
        logoUrl: v.stakerInfo?.logoUrl
      }))
    };
  }

  async getCurrentEpoch(): Promise<number> {
    try {
      const data = await this.fetchGraphQL(GET_CURRENT_EPOCH);
      return hexToDecimal(data.currentEpoch);
    } catch (error) {
      console.error('Error in getCurrentEpoch:', error);
      throw error;
    }
  }

  async getEpochData(): Promise<EpochData> {
    try {
      const data = await this.fetchGraphQL(GET_EPOCH_DATA);
      return data.epoch;
    } catch (error) {
      console.error('Error in getEpochData:', error);
      throw error;
    }
  }
} 