import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockTeam, type TeamMember } from '@/components/settings/mockSettingsData';

interface TeamContextType {
  team: TeamMember[];
  addMember: (member: TeamMember) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  /** Returns only active professionals and managers (people who can have appointments) */
  professionals: TeamMember[];
}

const TeamContext = createContext<TeamContextType | null>(null);

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);

  const addMember = useCallback((member: TeamMember) => {
    setTeam(prev => [...prev, member]);
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const removeMember = useCallback((id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  }, []);

  const professionals = team.filter(
    m => m.active && (m.role === 'professional' || m.role === 'manager')
  );

  return (
    <TeamContext.Provider value={{ team, addMember, updateMember, removeMember, professionals }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamProvider');
  return ctx;
};
