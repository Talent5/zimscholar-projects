import React from 'react';
import { Loader2 } from 'lucide-react';

/* ─── Skeleton Primitives ──────────────────────────────────── */
const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden rounded-lg bg-slate-100 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Shimmer className="w-10 h-10 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Shimmer className="h-3.5 w-24" />
        <Shimmer className="h-3 w-16" />
      </div>
      <Shimmer className="h-8 w-20 rounded-full" />
    </div>
    <Shimmer className="h-3 w-full" />
    <Shimmer className="h-3 w-3/4" />
    <div className="flex gap-2 pt-2">
      <Shimmer className="h-8 w-20 rounded-lg" />
      <Shimmer className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

const SkeletonStatCard: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
    <div className="flex items-center gap-3">
      <Shimmer className="w-9 h-9 rounded-xl" />
      <Shimmer className="h-3 w-20" />
    </div>
    <Shimmer className="h-7 w-28" />
    <Shimmer className="h-3 w-16" />
  </div>
);

const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
    <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3.5 w-32" />
      <Shimmer className="h-3 w-48" />
    </div>
    <Shimmer className="h-6 w-20 rounded-full" />
  </div>
);

const SkeletonChart: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
    <div className="flex items-center justify-between mb-6">
      <Shimmer className="h-5 w-36" />
      <Shimmer className="h-4 w-16" />
    </div>
    <div className="flex items-end gap-2 h-48">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <Shimmer className="w-full rounded-t-md" style={{ height: `${20 + Math.random() * 60}%` }} />
          <Shimmer className="h-2.5 w-6" />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Layout Presets ───────────────────────────────────────── */
export type LoaderVariant = 'dashboard' | 'list' | 'grid' | 'analytics' | 'table' | 'simple';

interface PageLoaderProps {
  /** The visual skeleton layout to render */
  variant?: LoaderVariant;
  /** Short message below spinner (only for 'simple' variant) */
  message?: string;
  /** Page title shown in skeleton header */
  title?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ variant = 'simple', message, title }) => {
  /* ── Simple spinner ────── */
  if (variant === 'simple') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-[3px] border-slate-100" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-indigo-500 animate-spin" />
          </div>
          {message && <p className="text-sm text-slate-400 font-medium animate-pulse">{message}</p>}
        </div>
      </div>
    );
  }

  /* ── Dashboard skeleton ── */
  if (variant === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-4 w-32" />
          </div>
          <Shimmer className="h-9 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><SkeletonChart /></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Analytics skeleton ── */
  if (variant === 'analytics') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-44" />
            <Shimmer className="h-4 w-56" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-10 w-24 rounded-xl" />
            <Shimmer className="h-10 w-24 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><SkeletonChart /></div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
            <Shimmer className="h-5 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Shimmer className="h-3.5 w-24" />
                  <Shimmer className="h-3.5 w-16" />
                </div>
                <Shimmer className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── List skeleton ─────── */
  if (variant === 'list') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-4 w-36" />
          </div>
          <Shimmer className="h-10 w-24 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <Shimmer className="h-11 flex-1 rounded-xl" />
          <Shimmer className="h-11 w-36 rounded-xl" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  /* ── Grid skeleton ─────── */
  if (variant === 'grid') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-4 w-36" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-10 w-24 rounded-xl" />
            <Shimmer className="h-10 w-32 rounded-xl" />
          </div>
        </div>
        <Shimmer className="h-11 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <Shimmer className="h-40 w-full rounded-xl" />
              <Shimmer className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Shimmer className="h-6 w-16 rounded-md" />
                <Shimmer className="h-6 w-16 rounded-md" />
              </div>
              <Shimmer className="h-3 w-full" />
              <div className="flex gap-2 pt-1">
                <Shimmer className="h-8 w-16 rounded-lg" />
                <Shimmer className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Table skeleton ────── */
  if (variant === 'table') {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Shimmer className="h-7 w-44" />
            <Shimmer className="h-4 w-56" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-10 w-24 rounded-xl" />
            <Shimmer className="h-10 w-28 rounded-xl" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-100">
            {Array.from({ length: 5 }).map((_, i) => <Shimmer key={i} className="h-3.5 w-full" />)}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-50 last:border-0">
              {Array.from({ length: 5 }).map((_, j) => <Shimmer key={j} className="h-3 w-full" />)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default PageLoader;
export { Shimmer, SkeletonCard, SkeletonStatCard, SkeletonRow, SkeletonChart };
