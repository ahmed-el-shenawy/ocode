import { create } from "zustand";

interface StudioState {
  sections: unknown[];
  addSection: () => void;
  removeSection: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  sections: [],
  addSection: () => set((state) => ({ sections: [...state.sections, {}] })),
  removeSection: () => set((state) => ({ sections: state.sections.slice(0, -1) })),
}));
