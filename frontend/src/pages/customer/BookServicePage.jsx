import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import ServiceCard from '../../components/shared/ServiceCard'
import Button from '../../components/ui/Button'
import Input, { Textarea } from '../../components/ui/Input'
import serviceService from '../../services/serviceService'
import bookingService from '../../services/bookingService'
import useBookingStore from '../../store/bookingStore'
import useNotificationStore from '../../store/notificationStore'
import { SERVICE_CATEGORIES } from '../../utils/constants'
import { formatDate, formatTime, formatPriceRange } from '../../utils/formatters'

const steps = ['Choose Services', 'Date & Time', 'Confirm']

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isDone = step < currentStep
        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${isActive ? 'text-[var(--accent-primary)]' : isDone ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display border-2 transition-all
                ${isActive ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : isDone ? 'border-green-400 bg-green-500/10' : 'border-[var(--border-subtle)]'}`}>
                {isDone ? <Check size={14} /> : step}
              </div>
              <span className="text-xs font-medium font-body hidden sm:block">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-px ${step < currentStep ? 'bg-green-400' : 'bg-[var(--border-subtle)]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Step 1: Service Selection
function Step1({ services, loading, categoryFilter, setCategoryFilter }) {
  const { selectedServices, toggleService } = useBookingStore()
  const total = selectedServices.reduce((sum, s) => sum + (s.price_min || 0), 0)

  const filtered = categoryFilter === 'all' ? services : services.filter((s) => s.category === categoryFilter)

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">Choose Services</h2>
      <p className="text-[var(--text-secondary)] font-body text-sm mb-6">Select one or more services for your appointment</p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICE_CATEGORIES.slice(0, 5).map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium font-body transition-all
              ${categoryFilter === cat.value ? 'bg-[var(--accent-primary)] text-white' : 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-64"><div className="skeleton h-full rounded-xl" /></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selectable
              selected={selectedServices.some((s) => s.id === service.id)}
              onSelect={toggleService}
            />
          ))}
        </div>
      )}

      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-card p-4 border-[var(--border-active)] flex items-center justify-between"
        >
          <span className="text-sm text-[var(--text-secondary)] font-body">
            {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
          </span>
          <span className="font-display font-bold text-[var(--accent-primary)]">
            From RM {total.toFixed(0)}
          </span>
        </motion.div>
      )}
    </div>
  )
}

// Step 2: Date & Time + Motorcycle Details
function Step2({ availableSlots, loadingSlots }) {
  const { selectedDate, selectedSlot, motorcycleDetails, setSelectedDate, setSelectedSlot, setMotorcycleDetails } = useBookingStore()

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">Date & Time</h2>
      <p className="text-[var(--text-secondary)] font-body text-sm mb-6">Choose your preferred appointment slot</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] font-body block mb-1.5">
              Select Date <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              type="date"
              min={today}
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] font-body block mb-2">
                Select Time Slot <span className="text-[var(--danger)]">*</span>
              </label>
              {loadingSlots ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="skeleton h-10 rounded-xl" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] font-body">No slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.slot_time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.slot_time)}
                      className={`py-2.5 rounded-xl text-sm font-medium font-body transition-all
                        ${selectedSlot === slot.slot_time
                          ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_16px_var(--accent-glow)]'
                          : slot.available
                            ? 'glass-card text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]'
                            : 'opacity-30 cursor-not-allowed glass-card text-[var(--text-muted)]'
                        }`}
                    >
                      {formatTime(slot.slot_time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Motorcycle Details</h3>
          <Input
            label="Model"
            placeholder="e.g. Yamaha LC 135"
            value={motorcycleDetails.model}
            onChange={(e) => setMotorcycleDetails({ model: e.target.value })}
            required
          />
          <Input
            label="Year"
            type="number"
            placeholder="e.g. 2022"
            value={motorcycleDetails.year}
            onChange={(e) => setMotorcycleDetails({ year: e.target.value })}
            required
          />
          <Input
            label="License Plate"
            placeholder="e.g. WXY 1234"
            value={motorcycleDetails.licensePlate}
            onChange={(e) => setMotorcycleDetails({ licensePlate: e.target.value })}
            required
          />
          <Input
            label="Mileage (km)"
            type="number"
            placeholder="e.g. 15000"
            value={motorcycleDetails.mileage}
            onChange={(e) => setMotorcycleDetails({ mileage: e.target.value })}
          />
          <Textarea
            label="Special Notes"
            placeholder="Any specific issues or requests..."
            value={motorcycleDetails.specialNotes}
            onChange={(e) => setMotorcycleDetails({ specialNotes: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}

// Step 3: Confirmation
function Step3() {
  const { selectedServices, selectedDate, selectedSlot, motorcycleDetails } = useBookingStore()
  const total = selectedServices.reduce((sum, s) => sum + (s.price_min || 0), 0)

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">Confirm Booking</h2>
      <p className="text-[var(--text-secondary)] font-body text-sm mb-6">Review your booking details before confirming</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">Selected Services</h3>
          <div className="flex flex-col gap-3">
            {selectedServices.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)] font-body">{s.name_en}</span>
                <span className="text-sm font-semibold text-[var(--accent-primary)] font-body">
                  {formatPriceRange(s.price_min, s.price_max)}
                </span>
              </div>
            ))}
            <div className="border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between">
              <span className="font-display font-semibold text-[var(--text-primary)]">Estimated Total</span>
              <span className="font-display font-bold text-xl text-[var(--accent-primary)]">RM {total.toFixed(0)}+</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-3">Appointment</h3>
            <div className="flex flex-col gap-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Date</span>
                <span className="text-[var(--text-primary)]">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Time</span>
                <span className="text-[var(--text-primary)]">{formatTime(selectedSlot)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-3">Motorcycle</h3>
            <div className="flex flex-col gap-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Model</span>
                <span className="text-[var(--text-primary)]">{motorcycleDetails.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Year</span>
                <span className="text-[var(--text-primary)]">{motorcycleDetails.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Plate</span>
                <span className="text-[var(--text-primary)]">{motorcycleDetails.licensePlate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Success Screen
function SuccessScreen({ bookingRef, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-400" />
      </div>
      <h2 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-2">Booking Confirmed!</h2>
      <p className="text-[var(--text-secondary)] font-body mb-4">Your booking has been submitted successfully.</p>
      <div className="inline-block glass-card px-6 py-3 mb-8">
        <p className="text-xs text-[var(--text-muted)] font-body mb-1">Booking Reference</p>
        <p className="font-mono font-bold text-xl text-[var(--accent-primary)]">{bookingRef}</p>
      </div>
      <div className="flex gap-3 justify-center">
        <Button variant="ghost" onClick={onReset}>Book Another</Button>
        <Button onClick={() => window.location.href = '/dashboard/bookings'}>View Bookings</Button>
      </div>
    </motion.div>
  )
}

export default function BookServicePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState(null)

  const { selectedServices, selectedDate, selectedSlot, motorcycleDetails, reset } = useBookingStore()
  const { error: showError } = useNotificationStore()

  useEffect(() => {
    serviceService.getServices()
      .then((res) => setServices(res.data))
      .catch(() => {})
      .finally(() => setLoadingServices(false))
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    bookingService.getAvailableSlots(selectedDate)
      .then((res) => setAvailableSlots(res.data))
      .catch(() => {})
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  const canProceed = () => {
    if (currentStep === 1) return selectedServices.length > 0
    if (currentStep === 2) return selectedDate && selectedSlot && motorcycleDetails.model && motorcycleDetails.year && motorcycleDetails.licensePlate
    return true
  }

  const handleNext = () => {
    if (!canProceed()) {
      showError(currentStep === 1 ? 'Please select at least one service' : 'Please fill in all required fields')
      return
    }
    setCurrentStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const total = selectedServices.reduce((sum, s) => sum + (s.price_min || 0), 0)
      const res = await bookingService.createBooking({
        booking_date: selectedDate,
        booking_time: selectedSlot,
        services: selectedServices.map((s) => ({ service_id: s.id, quantity: 1, price_at_booking: s.price_min })),
        motorcycle_model: motorcycleDetails.model,
        motorcycle_year: parseInt(motorcycleDetails.year),
        license_plate: motorcycleDetails.licensePlate,
        mileage: motorcycleDetails.mileage ? parseInt(motorcycleDetails.mileage) : null,
        special_notes: motorcycleDetails.specialNotes || null,
        total_estimated_price: total,
      })
      setBookingRef(res.data.booking_reference)
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    setCurrentStep(1)
    setBookingRef(null)
    setAvailableSlots([])
  }

  if (bookingRef) {
    return (
      <div className="glass-card p-8">
        <SuccessScreen bookingRef={bookingRef} onReset={handleReset} />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Book a Service</h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Schedule your motorcycle service appointment</p>
      </motion.div>

      <div className="glass-card p-6 sm:p-8">
        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {currentStep === 1 && (
              <Step1
                services={services}
                loading={loadingServices}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            )}
            {currentStep === 2 && (
              <Step2 availableSlots={availableSlots} loadingSlots={loadingSlots} />
            )}
            {currentStep === 3 && <Step3 />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-subtle)]">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting}>
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
