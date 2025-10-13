import { create } from "zustand";

type ExitModalState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useExitModal = create<ExitModalState>((set) => ({
    isOpen: false, //TODO: Change back to true
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));    