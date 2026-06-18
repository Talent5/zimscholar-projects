import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  SearchCheck,
  FileCheck,
  ShieldCheck,
  Award,
  Star,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Button } from '../components/Button';
import ServicesPreview from '../components/ServicesPreview';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';
import { SEO, organizationStructuredData, localBusinessStructuredData } from '../components/SEO';

interface PortfolioProject {
  _id: string; title: string; slug: string; description: string;
  category: string; projectType: 'ready-made' | 'custom-showcase';
  projectId?: string; thumbnail: string; videoUrl?: string;
  technologies: string[]; price?: number; isAvailable: boolean;
  isFeatured: boolean; demoUrl?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => { fetchFeaturedProjects(); }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const r = await fetch(getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO));
      const d = await r.json();
      setFeaturedProjects(d.filter((p: PortfolioProject) => p.isFeatured).slice(0, 3));
    } catch (_) {}
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div>
      <SEO
        title="Academic Research & Projects Zimbabwe | Turnitin-Ready — All Disciplines"
        description="Zimbabwe's trusted academic service. Research papers, dissertations, proposals, and projects across all disciplines. Turnitin-checked, plagiarism-free, AI content removed."
        keywords="research papers Zimbabwe, dissertation help, thesis writing, academic writing, Turnitin check, AI content removal, plagiarism-free, literature review, data analysis, all academic subjects"
        canonicalUrl="https://scholarxafrica.com/"
        structuredData={[organizationStructuredData, localBusinessStructuredData]}
      />

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 swiss-grid opacity-70" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <motion.div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-[0.2em] bg-white/60">
                Turnitin-Ready  ·  Plagiarism-Free  ·  AI Content Removed
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="mb-8">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-tighter leading-none text-stone-300">
                Your Academic
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-none text-stone-800 text-overlap">
                Edge.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed text-balance font-light">
              Research papers, dissertations, proposals, and academic projects across all disciplines —
              every submission Turnitin-checked and AI-free before it reaches you.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-neon-cyan text-white text-sm font-semibold tracking-wide btn-primary shadow-sm shadow-neon-cyan/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={18} /> Explore Projects
              </motion.button>
              <motion.button
                onClick={() => navigate('/quote')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold tracking-wide bg-white hover:border-stone-300 hover:bg-stone-50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Quote <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Dashboard-style metrics */}
          <motion.div
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '12', label: 'Disciplines Covered' },
              { value: '98%', label: 'On-Time Delivery' },
              { value: '4.9', label: 'Student Rating' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="dash-card p-5 text-center"
                whileHover={{ y: -2 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1 tracking-tight metric-value">{s.value}</div>
                <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <div className="w-5 h-8 rounded-full border border-stone-200 flex items-start justify-center p-1">
            <motion.div className="w-1 h-1.5 rounded-full bg-neon-cyan" animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ═══════ TRUST ═══════ */}
      <section className="relative py-16 section-divider">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <SearchCheck size={22} />, label: 'Turnitin Verified' },
              { icon: <FileCheck size={22} />, label: 'AI Content Removed' },
              { icon: <ShieldCheck size={22} />, label: 'Plagiarism Free' },
              { icon: <Award size={22} />, label: 'Documented Work' },
            ].map((t, i) => (
              <motion.div
                key={i} ref={useRef(null)}
                className="flex flex-col items-center gap-3 p-6 dash-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-neon-cyan">{t.icon}</div>
                <span className="text-sm font-medium text-stone-600">{t.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TURNITIN SECTION ═══════ */}
      <section className="relative py-24 section-divider overflow-hidden">
        <div className="absolute inset-0 swiss-grid opacity-50 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }} className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4 bg-white/60">
              Academic Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4 tracking-tight">Every Project. Checked Twice.</h2>
            <p className="text-stone-500 max-w-2xl mx-auto font-light text-lg">
              We run every submission through Turnitin similarity detection and AI content analysis before it reaches you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <SearchCheck size={26} className="text-neon-cyan" />, title: 'Turnitin Similarity Check', desc: 'Scanned through Turnitin before delivery. Guaranteed under 10% similarity — you get the report.' },
              { icon: <GraduationCap size={26} className="text-neon-cyan" />, title: 'AI Detection & Removal', desc: 'Advanced tools identify AI-generated passages. We rewrite them to read naturally — passes GPTZero and Turnitin AI.' },
              { icon: <FileCheck size={26} className="text-neon-cyan" />, title: 'Plagiarism-Free Guarantee', desc: 'Every project built from scratch. Unique code, unique writing — no recycled work, ever.' },
            ].map((item, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="dash-card p-8"
              >
                <div className="w-13 h-13 rounded-xl bg-blue-50 flex items-center justify-center mb-6">{item.icon}</div>
                <h3 className="text-lg font-bold text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServicesPreview />

      {/* ═══════ FEATURED ═══════ */}
      {featuredProjects.length > 0 && (
        <section className="relative py-24 section-divider overflow-hidden">
          <div className="absolute inset-0 swiss-grid opacity-50 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionHeading badge="Portfolio" title="Featured Projects" subtitle="Turnitin-checked, AI-free — ready-made and custom across all disciplines" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} navigate={navigate} />)}
            </div>
            <div className="text-center mt-14">
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold bg-white hover:border-stone-300 hover:bg-stone-50 transition-all"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                View All Projects <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative py-24 section-divider">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading badge="Testimonials" title="What Students Say" subtitle="Trusted across Zimbabwean universities" />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id} ref={useRef(null)}
                className="dash-card p-6"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="flex text-neon-cyan mb-4 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-stone-600 text-sm italic mb-4 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center text-xs font-bold text-white">{t.name[0]}</div>
                  <div>
                    <p className="text-stone-800 text-sm font-semibold">{t.name}</p>
                    <p className="text-stone-400 text-xs">{t.role}, {t.institution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0"><div className="orb orb-1" /><div className="orb orb-2" /></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-6 tracking-tight">
              Ready to Start Your <span className="block text-neon-cyan">Next Project?</span>
            </h2>
            <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto font-light">
              From research proposals to final dissertations — every project checked, every time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/quote')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-neon-cyan text-white text-sm font-semibold tracking-wide btn-primary shadow-sm shadow-neon-cyan/20"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <Zap size={18} /> Get Your Free Quote
              </motion.button>
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold bg-white hover:border-stone-300 hover:bg-stone-50 transition-all"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                Browse Projects <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const SectionHeading: React.FC<{ badge: string; title: string; subtitle: string }> = ({ badge, title, subtitle }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className="text-center mb-16" initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      <span className="inline-block px-4 py-1.5 rounded-full border border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4 bg-white/60">{badge}</span>
      <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4 tracking-tight">{title}</h2>
      <p className="text-stone-500 max-w-xl mx-auto font-light">{subtitle}</p>
    </motion.div>
  );
};

const ImagePlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
    <div className="text-center">
      <Star size={32} className="text-stone-300 mx-auto mb-2" />
      <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">{title.slice(0, 30)}</span>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: PortfolioProject; index: number; navigate: (path: string) => void }> = ({ project, index, navigate }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <motion.div
      ref={ref} className="dash-card overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      onClick={() => navigate('/portfolio')}
    >
      <div className="relative h-52 bg-stone-100 overflow-hidden">
        {project.videoUrl && !videoError ? (
          <video src={getFileUrl(project.videoUrl)} controls className="w-full h-full object-cover" poster={project.thumbnail && !imgError ? getFileUrl(project.thumbnail) : undefined} onError={() => setVideoError(true)} />
        ) : project.thumbnail && !imgError ? (
          <img src={getFileUrl(project.thumbnail)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={() => setImgError(true)} />
        ) : <ImagePlaceholder title={project.title} />}
        <div className="absolute top-3 right-3">
          <div className="w-9 h-9 rounded-lg bg-white/80 backdrop-blur-sm border border-stone-200 flex items-center justify-center">
            <Star size={16} className="text-neon-cyan" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 rounded-full border border-stone-200 text-stone-500 text-[10px] font-semibold uppercase tracking-wider">{project.category}</span>
          {project.projectId && <span className="px-3 py-1 rounded-full border border-stone-200 text-stone-400 text-[10px] font-mono">{project.projectId}</span>}
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-neon-cyan transition-colors">{project.title}</h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">{project.description}</p>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {project.technologies.slice(0, 3).map((t, i) => <span key={i} className="px-2 py-1 rounded-md bg-stone-50 text-stone-500 text-[10px] font-medium">{t}</span>)}
            {project.technologies.length > 3 && <span className="px-2 py-1 rounded-md bg-stone-50 text-stone-500 text-[10px] font-medium">+{project.technologies.length - 3}</span>}
          </div>
        )}
        {project.projectType === 'ready-made' && project.price && (
          <div className="flex justify-between items-center p-3 rounded-xl bg-stone-50 mb-4">
            <span className="text-xl font-bold text-stone-800">${project.price}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${project.isAvailable ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
              {project.isAvailable ? 'Available' : 'Sold'}
            </span>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={(e) => { e.stopPropagation(); navigate('/portfolio'); }} className="flex-1 px-4 py-2.5 rounded-xl bg-neon-cyan text-white text-sm font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all">View Details</button>
          {project.demoUrl && (
            <button onClick={(e) => { e.stopPropagation(); window.open(project.demoUrl, '_blank'); }} className="p-2.5 rounded-xl border border-stone-200 text-stone-400 hover:text-neon-cyan hover:border-stone-300 transition-all"><ExternalLink size={16} /></button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
