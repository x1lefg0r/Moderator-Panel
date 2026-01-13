import { create } from "zustand";

interface ModerationModalState {
  mode: "reject" | "changes" | null;
  adId: string | null;
}

interface UIStore {
  moderation: ModerationModalState;
  openModerationModal: (mode: "reject" | "changes", adId: string) => void;
  closeModerationModal: () => void;
}

export const UseUIStore = create<UIStore>((set) => ({
  moderation: {
    mode: null,
    adId: null,
  },

  openModerationModal: (mode, adId) => set({ moderation: { mode, adId } }),

  closeModerationModal: () => set({ moderation: { mode: null, adId: null } }),
}));
