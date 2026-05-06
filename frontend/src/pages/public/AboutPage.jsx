import { motion } from 'framer-motion'
import { Award, Users, Wrench, Heart } from 'lucide-react'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

const values = [
  { icon: Award, title: 'Trustworthy', desc: 'We are honest about what your motorcycle needs and what it does not. No unnecessary upsells.' },
  { icon: Wrench, title: 'Professional', desc: 'Every technician is trained specifically on LC 135 systems. We do the job right the first time.' },
  { icon: Heart, title: 'Affordable', desc: 'Quality service should not break the bank. We offer competitive pricing without compromising on parts.' },
  { icon: Users, title: 'Quality Parts', desc: 'We use only genuine or trusted aftermarket parts. Your safety and performance are our priority.' },
]

const team = [
  { name: 'Hafiz Rahman', role: 'Founder & Head Mechanic', initials: 'HR' },
  { name: 'Azri Malik', role: 'Senior Technician', initials: 'AM' },
  { name: 'Syafiq Noor', role: 'Performance Specialist', initials: 'SN' },
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
            <p className="text-[var(--accent-primary)] font-body text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--text-primary)] mb-6">ABOUT US</h1>
            <p className="text-[var(--text-secondary)] font-body text-lg leading-relaxed max-w-2xl mx-auto">
              Born from a passion for LC 135 performance, Cabin Crew Motorsport has been serving the KL riding community with expert care and genuine parts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full h-80 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/5 border border-[var(--border-subtle)] flex items-center justify-center"
          >
            <div className="text-center">
              <Wrench size={48} className="text-[var(--accent-primary)]/30 mx-auto mb-3" />
              <p className="text-[var(--text-muted)] font-body text-sm">Workshop Photo</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-4">Our Journey</h2>
            <div className="flex flex-col gap-4 text-[var(--text-secondary)] font-body text-sm leading-relaxed">
              <p>
                Cabin Crew Motorsport was founded with a single mission: to provide LC 135 riders in Kuala Lumpur with a workshop they can truly trust. Located in the heart of Kampung Seri Malaysia, we have grown from a small garage operation into one of the most respected LC 135 specialists in the city.
              </p>
              <p>
                Our founder, a lifelong LC 135 enthusiast, noticed that most workshops treated the LC 135 as just another motorcycle. We knew it deserved better — specialised knowledge, dedicated tooling, and mechanics who ride the same machine they service.
              </p>
              <p>
                Today, we offer everything from routine maintenance and topset overhauls to full performance builds. Every job is done with the same care and precision we would want for our own bikes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">OUR VALUES</h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div key={i} variants={itemVariants} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--border-active)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">{v.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">OUR TEAM</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {team.map((member, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-display font-bold text-xl">{member.initials}</span>
              </div>
              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{member.name}</h3>
              <p className="text-xs text-[var(--text-muted)] font-body mt-1">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Map */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">FIND US</h2>
          <p className="text-[var(--text-secondary)] font-body mt-2">Kampung Seri Malaysia, Kuala Lumpur</p>
        </motion.div>

        <div className="glass-card overflow-hidden p-0 h-80">
          <iframe
            title="Cabin Crew Motorsport Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7!2d101.6!3d3.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMDYnMDAuMCJOIDEwMcKwMzYnMDAuMCJF!5e0!3m2!1sen!2smy!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  )
}
