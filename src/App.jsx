import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import './App.css'
import { supabase } from './supabaseClient'
import AdminPage from './AdminPage'

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

function FadeInSection({ children, className = "" }) {
  const domRef = useRef(null)
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.02 })

    const current = domRef.current
    if (current) observer.observe(current)
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <div
      ref={domRef}
      className={`${className} fade-in-section ${isVisible ? 'is-visible' : ''}`}
    >
      {children}
    </div>
  )
}

// SVGs for Tech Stack
const FlutterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.314 0L2.3 12l3.7 3.7L21.684 0h-7.37zm0 24h7.37l-7.37-7.4-3.7 3.7 3.7 3.7zm-3.7-15.69l3.7-3.7 7.37 7.4h-7.37l-3.7-3.7z" />
  </svg>
)

const ReactIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

const KotlinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 24H0V0h24L12 12z" />
  </svg>
)

const SwiftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 13.8c-2.4 1.5-5.3 2.1-8.1 1.7-2.6-.4-5-1.7-6.8-3.5 0 0 6.1 1.1 9-.3 1.5-.7 2.8-1.8 3.7-3.2 0 0-3.3.4-5.3-.2-2.3-.7-4.2-2.3-5.2-4.5 0 0 1 3.4 0 5.4C8 11.8 6.2 13.3 4 14.2c2.8.3 5.7-.3 8.1-1.7 1.2-.7 2.2-1.7 2.9-2.9 0 0-.2 2 .5 3.5 1.1 2.3 3.4 4 6.5 4.7z" />
  </svg>
)

const DartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 1.5L1.5 12.5l3.5 3.5 3.5-3.5H12v3.5l-3.5 3.5 3.5 3.5L22.5 12.5 12.5 1.5z" />
  </svg>
)

const TypeScriptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0h24v24H0V0zm11.5 16.7h-2.1v-5.2H7.2V9.8h6.5v1.7h-2.2v5.2zm8.3-2.1c0 1.5-.8 2.2-2.3 2.2-1.2 0-2-.5-2.2-1.4h2c.1.4.5.6.9.6.5 0 .7-.2.7-.6 0-.9-2.3-.6-2.3-2.4 0-1.2.9-2.1 2.2-2.1 1.2 0 1.9.5 2.1 1.3h-1.9c-.1-.3-.4-.5-.8-.5-.4 0-.6.2-.6.5 0 1 2.3.7 2.3 2.4z" />
  </svg>
)

const FirebaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.89 15.75L9.3 3.03c.14-.33.6-.33.74 0l2.06 4.82 1.48-2.82c.15-.28.56-.27.69.02l2.46 7.41-12.73 3.29zM19.98 16.2L16.8 6.55c-.14-.42-.76-.39-.85.05L12.43 18.2l7.55-2z" />
  </svg>
)

const ApiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)

const GraphQLIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12,2 22,7.5 22,18.5 12,24 2,18.5 2,7.5" />
    <line x1="12" y1="2" x2="12" y2="24" />
    <line x1="2" y1="7.5" x2="22" y2="18.5" />
    <line x1="2" y1="18.5" x2="22" y2="7.5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)

const GitIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="18" x2="18" y2="18.01" />
    <line x1="6" y1="6" x2="6" y2="6.01" />
    <line x1="6" y1="18" x2="6" y2="18.01" />
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 15V9a4 4 0 0 0-4-4H9" />
  </svg>
)

const CicdIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const FigmaIconSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zm0 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0zm-7 0A3.5 3.5 0 0 1 8.5 11H12v3.5a3.5 3.5 0 1 1-7 0zM5 12a3.5 3.5 0 0 1 3.5-3.5H12V16H8.5A3.5 3.5 0 0 1 5 12.5V12z" />
  </svg>
)

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

const WebIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const FigmaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
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
  // {
  //   id: 1,
  //   title: 'Lungify',
  //   category: 'Mobile Apps',
  //   year: '2025',
  //   description: 'AI-Powered Respiratory Health Assistant',
  //   fullDescription: 'Lungify is an AI-powered healthcare chatbot developed for the Google APAC Solution Challenge. It helps users analyze respiratory symptoms, receive preliminary insights, and manage daily health with features like medication reminders and curated health articles.',
  //   image: '/projects/porto_lungify.png',
  //   tech: ['Flutter', 'Firebase', 'Google Gemini API'],
  //   color: '#6366F1',
  //   platforms: ['android', 'ios'],
  //   repoLink: 'https://github.com/FarhanAbelRantisi/Lungify-App',
  // },
  // {
  //   id: 2,
  //   title: 'Nutrisight',
  //   category: 'Mobile Apps',
  //   year: '2025',
  //   description: 'AI-Powered Nutritional Information App',
  //   fullDescription: 'NutriSight is a mobile application developed as a final project for Google Developer Group on Campus (Mobile Development track). It provides a smart solution to help Indonesian consumers easily and accurately understand the nutritional content of packaged food products. The app utilizes OCR and AI-based Named Entity Recognition (NER) to extract nutrition information from product labels and present it as a simple health grade (A–D).',
  //   image: '/projects/porto_nutrisight.png',
  //   tech: ['Flutter', 'Firebase', 'Google Cloud Vision API', 'Express JS', 'FastAPI'],
  //   color: '#10B981',
  //   platforms: ['android', 'ios'],
  //   repoLink: 'https://github.com/FarhanAbelRantisi/NutriSight-App',
  // },
  // {
  //   id: 3,
  //   title: 'Roemah Bimbel',
  //   category: 'Website',
  //   year: '2026',
  //   description: 'Website examination platform to facilitate SKD, Psychological, and Academic tests.',
  //   fullDescription: 'Roemah Bimbel is a website platform designed to facilitate SKD, psychological, and academic tests for prospective students.',
  //   image: '/projects/porto_roemahbimbel.png',
  //   tech: ['TypeScript', 'React JS', 'Tailwind CSS', 'PostgreSQL', 'Node JS'],
  //   color: '#F59E0B',
  //   platforms: ['web'],
  //   projectLink: 'https://roemahbimbel.com/',
  // },
  // {
  //   id: 4,
  //   title: 'Bisatopup',
  //   category: 'Mobile Apps',
  //   year: '2024',
  //   description: 'Payment Point Online Banking (PPOB) Platform',
  //   fullDescription: 'BisaTopup is a mobile application designed as part of the final company project at Amanah Karya Corp. on Bangkit Academy Batch 2 2024. It provides a user-friendly Payment Point Online Banking (PPOB) platform, enabling users to manage utility payments and mobile credit with ease.',
  //   image: '/projects/porto_bisatopup.png',
  //   tech: ['Kotlin', 'Jetpack Compose'],
  //   color: '#F59E0B',
  //   platforms: ['android'],
  //   projectLink: 'https://play.google.com/store/apps/details?id=com.rbtaskforce.bisatopup',
  // },
  // {
  //   id: 5,
  //   title: 'Trash Cash',
  //   category: 'UI/UX Design',
  //   year: '2025',
  //   description: 'Waste Management Application Concept',
  //   fullDescription: 'TrashCash is a mobile application concept designed to digitize and simplify waste management through an integrated waste bank system. The app encourages sustainable behavior by enabling users to deposit recyclable waste, track its value, and access educational content about environmental impact and waste processing.',
  //   image: '/projects/porto_trashcash.png',
  //   tech: ['Figma'],
  //   color: '#8B5CF6',
  //   platforms: ['figma'],
  //   moreInfoLink: 'https://www.behance.net/gallery/206840533/Trashcash-Team-Aruna',
  // },
  // {
  //   id: 6,
  //   title: 'Tourbriz',
  //   category: 'UI/UX Design',
  //   year: '2025',
  //   description: 'Travel and Tour Website Concept',
  //   fullDescription: 'Tourbriz is a travel and tour website platform concept designed to digitize and simplify travel planning.',
  //   image: '/projects/porto_tourbriz.png',
  //   tech: ['Figma'],
  //   color: '#EC4899',
  //   platforms: ['figma'],
  //   moreInfoLink: 'https://dribbble.com/shots/24653807-Tour-and-Travel-Website-Tourbriz?utm_source=Clipboard_Shot&utm_campaign=Farhanabel09&utm_content=Tour%20and%20Travel%20Website%20-%20Tourbriz&utm_medium=Social_Share',
  // },
]

const EXPERIENCES = [
  {
    role: 'Mobile Developer',
    company: 'Aracorp Digital Ecosystem',
    period: 'Aug 2025 - Present',
    description: 'Developed Trustify, a Flutter-based mobile application for detecting and identifying spam, scam, and potentially harmful phone calls and SMS messages.',
  },
  {
    role: 'Software Developer & UI/UX Design Freelancer',
    company: 'Independent',
    period: 'Apr 2025 — Present',
    description: 'Leading mobile development team, architecting cross-platform solutions with Flutter and React Native. Shipped 4+ apps with 100K+ downloads.',
  },
  {
    role: 'Mobile Development Team Member',
    company: 'Google Developer Group on Campus',
    period: 'Jan 2025 - Nov 2025',
    description: 'Contributed to the development of several project-based applications as part of team initiatives and programs.',
  },
  {
    role: 'IT Support',
    company: 'Telkomsel',
    period: 'Jun 2025 - Aug 2025',
    description: 'Assisted operational issue resolution across Telkomsel regional branches in South Sumatra.',
  },
  {
    role: 'Mobile Developer',
    company: 'Amanah Karya Corp.',
    period: 'Oct 2024 - Dec 2024',
    description: 'Developed a Payment Point Online Banking (PPOB) application using Kotlin, Jetpack Compose, and Clean Architecture.',
  },
  {
    role: 'UI/UX Designer',
    company: 'Telkom Indonesia',
    period: 'Jun 2023 - Aug 2023',
    description: 'Designed UI/UX for a dashboard website to monitor intern performance in the FBB, MBB, and Access Operation units.',
  },
]

const SKILLS = [
  { name: 'Flutter', color: '#02569B', icon: <FlutterIcon /> },
  { name: 'React Native', color: '#61DAFB', icon: <ReactIcon /> },
  { name: 'Kotlin', color: '#7F52FF', icon: <KotlinIcon /> },
  { name: 'Swift', color: '#FA5108', icon: <SwiftIcon /> },
  { name: 'Dart', color: '#0175C2', icon: <DartIcon /> },
  { name: 'TypeScript', color: '#3178C6', icon: <TypeScriptIcon /> },
  { name: 'Firebase', color: '#FFCA28', icon: <FirebaseIcon /> },
  { name: 'REST API', color: '#009688', icon: <ApiIcon /> },
  { name: 'GraphQL', color: '#E10098', icon: <GraphQLIcon /> },
  { name: 'Git', color: '#F05032', icon: <GitIconSmall /> },
  { name: 'CI/CD', color: '#2088FF', icon: <CicdIcon /> },
  { name: 'Figma', color: '#F24E1E', icon: <FigmaIconSmall /> },
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
          <a href="mailto:farhanrantisi55@gmail.com" className="mobile-menu__social">Email</a>
          <a href="https://github.com/FarhanAbelRantisi" className="mobile-menu__social">GitHub</a>
          <a href="https://www.linkedin.com/in/farhanabelrantisi/" className="mobile-menu__social">LinkedIn</a>
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
  const spotlightRef = useRef(null)
  const animFrameRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  // 3D Tilt + Spotlight tracking
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -6 // max 6deg
      const rotateY = ((x - centerX) / centerX) * 6

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`

      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '1'
        spotlightRef.current.style.background = `radial-gradient(
          600px circle at ${x}px ${y}px,
          ${project.color}18,
          transparent 40%
        )`
      }
    })
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    card.style.transform = ''
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = '0'
    }
  }

  return (
    <div
      ref={cardRef}
      className={`project-card ${isVisible ? 'project-card--visible' : ''}`}
      style={{ animationDelay: `${index * 120}ms` }}
      id={`project-${project.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay */}
      <div ref={spotlightRef} className="project-card__spotlight" />

      {/* Accent border glow on hover */}
      <div className="project-card__glow" style={{ '--card-accent': project.color }} />

      <div className="project-card__visual" style={{ background: `${project.color}12`, cursor: 'pointer' }} onClick={() => onOpen(project)}>
        {(project.images?.[0] || project.image) ? (
          <img src={project.images?.[0] || project.image} alt={project.title} className="project-card__image" />
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
            {project.platforms.includes('web') && <WebIcon />}
            {project.platforms.includes('figma') && <FigmaIcon />}
          </div>
          <div className="project-card__links">
            {project.projectLink && (
              <a href={project.projectLink} target="_blank" rel="noreferrer" className="project-card__link" title="Live Project">
                <ExternalLinkIcon /> Live
              </a>
            )}
            {project.repoLink && (
              <a href={project.repoLink} target="_blank" rel="noreferrer" className="project-card__link" title="Source Code">
                <GithubIcon /> Repo
              </a>
            )}
            {project.moreInfoLink && (
              <a href={project.moreInfoLink} target="_blank" rel="noreferrer" className="project-card__link" title="More Info">
                <InfoIcon /> Info
              </a>
            )}
            <button onClick={() => onOpen(project)} className="project-card__link project-card__link--detail">
              Detail <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectsSection({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    setActiveSlide(0)
  }, [selectedProject])

  // Prepare slides list from arrays
  const slides = []
  if (selectedProject) {
    const images = Array.isArray(selectedProject.images) ? selectedProject.images : (selectedProject.image ? [selectedProject.image] : [])
    const videos = Array.isArray(selectedProject.videos) ? selectedProject.videos : (selectedProject.videoUrl ? [selectedProject.videoUrl] : [])
    images.forEach(url => url && slides.push({ type: 'image', url }))
    videos.forEach(url => url && slides.push({ type: 'video', url }))
  }

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Selected Work</span>
          <h2 className="section__title">Projects I've crafted</h2>
          <p className="section__subtitle">
            A curated selection of projects spanning mobile apps, web platforms,
            and UI/UX designs — each crafted with precision and purpose.
          </p>
        </div>
        <div className="projects__grid">
          {projects.map((project, i) => (
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
            {slides.length > 0 && (
              <div className="project-modal__media-container">
                <div className="project-modal__media-slide">
                  {slides[activeSlide].type === 'image' ? (
                    <img src={slides[activeSlide].url} alt={selectedProject.title} className="project-modal__image" />
                  ) : (
                    <video src={slides[activeSlide].url} controls autoPlay muted playsInline className="project-modal__video" />
                  )}
                </div>
                {slides.length > 1 && (
                  <div className="project-modal__dots">
                    {slides.map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`project-modal__dot ${activeSlide === idx ? 'is-active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="project-modal__body">
              <div className="project-modal__meta-row">
                <span className="project-modal__category">{selectedProject.category} • {selectedProject.year}</span>
                <div className="project-modal__platforms">
                  {selectedProject.platforms.includes('android') && <PlayStoreIcon />}
                  {selectedProject.platforms.includes('ios') && <AppStoreIcon />}
                  {selectedProject.platforms.includes('web') && <WebIcon />}
                  {selectedProject.platforms.includes('figma') && <FigmaIcon />}
                </div>
              </div>
              <h2 className="project-modal__title">{selectedProject.title}</h2>
              <div className="project-modal__tech">
                {selectedProject.tech.map(t => (
                  <span key={t} className="project-card__tech-tag">{t}</span>
                ))}
              </div>
              <p className="project-modal__desc">{selectedProject.fullDescription || selectedProject.description}</p>

              <div className="project-modal__actions">
                {selectedProject.projectLink && (
                  <a href={selectedProject.projectLink} target="_blank" rel="noreferrer" className="btn btn--primary">
                    <ExternalLinkIcon /> Live Project
                  </a>
                )}
                {selectedProject.repoLink && (
                  <a href={selectedProject.repoLink} target="_blank" rel="noreferrer" className="btn btn--outline">
                    <GithubIcon /> Source Code
                  </a>
                )}
                {selectedProject.moreInfoLink && (
                  <a href={selectedProject.moreInfoLink} target="_blank" rel="noreferrer" className="btn btn--outline">
                    <InfoIcon /> More Info
                  </a>
                )}
              </div>
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
      <FadeInSection className="container">
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
                  <span
                    key={skill.name}
                    className="about__skill-tag"
                    style={{ '--skill-color': skill.color }}
                  >
                    {skill.icon}
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  )
}

/* ========================================
   EXPERIENCE SECTION
   ======================================== */
function ExperienceSection({ experiences }) {
  return (
    <section className="section experience" id="experience">
      <FadeInSection className="container">
        <div className="section__header">
          <span className="section__label">Experience</span>
          <h2 className="section__title">Where I've worked</h2>
          <p className="section__subtitle">
            My professional journey building mobile products across
            different industries and company stages.
          </p>
        </div>
        <div className="experience__list">
          {experiences.map((exp, i) => (
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
      </FadeInSection>
    </section>
  )
}

/* ========================================
   CONTACT SECTION
   ======================================== */
function ContactSection() {
  return (
    <section className="section contact" id="contact">
      <FadeInSection className="container">
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
              <a href="mailto:farhanrantisi55@gmail.com" className="contact__link" id="contact-email">
                <EmailIcon />
                <span>farhanrantisi55@gmail.com</span>
              </a>
              <a href="tel:+6288269639683" className="contact__link" id="contact-phone">
                <PhoneIcon />
                <span>+62 882 6963 9683</span>
              </a>
            </div>
            <div className="contact__socials">
              <a href="https://github.com/FarhanAbelRantisi" className="contact__social" aria-label="GitHub" id="contact-github">
                <GithubIcon />
              </a>
              <a href="https://www.linkedin.com/in/farhanabelrantisi/" className="contact__social" aria-label="LinkedIn" id="contact-linkedin">
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
      </FadeInSection>
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
  const [projectsList, setProjectsList] = useState(PROJECTS)
  const [experiencesList, setExperiencesList] = useState(EXPERIENCES)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    // Client-side router popstate tracking
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)

    // Fetch live entries from Supabase if connected
    const fetchDbData = async () => {
      if (!supabase) return
      try {
        const { data: dbProj, error: projErr } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true })

        if (!projErr && dbProj && dbProj.length > 0) {
          const mappedProj = dbProj.map(p => ({
            ...p,
            fullDescription: p.full_description || p.description,
            repoLink: p.repo_link,
            projectLink: p.project_link,
            moreInfoLink: p.more_info_link,
            images: p.images || (p.image ? [p.image] : []),
            videos: p.videos || (p.video_url ? [p.video_url] : [])
          }))
          setProjectsList(mappedProj)
        }

        const { data: dbExp, error: expErr } = await supabase
          .from('experiences')
          .select('*')
          .order('id', { ascending: true })

        if (!expErr && dbExp && dbExp.length > 0) {
          setExperiencesList(dbExp)
        }
      } catch (e) {
        console.error('Failed to load DB content, using local fallback:', e)
      }
    }

    fetchDbData()
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (currentPath === '/farhan-admin-secure') {
    return (
      <AdminPage
        hardcodedProjects={PROJECTS}
        hardcodedExperiences={EXPERIENCES}
      />
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection projects={projectsList} />
        <AboutSection />
        <ExperienceSection experiences={experiencesList} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

export default App
