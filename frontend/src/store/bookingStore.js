import { create } from 'zustand'

const useBookingStore = create((set) => ({
  // Step 1 — selected services
  selectedServices: [],   // [{ id, name_en, price_min, price_max, duration_minutes, category }]

  // Step 2 — date/time + motorcycle
  selectedDate: null,     // 'YYYY-MM-DD'
  selectedSlot: null,     // 'HH:MM'
  motorcycleDetails: {
    model: '',
    year: '',
    licensePlate: '',
    mileage: '',
    specialNotes: '',
  },

  // Wizard state
  currentStep: 1,

  // Actions
  setSelectedServices: (services) => set({ selectedServices: services }),

  toggleService: (service) =>
    set((state) => {
      const exists = state.selectedServices.find((s) => s.id === service.id)
      if (exists) {
        return { selectedServices: state.selectedServices.filter((s) => s.id !== service.id) }
      }
      return { selectedServices: [...state.selectedServices, service] }
    }),

  setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null }),

  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  setMotorcycleDetails: (details) =>
    set((state) => ({
      motorcycleDetails: { ...state.motorcycleDetails, ...details },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  getTotalPrice: () => {
    const { selectedServices } = useBookingStore.getState()
    return selectedServices.reduce((total, s) => {
      const price = s.price_min || 0
      return total + price
    }, 0)
  },

  reset: () =>
    set({
      selectedServices: [],
      selectedDate: null,
      selectedSlot: null,
      motorcycleDetails: { model: '', year: '', licensePlate: '', mileage: '', specialNotes: '' },
      currentStep: 1,
    }),
}))

export default useBookingStore
