'use client';

// =========== Import
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../../../components/layout/HeaderProjects';
import styles from '../[[...slug]]/page.module.css';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryDrawer } from '../../../components/ui/CategoryDrawer';
import { Category, Project } from '@/app/projects/[[...slug]]/types';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailPanel } from './ProjectDetailPanel';
import { useTheme } from '@/context/ThemeContext';

// =========== Interface
interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// =========== Constant
export default function ProjectsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug ? resolvedParams.slug[0] : null;
  const router = useRouter();
  const { isSidebarOpen, theme, mounted } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false); // Pindahin ke sini
  const isDark = theme === 'dark';
  const containerClass = `${styles.mainBackground} ${mounted && isDark ? styles.darkModeActive : ''}`;
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { setIsSidebarOpen, setIsProjectDetailOpen } = useTheme();
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);

  const availableCategories = useMemo(() => {
    return [
      'all',
      ...new Set(
        projects.flatMap((p) => p.categories?.map((c: Category) => c.title) || [])
      ),
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchStatus =
        filter === 'all' || project.projectStatus === filter;

      const matchCategory =
        categoryFilter === 'all' ||
        project.categories?.some(
          (c) => c.title === categoryFilter || c.parent === categoryFilter
        );

      return matchStatus && matchCategory;
    });
  }, [projects, filter, categoryFilter]);

  const closePanel = () => {
    setSelectedProject(null);
    // setIsProjectDetailOpen(false); <- Ini bakal ke-trigger otomatis sama useEffect di atas karena slug jadi null
    window.history.pushState(null, '', '/projects');
  };

  const handleExplore = async (slug: string) => {
    setIsDetailLoading(true);
    try {
      const query = `*[_type == "portfolioItem" && slug.current == $slug][0] {
      ...,
      youtubeId,
      displayType,
      "imageUrl": coverImage.asset->url,
      "gallery": gallery[].asset->url,
      "categories": categories[]->{ title, "slug": slug.current },
      "posterImage": {
        "asset": posterImage.asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "alt": posterImage.alt
      }
    }`;

      const data: Project | null = await client.fetch(query, { slug });
      setSelectedProject(data);
      window.history.pushState(null, '', `/projects/${slug}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // =========== Effect
  useEffect(() => {
    if (slug) {
      handleExplore(slug);
    } else {
      setSelectedProject(null);
    }
  }, [slug]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "portfolioItem"] | order(publishedAt desc) {
          _id,
          title,
          projectStatus,
          "slug": slug.current,
          "imageUrl": coverImage.asset->url,
          "projectUrl": projectUrl,
          "categories": categories[]->{
            title,
            "slug": slug.current,
            "parent": parent->title
          }
        }`;

        const data: Project[] = await client.fetch(query);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (slug) {
      // Pas detail dibuka: Paksa sidebar OFF biar fokus ke konten (Immersive)
      setIsSidebarOpen(false);
      setIsProjectDetailOpen(true);
    } else {
      // Pas detail ditutup: Cukup matikan status detail
      // JANGAN panggil setIsSidebarOpen(true) di sini biar gak narik otomatis
      setIsProjectDetailOpen(false);
    }
  }, [slug, setIsSidebarOpen, setIsProjectDetailOpen]);

  return (
    <main className={containerClass}>
      {/* 1. HEADER FIX: Pindahin trigger hover-nya */}
      <div style={{ position: 'relative' }}>
        <Header />
        
        {/* Ini area trigger "siluman" tepat di atas tombol toggle (pojok kanan) */}
        <div 
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: '100px', // Sesuaikan lebar tombol toggle lo
            height: '90px',  // Sesuaikan tinggi header lo
            zIndex: 30,
            cursor: 'pointer'
          }}
        />

        <AnimatePresence>
          {showTooltip && mounted && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={styles.floatingTooltip}
            >
              {theme === 'dark' ? "Switch to Light Mode?" : "Switch to Dark Mode?"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.filterContainer}>
        {['all', 'completed', 'ongoing'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as 'all' | 'completed' | 'ongoing')}
            className={`${styles.filterTab} ${filter === status ? styles.activeTab : ''}`}
          >
            {status.toUpperCase()}
            {filter === status && (
              <motion.div
                layoutId="underline"
                className={styles.activeUnderline}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* 2. CATEGORY TOOLTIP: Pastikan drawerWrapper punya display yang bener */}
      <div 
        className={styles.drawerWrapper}
        onMouseEnter={() => setShowCategoryTooltip(true)}
        onMouseLeave={() => setShowCategoryTooltip(false)}
      >
        <CategoryDrawer
          categories={availableCategories}
          activeCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <AnimatePresence>
          {/* Cek isSidebarOpen: Tooltip cuma muncul kalo drawer LAGI TUTUP (false) */}
          {showCategoryTooltip && !isSidebarOpen && mounted && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={styles.categoryTooltip}
            >
              Search by category
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loader}>Loading…</div>
        ) : (
          <div className={styles.projectGrid}>
            <AnimatePresence>
              {filteredProjects.map((p, i) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  index={i}
                  isDetailLoading={isDetailLoading}
                  isSelected={selectedProject?.slug === p.slug}
                  onExplore={handleExplore}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProjectDetailPanel
        project={selectedProject}
        onClose={closePanel}
        onCategoryClick={(cat) => {
          setCategoryFilter(cat);
          closePanel();
        }}
      />

      <div className={styles.backButtonWrapper}>
        <button
          className={`${styles.backButton} ${mounted && isDark ? styles.darkModeButton : ''}`}
          onClick={() => router.push('/')}
        >
          ← Back
        </button>
      </div>
    </main>
  );
}
