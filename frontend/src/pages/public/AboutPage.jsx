import { motion } from 'framer-motion'
import { Award, Users, Wrench, Heart, MapPin, Phone, Facebook, Target, Eye } from 'lucide-react'
import { WORKSHOP_INFO } from '../../utils/constants'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

const values = [
  { icon: Award, title: 'Trustworthy', titleBm: 'Amanah', desc: 'We are honest about what your motorcycle needs. No unnecessary upsells — just quality work.' },
  { icon: Wrench, title: 'Professional', titleBm: 'Profesional', desc: 'Every technician is trained specifically on Yamaha LC 135, FZ, and Y15ZR systems.' },
  { icon: Heart, title: 'Affordable', titleBm: 'Mampu Milik', desc: 'Quality service should not break the bank. Competitive pricing for every rider.' },
  { icon: Users, title: 'Quality Parts', titleBm: 'Alat Ganti Berkualiti', desc: 'We use only genuine or trusted aftermarket parts for your safety and performance.' },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-3">
              Ditubuhkan 2013
            </p>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--text-primary)] mb-6">
              TENTANG KAMI
            </h1>
            <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed max-w-2xl mx-auto">
              Bengkel motosikal pakar Yamaha LC 135, FZ & Y15ZR di Kuala Lumpur sejak 2013.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story + Image */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Workshop image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="w-full h-80 rounded-2xl overflow-hidden border border-[var(--border-subtle)]"
          >
            <img
              src="/images/workshop.jpg"
              alt="Cabin Crew Motorsport Workshop"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.05 }}
          >
            <h2 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-4">
              Kisah Kami
            </h2>
            <div className="flex flex-col gap-4 text-[var(--text-secondary)] font-body text-sm leading-relaxed">
              <p>
                Cabin Crew Motorsport telah ditubuhkan pada tahun <strong className="text-[var(--text-primary)]">2013</strong> oleh
                <strong className="text-[var(--accent-primary)]"> En. Yazid Bin Harun</strong> dengan satu misi — menyediakan
                perkhidmatan motosikal yang mampu milik dan berkualiti tinggi untuk setiap lapisan pengguna.
              </p>
              <p>
                Terletak di <strong className="text-[var(--text-primary)]">Pangsapuri Sri Malaysia, Kg Malaysia Tambahan, 57100 Kuala Lumpur</strong>,
                bengkel kami telah berkembang menjadi salah satu bengkel pakar Yamaha yang dipercayai di KL,
                dengan kepakaran khusus dalam model <strong className="text-[var(--accent-primary)]">LC 135, FZ, dan Y15ZR</strong>.
              </p>
              <p>
                Diuruskan sepenuhnya oleh keluarga, kami memastikan setiap pelanggan mendapat perhatian peribadi
                dan perkhidmatan yang jujur — seperti yang anda harapkan daripada bengkel keluarga.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mb-4">
                <Target size={22} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">MISI</h3>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                {WORKSHOP_INFO.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mb-4">
                <Eye size={22} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">VISI</h3>
              <p className="text-[var(--text-secondary)] font-body leading-relaxed">
                {WORKSHOP_INFO.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">NILAI KAMI</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div key={i} variants={itemVariants} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-[var(--accent-primary)]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{v.title}</h3>
                <p className="text-xs text-[var(--accent-primary)] font-body mb-2">{v.titleBm}</p>
                <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Management Team */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">PENGURUSAN</h2>
            <p className="text-[var(--text-secondary)] font-body mt-2">Diuruskan oleh keluarga untuk komuniti</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {WORKSHOP_INFO.management.map((member, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-display font-bold text-xl">
                    {member.name.split(' ').find(w => w.length > 2 && w !== 'En.' && w !== 'Pn.')?.[0] || member.name[0]}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-[var(--text-primary)] leading-tight">{member.name}</h3>
                <p className="text-xs text-[var(--accent-primary)] font-body mt-1 leading-snug">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Specialists */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">PAKAR YAMAHA</h2>
          <p className="text-[var(--text-secondary)] font-body mt-2">Model yang kami pakar</p>
        </motion.div>

        <div className="flex flex-wrap gap-4 justify-center">
          {WORKSHOP_INFO.specialists.map((model, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card px-8 py-4 border-[var(--border-active)]"
            >
              <span className="font-display font-bold text-2xl text-[var(--accent-primary)]">{model}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">GALERI BENGKEL</h2>
          <p className="text-[var(--text-secondary)] font-body mt-2">Suasana dan kerja di Cabin Crew Motorsport</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {Array.from({ length: 17 }, (_, i) => i + 1).map((num) => (
            <motion.div
              key={num}
              variants={itemVariants}
              className="aspect-square rounded-xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all cursor-pointer group"
            >
              <img
                src={`/images/workshop/workshop-${num}.jpg`}
                alt={`Cabin Crew Motorsport - Photo ${num}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Info + Map */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">LOKASI KAMI</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Alamat</p>
                  <p className="text-sm text-[var(--text-primary)] font-body">{WORKSHOP_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[var(--accent-primary)] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">No. Bengkel</p>
                  <a href={`tel:${WORKSHOP_INFO.phone}`} className="text-sm text-[var(--text-primary)] font-body hover:text-[var(--accent-primary)] transition-colors">
                    {WORKSHOP_INFO.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Facebook size={20} className="text-[var(--accent-primary)] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Facebook</p>
                  <a href={WORKSHOP_INFO.facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-body transition-colors">
                    {WORKSHOP_INFO.facebook}
                  </a>
                </div>
              </div>
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-muted)] font-body uppercase tracking-wider mb-1">Waktu Operasi</p>
                <p className="text-sm text-[var(--text-primary)] font-body">{WORKSHOP_INFO.hours}</p>
                <p className="text-xs text-[var(--text-muted)] font-body mt-0.5">{WORKSHOP_INFO.closed}</p>
              </div>
              <a
                href={WORKSHOP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm text-center mt-2"
              >
                <MapPin size={16} />
                Dapatkan Arah
              </a>
            </div>

            <div className="glass-card overflow-hidden p-0 h-80">
              <iframe
                title="Cabin Crew Motorsport Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0!2d101.6869!3d3.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4a5b5b5b5b5b%3A0x0!2sPangsapuri+Sri+Malaysia%2C+Jalan+3%2F141%2C+Kuala+Lumpur!5e0!3m2!1sen!2smy!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
