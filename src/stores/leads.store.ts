import { create } from 'zustand';

interface LeadsStore {
  selectedLeadId: string | null;
  isDrawerOpen: boolean;
  setSelectedLead: (leadId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useLeadsStore = create<LeadsStore>((set) => ({
  selectedLeadId: null,
  isDrawerOpen: false,
  setSelectedLead: (leadId) => set({ selectedLeadId: leadId }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, selectedLeadId: null }),
}));
