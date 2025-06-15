import { create } from 'zustand';



const authStore = create((set) => ({
    userProfile: null,
    addUser: (user: any) => set({ userProfile: user }),
    removeUser: () => set({ userProfile: null }),
}));

export default authStore;