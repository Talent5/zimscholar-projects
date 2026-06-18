import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  Award,
  CheckCircle,
  Star,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
} from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Button } from '../components/Button';
import ServicesPreview from '../components/ServicesPreview';
import { getApiUrl, getFileUrl, API_CONFIG } from '../config/api.config';
import { SEO, organizationStructuredData, localBusinessStructuredData } from '../components/SEO';

interface PortfolioProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  projectType: 'ready-made' | 'custom-showcase';
  projectId?: string;
  thumbnail: string;
  videoUrl?: string;
  technologies: string[];
  price?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  demoUrl?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.PUBLIC.PORTFOLIO));
      const data = await response.json();
      const featured = data.filter((p: PortfolioProject) => p.isFeatured).slice(0, 3);
      setFeaturedProjects(featured);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div className="relative">
      <SEO
        title="Academic Projects & Software Development Services in Zimbabwe"
        description="Leading academic project assistance and custom software development in Zimbabwe. Get ready-made or custom projects in Data Science, Machine Learning, Web Development, IoT & Software Engineering. Fast delivery, plagiarism-free work tailored for Zimbabwean students."
        keywords="academic projects Zimbabwe, software development Zimbabwe, data science projects, machine learning projects, web development Harare, IoT projects Zimbabwe, custom software Zimbabwe, student projects, final year projects Zimbabwe, Harare software developer, Zimbabwe tech services, programming projects Zimbabwe"
        canonicalUrl="https://scholarxafrica.com/"
        structuredData={[organizationStructuredData, localBusinessStructuredData]}
      />

      {/* ═══════ HERO ═══════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 swiss-grid opacity-40" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-[0.2em]">
                Academic Solutions
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="mb-10">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-none text-slate-500">
                Build The
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-white text-overlap">
                Future.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed text-balance font-light"
            >
              Ready-made & custom academic projects in Data Science, Machine Learning,
              Software Engineering & IoT — built for students in Zimbabwe.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neon-cyan text-white text-sm font-semibold tracking-wide btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles size={18} />
                Explore Projects
              </motion.button>
              <motion.button
                onClick={() => navigate('/quote')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/10 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request Custom Quote
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '12+', label: 'Tech Domains' },
              { value: '98%', label: 'On-Time Delivery' },
              { value: '4.9', label: 'Student Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-neon-cyan"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════ TRUST SIGNALS ═══════ */}
      <section className="relative py-16 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TrustCard index={0} icon={<ShieldCheck size={24} />} label="Plagiarism Free" />
            <TrustCard index={1} icon={<Clock size={24} />} label="On-Time Delivery" />
            <TrustCard index={2} icon={<Award size={24} />} label="Expert Developers" />
            <TrustCard index={3} icon={<CheckCircle size={24} />} label="Documented Code" />
          </div>
        </div>
      </section>

      {/* ═══════ SERVICES ═══════ */}
      <ServicesPreview />

      {/* ═══════ FEATURED PROJECTS ═══════ */}
      {featuredProjects.length > 0 && (
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 swiss-grid opacity-30 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6">
            <SectionHeading
              badge="Portfolio"
              title="Featured Projects"
              subtitle="Check out some of our best work — ready-made projects and custom showcases"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project._id} project={project} index={i} navigate={navigate} />
              ))}
            </div>

            <div className="text-center mt-14">
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Projects
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading
            badge="Testimonials"
            title="What Students Say"
            subtitle="Trusted by students across Zimbabwean universities"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your
              <span className="block text-neon-cyan">
                Next Project?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-light">
              Get in touch today and let us help you deliver an outstanding academic project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/quote')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neon-cyan text-white text-sm font-semibold tracking-wide btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={18} />
                Get Your Free Quote
              </motion.button>
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/10 text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Cpu size={18} />
                Browse Projects
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* ── Trust Signal Card ── */
const TrustCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  index: number;
}> = ({ icon, label, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/[0.04]"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </motion.div>
  );
};

/* ── Section Heading ── */
const SectionHeading: React.FC<{
  badge: string;
  title: string;
  subtitle: string;
}> = ({ badge, title, subtitle }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className="text-center mb-16"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">{title}</h2>
      <p className="text-slate-400 max-w-xl mx-auto font-light">{subtitle}</p>
    </motion.div>
  );
};

/* ── Project Card ── */
const ProjectCard: React.FC<{
  project: PortfolioProject;
  index: number;
  navigate: (path: string) => void;
}> = ({ project, index, navigate }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="group rounded-2xl overflow-hidden border border-white/[0.04] glow-card cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      onClick={() => navigate('/portfolio')}
    >
      <div className="relative h-52 bg-void-800 overflow-hidden">
        {project.videoUrl ? (
          <video
            src={getFileUrl(project.videoUrl)}
            controls
            className="w-full h-full object-cover"
            poster={project.thumbnail ? getFileUrl(project.thumbnail) : undefined}
          />
        ) : project.thumbnail ? (
          <img
            src={getFileUrl(project.thumbnail)}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : null}
        <div className="absolute top-3 right-3">
          <div className="w-9 h-9 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Star size={16} className="text-neon-cyan" fill="currentColor" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 rounded-full border border-white/[0.06] text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          {project.projectId && (
            <span className="px-3 py-1 rounded-full border border-white/[0.06] text-slate-500 text-[10px] font-mono">
              {project.projectId}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md bg-white/[0.03] text-slate-500 text-[10px] font-medium">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-white/[0.03] text-slate-500 text-[10px] font-medium">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {project.projectType === 'ready-made' && project.price && (
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] mb-4">
            <span className="text-xl font-bold text-white">${project.price}</span>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                project.isAvailable
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {project.isAvailable ? 'Available' : 'Sold'}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/portfolio'); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neon-cyan text-white text-sm font-semibold hover:shadow-lg hover:shadow-neon-cyan/15 transition-all"
          >
            View Details
          </button>
          {project.demoUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(project.demoUrl, '_blank'); }}
              className="p-2.5 rounded-xl border border-white/[0.06] text-slate-400 hover:text-neon-cyan hover:border-white/[0.12] transition-all"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Testimonial Card ── */
const TestimonialCard: React.FC<{
  testimonial: { id: number; name: string; role: string; institution: string; content: string };
  index: number;
}> = ({ testimonial, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="p-6 rounded-2xl border border-white/[0.04]"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex text-neon-cyan mb-4 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <p className="text-slate-400 text-sm italic mb-4 leading-relaxed">"{testimonial.content}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
        <div className="w-8 h-8 rounded-full bg-neon-cyan flex items-center justify-center text-xs font-bold text-white">
          {testimonial.name[0]}
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{testimonial.name}</p>
          <p className="text-slate-500 text-xs">{testimonial.role}, {testimonial.institution}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
