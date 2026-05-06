import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, GripVertical, Image } from 'lucide-react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input, { Textarea } from '../../components/ui/Input'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import { serviceSchema } from '../../utils/validators'
import serviceService from '../../services/serviceService'
import useNotificationStore from '../../store/notificationStore'
import { formatPriceRange, formatDuration } from '../../utils/formatters'

const CATEGORIES = ['maintenance', 'repair', 'performance', 'topset', 'general']

function SortableServiceRow({ service, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card p-4 flex items-center gap-4"
    >
      <button {...attributes} {...listeners} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-grab active:cursor-grabbing">
        <GripVertical size={18} />
      </button>

      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--admin-accent)]/10 to-blue-400/5 border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
        {service.image_url
          ? <img src={service.image_url} alt={service.name_en} className="w-full h-full object-cover rounded-xl" />
          : <Image size={18} className="text-[var(--text-muted)]" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-[var(--text-primary)] truncate">{service.name_en}</p>
        {service.name_bm && <p className="text-xs text-[var(--text-muted)] font-body">{service.name_bm}</p>}
      </div>

      <Badge status={service.category} />

      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-[var(--admin-accent)] font-body">{formatPriceRange(service.price_min, service.price_max)}</p>
        <p className="text-xs text-[var(--text-muted)] font-body">{formatDuration(service.duration_minutes)}</p>
      </div>

      <button
        onClick={() => onToggle(service)}
        className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${service.is_active ? 'bg-[var(--admin-accent)]' : 'bg-[var(--border-subtle)]'}`}
        title={service.is_active ? 'Deactivate' : 'Activate'}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${service.is_active ? 'left-5' : 'left-0.5'}`} />
      </button>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onEdit(service)} className="p-2 rounded-lg text-[var(--admin-accent)] hover:bg-blue-500/10 transition-colors">
          <Edit2 size={15} />
        </button>
        <button onClick={() => onDelete(service)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default function ManageServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { success: showSuccess, error: showError } = useNotificationStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { is_active: true, duration_minutes: 60 },
  })

  const fetchServices = () => {
    setLoading(true)
    serviceService.getServices(null, true)
      .then((res) => setServices(res.data))
      .catch(() => showError('Failed to load services'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const openAdd = () => {
    setEditTarget(null)
    reset({ is_active: true, duration_minutes: 60 })
    setModalOpen(true)
  }

  const openEdit = (service) => {
    setEditTarget(service)
    reset({
      name_en: service.name_en,
      name_bm: service.name_bm || '',
      category: service.category,
      description: service.description || '',
      price_min: service.price_min,
      price_max: service.price_max,
      duration_minutes: service.duration_minutes,
      is_active: service.is_active,
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editTarget) {
        await serviceService.updateService(editTarget.id, data)
        showSuccess('Service updated successfully')
      } else {
        await serviceService.createService(data)
        showSuccess('Service created successfully')
      }
      setModalOpen(false)
      fetchServices()
    } catch {
      showError('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await serviceService.deleteService(deleteTarget.id)
      showSuccess('Service deleted')
      setDeleteTarget(null)
      fetchServices()
    } catch {
      showError('Failed to delete service')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggle = async (service) => {
    try {
      await serviceService.updateService(service.id, { is_active: !service.is_active })
      showSuccess(`Service ${service.is_active ? 'deactivated' : 'activated'}`)
      fetchServices()
    } catch {
      showError('Failed to update service')
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = services.findIndex((s) => s.id === active.id)
    const newIndex = services.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(services, oldIndex, newIndex)
    setServices(reordered)
    try {
      await serviceService.reorderServices(reordered.map((s) => s.id))
    } catch {
      showError('Failed to save order')
      fetchServices()
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Manage Services</h1>
          <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Drag to reorder. Toggle to show/hide.</p>
        </div>
        <Button variant="admin" onClick={openAdd} className="flex items-center gap-2">
          <Plus size={16} />
          Add Service
        </Button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-[var(--text-muted)] font-body mb-4">No services added. Add your first service!</p>
          <Button variant="admin" onClick={openAdd}>Add Service</Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={services.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <SortableServiceRow
                  key={service.id}
                  service={service}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Service' : 'Add New Service'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Service Name (EN)" placeholder="Engine Oil Change" error={errors.name_en?.message} required admin {...register('name_en')} />
            <Input label="Service Name (BM)" placeholder="Tukar Minyak Enjin" admin {...register('name_bm')} />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] font-body block mb-1.5">
              Category <span className="text-[var(--danger)]">*</span>
            </label>
            <select className="input-field input-field-admin capitalize" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[var(--bg-secondary)] capitalize">{c}</option>)}
            </select>
            {errors.category && <p className="text-xs text-[var(--danger)] mt-1">{errors.category.message}</p>}
          </div>

          <Textarea label="Description" placeholder="Service description..." admin {...register('description')} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Price (RM)" type="number" step="0.01" error={errors.price_min?.message} admin {...register('price_min', { valueAsNumber: true })} />
            <Input label="Max Price (RM)" type="number" step="0.01" error={errors.price_max?.message} admin {...register('price_max', { valueAsNumber: true })} />
          </div>

          <Input label="Duration (minutes)" type="number" error={errors.duration_minutes?.message} required admin {...register('duration_minutes', { valueAsNumber: true })} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-[var(--admin-accent)]" {...register('is_active')} />
            <span className="text-sm text-[var(--text-secondary)] font-body">Active (visible to customers)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="admin" type="submit" loading={saving} className="flex-1">{editTarget ? 'Save Changes' : 'Add Service'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Service?"
        message={`Are you sure you want to delete "${deleteTarget?.name_en}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
