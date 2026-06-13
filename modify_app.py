import re

app_file = r'd:\Portfolio\src\App.jsx'
with open(app_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace NAV_LINKS
content = content.replace(
    "const NAV_LINKS = [\n  { label: 'Projects', href: '#projects' },\n  { label: 'About', href: '#about' },\n  { label: 'Experience', href: '#experience' },\n  { label: 'Contact', href: '#contact' },\n]",
    "const NAV_LINKS = [\n  { label: 'Projects', href: '/#projects' },\n  { label: 'About', href: '/#about' },\n  { label: 'Experience', href: '/#experience' },\n  { label: 'Contact', href: '/#contact' },\n]"
)

# ProjectCard props
content = content.replace('function ProjectCard({ project, index, onOpen }) {', 'function ProjectCard({ project, index, onNavigate }) {')

# ProjectCard onClick events
content = content.replace('onClick={() => onOpen(project)}', 'onClick={() => onNavigate(`/project/${project.id}`)}')

# ProjectsSection
projects_section_pattern = re.compile(r'function ProjectsSection\(\{ projects \}\) \{.*?\n\}\n', re.DOTALL)
projects_section_replacement = '''function ProjectsSection({ projects, onNavigate }) {
  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Selected Work</span>
          <h2 className="section__title">Work I'm proud of</h2>
          <p className="section__subtitle">
            Here are some of the things I've built across mobile, web, and design.
          </p>
        </div>
        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  )
}
'''
content = projects_section_pattern.sub(projects_section_replacement, content)

# ProjectDetailPage definition
project_detail_page = '''/* ========================================
   PROJECT DETAIL PAGE
   ======================================== */
function ProjectDetailPage({ project, onBack }) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [project])

  if (!project) return <div className="container" style={{paddingTop: '150px', height: '100vh', textAlign: 'center'}}>Project not found.</div>

  const slides = []
  const images = Array.isArray(project.images) ? project.images : (project.image ? [project.image] : [])
  const videos = Array.isArray(project.videos) ? project.videos : (project.videoUrl ? [project.videoUrl] : [])
  images.forEach(url => url && slides.push({ type: 'image', url }))
  videos.forEach(url => url && slides.push({ type: 'video', url }))

  return (
    <div className="project-detail-page">
      <div className="container" style={{maxWidth: '1200px'}}>
        <button className="btn btn--outline project-detail__back" onClick={onBack} style={{marginBottom: '40px'}}>
          ← Back to Portfolio
        </button>

        <div className="project-detail__header">
          <div className="project-detail__meta">
            <span className="project-detail__category">{project.category}</span>
            <span className="project-detail__year">{project.year}</span>
          </div>
          <h1 className="project-detail__title">{project.title}</h1>
        </div>

        {slides.length > 0 && (
          <div className="project-detail__media-container">
            <div className="project-detail__media-slide">
              {slides[activeSlide].type === 'image' ? (
                <img src={slides[activeSlide].url} alt={project.title} className="project-detail__image" loading="lazy" />
              ) : (
                <video src={slides[activeSlide].url} controls autoPlay muted playsInline className="project-detail__video" />
              )}
            </div>
            {slides.length > 1 && (
              <div className="project-detail__dots">
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

        <div className="project-detail__body">
          <div className="project-detail__content">
            <h3>About this project</h3>
            <p className="project-detail__desc">{project.fullDescription || project.description}</p>
          </div>
          
          <div className="project-detail__sidebar">
            <div className="project-detail__sidebar-group">
              <h4>Tech Stack</h4>
              <div className="project-card__tech">
                {project.tech.map(t => (
                  <span key={t} className="project-card__tech-tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="project-detail__sidebar-group">
              <h4>Platforms</h4>
              <div className="project-card__platforms" style={{gap: '16px', fontSize: '24px'}}>
                {project.platforms.includes('android') && <PlayStoreIcon />}
                {project.platforms.includes('ios') && <AppStoreIcon />}
                {project.platforms.includes('web') && <WebIcon />}
                {project.platforms.includes('figma') && <FigmaIcon />}
              </div>
            </div>

            <div className="project-detail__sidebar-group project-detail__actions">
              {project.projectLink && (
                <a href={project.projectLink} target="_blank" rel="noreferrer" className="btn btn--primary btn--full">
                  <ExternalLinkIcon /> Live Project
                </a>
              )}
              {project.repoLink && (
                <a href={project.repoLink} target="_blank" rel="noreferrer" className="btn btn--outline btn--full">
                  <GithubIcon /> Source Code
                </a>
              )}
              {project.moreInfoLink && (
                <a href={project.moreInfoLink} target="_blank" rel="noreferrer" className="btn btn--outline btn--full">
                  <InfoIcon /> More Info
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================'''

content = content.replace('/* ========================================\n   ABOUT SECTION', project_detail_page + '\n   ABOUT SECTION')

# App component modifications
app_logic_find = "  if (currentPath === '/farhan-admin-secure') {"
app_logic_replace = """  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo(0, 0)
  }

  if (currentPath === '/farhan-admin-secure') {"""
content = content.replace(app_logic_find, app_logic_replace)

app_logic_route_find = """  return (
    <>
      <Navbar />
      <main>
        <HeroSection />"""
app_logic_route_replace = """  if (currentPath.startsWith('/project/')) {
    const projectId = currentPath.split('/')[2];
    const project = projectsList.find(p => p.id.toString() === projectId);
    return (
      <>
        <Navbar />
        <main>
          <ProjectDetailPage project={project} onBack={() => navigate('/')} />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />"""
content = content.replace(app_logic_route_find, app_logic_route_replace)

content = content.replace('<ProjectsSection projects={projectsList} />', '<ProjectsSection projects={projectsList} onNavigate={navigate} />')

with open(app_file, 'w', encoding='utf-8') as f:
    f.write(content)
