import { useEffect, useState } from 'react';
import { SFCContract, Validator, EpochData } from '@/app/lib/contracts/sfc';
import { weiToToken } from '@/app/lib/utils';

interface ValidatorData {
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

interface DashboardData {
  totalStake: string;
  totalDelegated: string;
  validators: ValidatorData[];
  currentEpoch: number;
  epochData: EpochData | null;
}

export function useSFC() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = async () => {
    try {
      const contract = new SFCContract();
      const [stakingInfo, currentEpoch, epochData] = await Promise.all([
        contract.getStakingInfo(),
        contract.getCurrentEpoch(),
        contract.getEpochData(),
      ]);

      setData({
        totalStake: stakingInfo.totalStake.toString(),
        totalDelegated: stakingInfo.totalDelegated.toString(),
        validators: stakingInfo.validators,
        currentEpoch,
        epochData,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
} 