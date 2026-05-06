import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Camera, Shield, Trash2, User } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/shared/ConfirmDialog'
import { profileSchema, passwordChangeSchema } from '../../utils/validators'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import useNotificationStore from '../../store/notificationStore'
import { formatDate } from '../../utils/formatters'

export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore()
  const { success: showSuccess, error: showError } = useNotificationStore()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [togglingMfa, setTogglingMfa] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
  })

  const onSaveProfile = async (data) => {
    setSavingProfile(true)
    try {
      const res = await api.put('/users/profile', data)
      setUser({ ...user, ...res.data })
      showSuccess('Profile updated successfully')
    } catch {
      showError('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (data) => {
    setSavingPassword(true)
    try {
      await api.post('/users/change-password', {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      showSuccess('Password changed successfully')
      passwordForm.reset()
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setSavingPassword(false)
    }
  }

  const onToggleMfa = async () => {
    const password = prompt('Enter your current password to toggle MFA:')
    if (!password) return
    setTogglingMfa(true)
    try {
      const res = await api.post('/users/toggle-mfa', {
        current_password: password,
        enable: !user?.mfa_enabled,
      })
      setUser({ ...user, mfa_enabled: res.data.mfa_enabled })
      showSuccess(res.data.message)
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to toggle MFA')
    } finally {
      setTogglingMfa(false)
    }
  }

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/users/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setUser({ ...user, avatar_url: res.data.avatar_url })
      showSuccess('Avatar updated!')
    } catch {
      showError('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">My Profile</h1>
        <p className="text-[var(--text-secondary)] font-body text-sm mt-1">Manage your account information and security settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar + Account Info */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-6 text-center">
            <div className="relative inline-block mb-4">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-24 h-24 rounded-full object-cover mx-auto" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto">
                  <span className="text-white font-display font-bold text-3xl">{user?.full_name?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center cursor-pointer hover:bg-[var(--accent-secondary)] transition-colors shadow-lg">
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} disabled={uploadingAvatar} />
              </label>
            </div>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{user?.full_name}</h3>
            <p className="text-xs text-[var(--text-muted)] font-body">{user?.email}</p>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-display font-semibold text-base text-[var(--text-primary)] mb-4">Account Info</h3>
            <div className="flex flex-col gap-3 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Email</span>
                <span className="text-[var(--text-secondary)] truncate max-w-[160px]">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Role</span>
                <span className="text-[var(--accent-primary)] capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Member Since</span>
                <span className="text-[var(--text-secondary)]">{formatDate(user?.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile Form */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-5 flex items-center gap-2">
              <User size={20} className="text-[var(--accent-primary)]" />
              Personal Information
            </h3>
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="flex flex-col gap-4" noValidate>
              <Input label="Full Name" error={profileForm.formState.errors.full_name?.message} required {...profileForm.register('full_name')} />
              <Input label="Phone Number" type="tel" placeholder="012-3456789" error={profileForm.formState.errors.phone?.message} {...profileForm.register('phone')} />
              <Input label="Address" placeholder="Your address" error={profileForm.formState.errors.address?.message} {...profileForm.register('address')} />
              <Button type="submit" loading={savingProfile} className="self-start">Save Changes</Button>
            </form>
          </div>

          {/* Password Form */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-5">Change Password</h3>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="flex flex-col gap-4" noValidate>
              <Input label="Current Password" type="password" error={passwordForm.formState.errors.current_password?.message} required {...passwordForm.register('current_password')} />
              <Input label="New Password" type="password" hint="Min. 8 characters with letter and number" error={passwordForm.formState.errors.new_password?.message} required {...passwordForm.register('new_password')} />
              <Input label="Confirm New Password" type="password" error={passwordForm.formState.errors.confirm_password?.message} required {...passwordForm.register('confirm_password')} />
              <Button type="submit" loading={savingPassword} className="self-start">Update Password</Button>
            </form>
          </div>

          {/* MFA */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Two-Factor Authentication</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
                    {user?.mfa_enabled ? 'MFA is enabled. Your account is protected.' : 'Enable MFA for extra security.'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleMfa}
                disabled={togglingMfa}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${user?.mfa_enabled ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-subtle)]'}`}
                aria-label="Toggle MFA"
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${user?.mfa_enabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card p-6 border border-red-500/20">
            <h3 className="font-display font-bold text-lg text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-[var(--text-secondary)] font-body mb-4">Permanently delete your account and all associated data.</p>
            <Button variant="danger" size="sm" onClick={() => setDeleteDialogOpen(true)} className="flex items-center gap-2">
              <Trash2 size={14} />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => { logout(); setDeleteDialogOpen(false) }}
        title="Delete Account?"
        message="This will permanently delete your account and all your data. This action cannot be undone."
        confirmLabel="Delete My Account"
      />
    </div>
  )
}
