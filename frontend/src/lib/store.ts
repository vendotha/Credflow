import { create } from 'zustand';

type Stats = { totalReferredUsers: number; convertedUsers: number; totalCredits: number; };
type UserInfo = { id: string; email: string; name: string; referralCode: string; credits: number; };

type State = {
  user?: UserInfo;
  stats?: Stats;
  loading: boolean;
  setUser: (u: UserInfo) => void;
  setStats: (s: Stats) => void;
  setLoading: (b: boolean) => void;
};

export const useAppStore = create<State>((set) => ({
  loading: false,
  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading })
}));
