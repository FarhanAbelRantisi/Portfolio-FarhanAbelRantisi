import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import './App.css'

/* ========================================
   SPLINE 3D (lazy-loaded ~500KB+)
   ======================================== */
const Spline = lazy(() => import('@splinetool/react-spline'))

function SplineScene({ scene, className, onLoad }) {
  return (
    <Suspense
      fallback={
        <div className="spline-loader">
          <div className="spline-loader__spinner" />
          <span className="spline-loader__text">Loading 3D Scene...</span>
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  )
}

/* ========================================
   ICONS (inline SVG components)
   ======================================== */
const ArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
)

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="20" y2="17" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const PlayStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.707l2.251 1.304a1 1 0 0 1 0 1.392l-2.251 1.304-2.559-2.557 2.559-2.443zM5.864 1.458L16.8 7.791l-2.302 2.302-8.634-8.635z" />
  </svg>
)

const AppStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
)

/* ========================================
   DATA
   ======================================== */
const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const PROJECTS = [
  {
    id: 1,
    title: 'Lungify',
    category: 'Mobile Apps',
    year: '2025',
    description: 'AI-Powered Respiratory Health Assistant',
    fullDescription: 'Lungify is an AI-powered healthcare chatbot developed for the Google APAC Solution Challenge. It helps users analyze respiratory symptoms, receive preliminary insights, and manage daily health with features like medication reminders and curated health articles.',
    image: '/projects/porto_lungify.png',
    tech: ['Flutter', 'Firebase', 'Google Gemini API'],
    color: '#6366F1',
    platforms: ['android', 'ios'],
    link: 'https://github.com/FarhanAbelRantisi/Lungify-App',
  },
  {
    id: 2,
    title: 'Nutrisight',
    category: 'Mobile Apps',
    year: '2025',
    description: 'AI-Powered Nutritional Information App',
    fullDescription: 'NutriSight is a mobile application developed as a final project for Google Developer Group on Campus (Mobile Development track). It provides a smart solution to help Indonesian consumers easily and accurately understand the nutritional content of packaged food products. The app utilizes OCR and AI-based Named Entity Recognition (NER) to extract nutrition information from product labels and present it as a simple health grade (A–D).',
    image: '/projects/porto_nutrisight.png',
    tech: ['Flutter', 'Firebase', 'Google Cloud Vision API', 'Express JS'],
    color: '#10B981',
    platforms: ['android', 'ios'],
    link: 'https://github.com/FarhanAbelRantisi/NutriSight-App',
  },
  {
    id: 3,
    title: 'Roemah Bimbel',
    category: 'Website',
    year: '2026',
    description: 'Smart food delivery app with AI-based recommendations and real-time order tracking.',
    fullDescription: 'FoodFlow optimizes the logistics of food delivery by calculating the most efficient routes for drivers while providing real-time updates to customers. The app features a highly interactive map interface using Google Maps SDK.',
    image: '/projects/porto_roemahbimbel.png',
    tech: ['TypeScript', 'React JS', 'Tailwind CSS', 'PostgreSQL'],
    color: '#F59E0B',
    platforms: ['Web'],
    link: 'https://roemahbimbel.com/',
  },
  {
    id: 4,
    title: 'StudyBuddy',
    category: 'Education',
    year: '2023',
    description: 'Collaborative learning platform with interactive study groups and flashcard creation.',
    fullDescription: 'Created as a tool for students to collaborate during exam seasons, this app features real-time chat, shared notes, and a built-in spaced repetition flashcard system to improve memory retention.',
    image: '',
    tech: ['Flutter', 'Supabase', 'Dart'],
    color: '#8B5CF6',
    platforms: ['android', 'ios'],
  },
]

const EXPERIENCES = [
  {
    role: 'Senior Mobile Developer',
    company: 'TechVenture Studio',
    period: '2024 — Present',
    description: 'Leading mobile development team, architecting cross-platform solutions with Flutter and React Native. Shipped 4+ apps with 100K+ downloads.',
  },
  {
    role: 'Mobile Developer',
    company: 'Digital Innovation Labs',
    period: '2022 — 2024',
    description: 'Built and maintained mobile applications for enterprise clients. Focused on performance optimization and clean architecture patterns.',
  },
  {
    role: 'Junior Mobile Developer',
    company: 'StartUp Hub',
    period: '2021 — 2022',
    description: 'Developed MVP mobile applications for early-stage startups. Collaborated closely with design and product teams.',
  },
]

const SKILLS = [
  'Flutter', 'React Native', 'Kotlin', 'Swift',
  'Dart', 'TypeScript', 'Firebase', 'REST API',
  'GraphQL', 'Git', 'CI/CD', 'Figma',
]

/* ========================================
   NAVBAR COMPONENT
   ======================================== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
        <div className="navbar__inner">
          <a href="#" className="navbar__logo">
            <span className="navbar__logo-icon">F</span>
            <span className="navbar__logo-text">farhan.</span>
          </a>

          <div className="navbar__links">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="navbar__link">
                {link.label}
              </a>
            ))}
          </div>

          <a href="#contact" className="navbar__cta">Let's Talk</a>

          <button
            className="navbar__menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            id="menu-open-btn"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`} id="mobile-menu">
        <div className="mobile-menu__header">
          <a href="#" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <span className="navbar__logo-icon">F</span>
            <span className="navbar__logo-text">farhan.</span>
          </a>
          <button
            className="navbar__menu-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            id="menu-close-btn"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mobile-menu__links">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => setMobileOpen(false)}
            >
              <span className="mobile-menu__link-num">0{i + 1}</span>
              {link.label}
            </a>
          ))}
        </div>
        <div className="mobile-menu__footer">
          <a href="mailto:farhan@example.com" className="mobile-menu__social">Email</a>
          <a href="#" className="mobile-menu__social">GitHub</a>
          <a href="#" className="mobile-menu__social">LinkedIn</a>
        </div>
      </div>
    </>
  )
}

/* ========================================
   HERO SECTION — Full-screen Spline 3D
   ======================================== */
function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const animFrameRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => {
      clearTimeout(t)
      // Clean up the animation loop when component unmounts
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  const handleSplineLoad = (app) => {
    setSplineLoaded(true)

    // Debug: log all scene object names as readable text
    try {
      const objects = app.getAllObjects()
      const names = objects.map(o => o.name).join(', ')
      console.log('[Spline] Found', objects.length, 'objects:', names)
    } catch (e) { }

    // Find key objects
    const body = app.findObjectByName('Body')
    const cursorTarget = app.findObjectByName('Cursor Target')
    const robot = app.findObjectByName('Robot')
    // Find ALL head parts (Helmet, Eyes, ears, shield) so they move together
    const allObjects = app.getAllObjects()
    const headPartNames = ['Helmet', 'Head', 'head', 'Eyes', 'ear', 'Shield']
    const headParts = allObjects.filter(o => headPartNames.includes(o.name))

    // Find Collar parts separately so we can bridge them
    const collars = allObjects.filter(o => o.name === 'Collar')

    // Cari Emote (Message) agar kita bisa buat efek "trailing" (tertinggal) di JS
    const emotes = allObjects.filter(o => o.name.includes('Message'))

    console.log('[Spline] Body:', !!body, '| Robot:', !!robot, '| Head Parts:', headParts.length, '| Emotes:', emotes.length)

    // Unified animation loop: controls robot movement, head lead, + body rolling
    if (robot && cursorTarget) {
      let smoothCursorX = 0   // smoothed cursor target (removes jitter)
      let smoothX = 0         // smoothed robot position (slow follow)
      let currentRotation = 0

      // Store original X positions for head parts
      const headOrigX = headParts.map(part => part.position.x)

      // Store original X positions and Z rotations for collars
      const collarOrigX = collars.map(c => c.position.x)
      const collarOrigRotZ = collars.map(c => c.rotation.z)

      // Simpan jarak awal emote terhadap robot, agar mereka menjaga formasinya
      const emoteOffsetsX = emotes.map(e => e.position.x - robot.position.x)

      const update = () => {
        try {
          // Double-smoothing to eliminate jitter on fast cursor moves:
          // Step 1: Smooth the raw cursor target position first
          smoothCursorX += (cursorTarget.position.x - smoothCursorX) * 0.08

          // Step 2: Slowly follow the smoothed cursor position
          const targetX = smoothCursorX * 0.6
          smoothX += (targetX - smoothX) * 0.04
          robot.position.x = smoothX

          // Head leads the body, but with a much smaller multiplier
          // so it only shifts slightly and doesn't tear off the neck
          let rawLeadOffset = (targetX - smoothX) * 0.07

          // Clamp the offset strictly (max 8 units)
          const MAX_STRETCH = 12
          const leadOffset = Math.max(-MAX_STRETCH, Math.min(MAX_STRETCH, rawLeadOffset))

          headParts.forEach((part, i) => {
            part.position.x = headOrigX[i] + leadOffset
          })

          // Collar bridges the gap by moving exactly halfway
          collars.forEach((collar, i) => {
            collar.position.x = collarOrigX[i] + (leadOffset * 1)
            // Kurangi rotasi (tilt) drastis agar sudut tabung leher tidak menusuk mesh kepala
            collar.rotation.z = collarOrigRotZ[i] - (leadOffset * 0.01)
          })

          // Emotes "tertinggal" (trailing) di belakang robot untuk efek organik
          emotes.forEach((emote, i) => {
            const targetEmoteX = smoothX + emoteOffsetsX[i]
            // Angka 0.02 membuat pergerakan emote menjadi sangat lambat (karet/lagging)
            emote.position.x += (targetEmoteX - emote.position.x) * 0.02
          })

          // Body rolling: rotate proportional to smoothed position
          if (body) {
            const targetRotation = -smoothX / 150
            currentRotation += (targetRotation - currentRotation) * 0.08
            body.rotation.z = currentRotation
          }
        } catch (e) { }
        animFrameRef.current = requestAnimationFrame(update)
      }
      update()
      console.log('[Spline] ✅ Robot movement + head lead + body rotation active')
    } else if (body) {
      // Fallback: at least handle body rotation with mouse
      let mouseX = window.innerWidth / 2
      const onMouseMove = (e) => { mouseX = e.clientX }
      window.addEventListener('mousemove', onMouseMove)

      let currentRotation = 0
      const update = () => {
        try {
          const offset = (mouseX - window.innerWidth / 2) / window.innerWidth
          const targetRotation = -offset * 2
          currentRotation += (targetRotation - currentRotation) * 0.08
          body.rotation.z = currentRotation
        } catch (e) { }
        animFrameRef.current = requestAnimationFrame(update)
      }
      update()
      console.log('[Spline] ✅ Body rotation active (mouse fallback)')
    } else {
      console.warn('[Spline] ❌ Required objects not found.')
    }
  }

  return (
    <section className="hero" id="hero">
      {/* Full-screen 3D background */}
      <div className="hero__spline-bg" id="spline-container">
        <SplineScene
          scene="https://prod.spline.design/WAeofjQyEIkU-qty/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>

      {/* Text overlay on top of the 3D scene */}
      <div className="hero__overlay">
        <div className={`hero__text ${mounted ? 'hero__text--visible' : ''}`}>
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Available for new projects
          </div>
          {/* visibility: hidden menyembunyikan teks. height & margin-bottom membatasi besarnya space */}
          <h1 className="hero__title" style={{ visibility: 'hidden', height: '300px', marginBottom: '10px', overflow: 'hidden' }}>
            I'm <em className="hero__name">Farhan</em>,{' '}
            <span className="hero__title-rest">
              a mobile developer crafting digital experiences
            </span>
          </h1>
          <div className="hero__content-bottom">
            <div className="hero__left-block">
              <div className="hero__stats" style={{ visibility: 'hidden' }}>
                <div className="hero__stat">
                  <span className="hero__stat-number">4+</span>
                  <span className="hero__stat-label">Years Experience</span>
                </div>
                <div className="hero__stat-divider"></div>
                <div className="hero__stat">
                  <span className="hero__stat-number">20+</span>
                  <span className="hero__stat-label">Apps Delivered</span>
                </div>
                <div className="hero__stat-divider"></div>
                <div className="hero__stat">
                  <span className="hero__stat-number">100K+</span>
                  <span className="hero__stat-label">Downloads</span>
                </div>
              </div>
              <p className="hero__subtitle">
                Specializing in building premium mobile applications
                with Flutter, React Native, and native technologies
                that users love.
              </p>

              <div className="hero__actions">
                <a href="#projects" className="btn btn--primary" id="hero-cta-projects">
                  View Projects
                  <ArrowUpRight />
                </a>
                <a href="#contact" className="btn btn--outline" id="hero-cta-contact">
                  Get in Touch
                </a>
              </div>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">4+</span>
                <span className="hero__stat-label">Years Experience</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">20+</span>
                <span className="hero__stat-label">Apps Delivered</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">100K+</span>
                <span className="hero__stat-label">Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   PROJECTS SECTION
   ======================================== */
function ProjectCard({ project, index, onOpen }) {
  const cardRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`project-card ${isVisible ? 'project-card--visible' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
      id={`project-${project.id}`}
    >
      <div className="project-card__visual" style={{ background: `${project.color}12`, cursor: 'pointer' }} onClick={() => onOpen(project)}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="project-card__image" />
        ) : (
          /* Placeholder jika tidak ada gambar */
          <div className="project-card__phone" style={{ borderColor: `${project.color}30` }}>
            <div className="project-card__phone-notch" style={{ background: project.color + '20' }}></div>
            <div className="project-card__phone-content">
              <div className="project-card__phone-line" style={{ background: project.color + '25', width: '40%' }}></div>
              <div className="project-card__phone-line" style={{ background: project.color + '15', width: '80%' }}></div>
              <div className="project-card__phone-line" style={{ background: project.color + '15', width: '65%' }}></div>
              <div className="project-card__phone-block" style={{ background: project.color + '12' }}></div>
              <div className="project-card__phone-block" style={{ background: project.color + '08', height: '24px' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="project-card__info">
        <div className="project-card__meta">
          <span className="project-card__category">{project.category}</span>
          <span className="project-card__year">{project.year}</span>
        </div>
        <h3 className="project-card__title" style={{ cursor: 'pointer' }} onClick={() => onOpen(project)}>{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tech">
          {project.tech.map(t => (
            <span key={t} className="project-card__tech-tag">{t}</span>
          ))}
        </div>
        <div className="project-card__footer">
          <div className="project-card__platforms">
            {project.platforms.includes('android') && <PlayStoreIcon />}
            {project.platforms.includes('ios') && <AppStoreIcon />}
          </div>
          <button onClick={() => onOpen(project)} className="project-card__link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'var(--color-accent)', padding: 0 }}>
            View Case Study <ArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Selected Work</span>
          <h2 className="section__title">Projects I've crafted</h2>
          <p className="section__subtitle">
            A selection of mobile applications I've designed and developed,
            each solving real-world problems with clean, performant code.
          </p>
        </div>
        <div className="projects__grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={setSelectedProject} />
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="project-modal__content" onClick={e => e.stopPropagation()}>
            <button className="project-modal__close" onClick={() => setSelectedProject(null)}>
              <CloseIcon />
            </button>
            {selectedProject.image && (
              <div className="project-modal__image-wrapper">
                <img src={selectedProject.image} alt={selectedProject.title} className="project-modal__image" />
              </div>
            )}
            <div className="project-modal__body">
              <span className="project-modal__category">{selectedProject.category} • {selectedProject.year}</span>
              <h2 className="project-modal__title">{selectedProject.title}</h2>
              <div className="project-modal__tech">
                {selectedProject.tech.map(t => (
                  <span key={t} className="project-card__tech-tag">{t}</span>
                ))}
              </div>
              <p className="project-modal__desc">{selectedProject.fullDescription || selectedProject.description}</p>

              {selectedProject.link && (
                <a href={selectedProject.link} target="_blank" rel="noreferrer" className="btn btn--primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
                  View Live / Repo <ArrowUpRight />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ========================================
   ABOUT SECTION
   ======================================== */
function AboutSection() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__layout">
          <div className="about__left">
            <span className="section__label">About Me</span>
            <h2 className="section__title">
              Turning ideas into<br />
              <em>mobile reality</em>
            </h2>
          </div>
          <div className="about__right">
            <p className="about__text">
              Hi, I'm <strong>Farhan Abel Rantisi</strong> — a mobile developer with a passion
              for creating beautiful, functional applications. I specialize in
              cross-platform development using Flutter and React Native, as well as
              native Android (Kotlin) and iOS (Swift) development.
            </p>
            <p className="about__text">
              I believe great mobile apps are born from the intersection of
              thoughtful design and solid engineering. Every project I take on
              is an opportunity to push the boundaries of what's possible on mobile.
            </p>
            <p className="about__text">
              When I'm not coding, you'll find me exploring new technologies,
              contributing to open-source projects, or sharing knowledge with the
              developer community.
            </p>
            <div className="about__skills">
              <h3 className="about__skills-title">Tech Stack</h3>
              <div className="about__skills-grid">
                {SKILLS.map(skill => (
                  <span key={skill} className="about__skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   EXPERIENCE SECTION
   ======================================== */
function ExperienceSection() {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Experience</span>
          <h2 className="section__title">Where I've worked</h2>
          <p className="section__subtitle">
            My professional journey building mobile products across
            different industries and company stages.
          </p>
        </div>
        <div className="experience__list">
          {EXPERIENCES.map((exp, i) => (
            <div key={i} className="experience__item" id={`experience-${i}`}>
              <div className="experience__item-left">
                <span className="experience__period">{exp.period}</span>
              </div>
              <div className="experience__item-right">
                <h3 className="experience__role">{exp.role}</h3>
                <span className="experience__company">{exp.company}</span>
                <p className="experience__desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================================
   CONTACT SECTION
   ======================================== */
function ContactSection() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__left">
            <span className="section__label">Get in Touch</span>
            <h2 className="contact__title">
              Want to create<br />something <em>awesome</em>?
            </h2>
            <p className="contact__subtitle">
              I'm always open to discussing new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>
            <div className="contact__links">
              <a href="mailto:farhan@example.com" className="contact__link" id="contact-email">
                <EmailIcon />
                <span>farhan@example.com</span>
              </a>
              <a href="tel:+62812345678" className="contact__link" id="contact-phone">
                <PhoneIcon />
                <span>+62 812 345 678</span>
              </a>
            </div>
            <div className="contact__socials">
              <a href="#" className="contact__social" aria-label="GitHub" id="contact-github">
                <GithubIcon />
              </a>
              <a href="#" className="contact__social" aria-label="LinkedIn" id="contact-linkedin">
                <LinkedInIcon />
              </a>
            </div>
          </div>
          <div className="contact__right">
            <form className="contact__form" id="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="contact__form-group">
                <label className="contact__form-label" htmlFor="contact-name">Name</label>
                <input type="text" id="contact-name" className="contact__form-input" placeholder="Your name" />
              </div>
              <div className="contact__form-group">
                <label className="contact__form-label" htmlFor="contact-email-input">Email</label>
                <input type="email" id="contact-email-input" className="contact__form-input" placeholder="your@email.com" />
              </div>
              <div className="contact__form-group">
                <label className="contact__form-label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="contact__form-input contact__form-textarea" placeholder="Tell me about your project..." rows="5"></textarea>
              </div>
              <button type="submit" className="btn btn--primary btn--full" id="contact-submit">
                Send Message
                <ArrowUpRight />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================
   FOOTER
   ======================================== */
function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__left">
            <a href="#" className="navbar__logo">
              <span className="navbar__logo-icon">F</span>
              <span className="navbar__logo-text">farhan.</span>
            </a>
            <p className="footer__copy">&copy; {new Date().getFullYear()} Farhan Abel Rantisi. All rights reserved.</p>
          </div>
          <div className="footer__right">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="footer__link">{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ========================================
   APP
   ======================================== */
function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

export default App
