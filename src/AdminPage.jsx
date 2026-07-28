import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import imageCompression from 'browser-image-compression'
import './Admin.css'

export default function AdminPage({ hardcodedProjects = [], hardcodedExperiences = [] }) {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // Tab State: 'projects' | 'experiences'
  const [activeTab, setActiveTab] = useState('projects')

  // Data State
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  // Modal / Form States
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Mobile Apps',
    year: '',
    description: '',
    full_description: '',
    role: '',
    contribution: '',
    images: [],
    videos: [],
    tech: '',
    color: '#6366F1',
    platforms: [],
    repo_link: '',
    project_link: '',
    more_info_link: ''
  })

  const [showExpModal, setShowExpModal] = useState(false)
  const [currentExp, setCurrentExp] = useState(null)
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    period: '',
    description: ''
  })

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [uploadingImage, setUploadingImage] = useState(false)

  // Handle image upload to Supabase storage (appends to images array)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !supabase) return

    setUploadingImage(true)
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)

      const fileExt = compressedFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        if (error.message.includes('bucket') || error.message.includes('does not exist')) {
          throw new Error("Storage bucket 'project-images' not found. Please create a public bucket named 'project-images' in Supabase first!")
        }
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      setProjectForm(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
      showStatus('Image uploaded successfully!')
    } catch (error) {
      showStatus(error.message, 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const moveImage = (idx, dir) => {
    setProjectForm(prev => {
      const arr = [...prev.images]
      if (idx + dir >= 0 && idx + dir < arr.length) {
        [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]
      }
      return { ...prev, images: arr }
    })
  }

  const removeImage = (idx) => {
    setProjectForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const [uploadingVideo, setUploadingVideo] = useState(false)

  const moveVideo = (idx, dir) => {
    setProjectForm(prev => {
      const arr = [...prev.videos]
      if (idx + dir >= 0 && idx + dir < arr.length) {
        [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]
      }
      return { ...prev, videos: arr }
    })
  }

  // Handle video upload to Supabase storage (appends to videos array)
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !supabase) return

    setUploadingVideo(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `videos/${fileName}`

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        if (error.message.includes('bucket') || error.message.includes('does not exist')) {
          throw new Error("Storage bucket 'project-images' not found. Please create a public bucket named 'project-images' in Supabase first!")
        }
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      setProjectForm(prev => ({ ...prev, videos: [...prev.videos, publicUrl] }))
      showStatus('Video uploaded successfully!')
    } catch (error) {
      showStatus(error.message, 'error')
    } finally {
      setUploadingVideo(false)
      e.target.value = ''
    }
  }

  const removeVideo = (idx) => {
    setProjectForm(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }))
  }

  // Check Session on Mount
  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch data if authenticated
  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const showStatus = (text, type = 'success') => {
    setStatusMessage({ type, text })
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000)
  }

  const fetchData = async () => {
    if (!supabase) return
    setDataLoading(true)
    try {
      let { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })

      if (projErr && projErr.message.includes('order_index')) {
        const fallback = await supabase.from('projects').select('*').order('id', { ascending: true })
        projData = fallback.data
        projErr = fallback.error
      }

      if (projErr) throw projErr
      setProjects(projData || [])

      let { data: expData, error: expErr } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })

      if (expErr && expErr.message.includes('order_index')) {
        const fallback = await supabase.from('experiences').select('*').order('id', { ascending: true })
        expData = fallback.data
        expErr = fallback.error
      }

      if (expErr) throw expErr
      setExperiences(expData || [])
    } catch (error) {
      showStatus('Failed to load database content: ' + error.message, 'error')
    } finally {
      setDataLoading(false)
    }
  }

  const moveProject = async (index, dir) => {
    if (index + dir < 0 || index + dir >= projects.length) return
    const newProjects = [...projects]
    const temp = newProjects[index]
    newProjects[index] = newProjects[index + dir]
    newProjects[index + dir] = temp
    setProjects(newProjects)

    if (!supabase) return
    try {
      for (let i = 0; i < newProjects.length; i++) {
        const { error } = await supabase.from('projects').update({ order_index: i }).eq('id', newProjects[i].id)
        if (error) throw error
      }
    } catch (e) {
      if (e.message.includes('order_index')) {
        showStatus('Harap buat kolom "order_index" (tipe int8) di tabel projects pada Supabase Anda untuk menyimpan urutan!', 'error')
      } else {
        showStatus('Gagal menyimpan urutan: ' + e.message, 'error')
      }
    }
  }

  const moveExperience = async (index, dir) => {
    if (index + dir < 0 || index + dir >= experiences.length) return
    const newExps = [...experiences]
    const temp = newExps[index]
    newExps[index] = newExps[index + dir]
    newExps[index + dir] = temp
    setExperiences(newExps)

    if (!supabase) return
    try {
      for (let i = 0; i < newExps.length; i++) {
        const { error } = await supabase.from('experiences').update({ order_index: i }).eq('id', newExps[i].id)
        if (error) throw error
      }
    } catch (e) {
      if (e.message.includes('order_index')) {
        showStatus('Harap buat kolom "order_index" (tipe int8) di tabel experiences pada Supabase Anda untuk menyimpan urutan!', 'error')
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setLoginError('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
      return
    }
    setLoading(true)
    setLoginError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      showStatus('Welcome back, Farhan!')
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
  }

  // --- SYNC HARDCODED DATA ---
  const handleSyncData = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      let syncProjCount = 0
      let syncExpCount = 0

      if (projects.length === 0 && hardcodedProjects.length > 0) {
        const preparedProjects = hardcodedProjects.map(p => ({
          title: p.title,
          category: p.category,
          year: p.year,
          description: p.description,
          full_description: p.fullDescription || p.description,
          role: p.role || '',
          contribution: p.contribution || '',
          images: p.image ? [p.image] : (p.images || []),
          videos: p.videoUrl ? [p.videoUrl] : (p.videos || []),
          tech: p.tech || [],
          color: p.color || '#6366F1',
          platforms: p.platforms || [],
          repo_link: p.repoLink || '',
          project_link: p.projectLink || '',
          more_info_link: p.moreInfoLink || ''
        }))

        const { error } = await supabase.from('projects').insert(preparedProjects)
        if (error) throw error
        syncProjCount = preparedProjects.length
      }

      if (experiences.length === 0 && hardcodedExperiences.length > 0) {
        const preparedExperiences = hardcodedExperiences.map(e => ({
          role: e.role,
          company: e.company,
          period: e.period,
          description: e.description
        }))

        const { error } = await supabase.from('experiences').insert(preparedExperiences)
        if (error) throw error
        syncExpCount = preparedExperiences.length
      }

      await fetchData()
      showStatus(`Sync successful! Uploaded ${syncProjCount} projects and ${syncExpCount} experiences.`);
    } catch (error) {
      showStatus('Sync failed: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- PROJECT CRUD ---
  const openAddProject = () => {
    setCurrentProject(null)
    setProjectForm({
      title: '',
      category: 'Mobile Apps',
      year: new Date().getFullYear().toString(),
      description: '',
      full_description: '',
      role: '',
      contribution: '',
      images: [],
      videos: [],
      tech: '',
      color: '#6366F1',
      platforms: [],
      repo_link: '',
      project_link: '',
      more_info_link: ''
    })
    setShowProjectModal(true)
  }

  const openEditProject = (proj) => {
    setCurrentProject(proj)
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Mobile Apps',
      year: proj.year || '',
      description: proj.description || '',
      full_description: proj.full_description || '',
      role: proj.role || '',
      contribution: proj.contribution || '',
      images: Array.isArray(proj.images) ? proj.images : (proj.image ? [proj.image] : []),
      videos: Array.isArray(proj.videos) ? proj.videos : (proj.video_url ? [proj.video_url] : []),
      tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : '',
      color: proj.color || '#6366F1',
      platforms: proj.platforms || [],
      repo_link: proj.repo_link || '',
      project_link: proj.project_link || '',
      more_info_link: proj.more_info_link || ''
    })
    setShowProjectModal(true)
  }

  const handlePlatformCheckbox = (platform) => {
    setProjectForm(prev => {
      const isSelected = prev.platforms.includes(platform)
      const newPlatforms = isSelected
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
      return { ...prev, platforms: newPlatforms }
    })
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)

    const formattedTech = projectForm.tech
      ? projectForm.tech.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      year: projectForm.year,
      description: projectForm.description,
      full_description: projectForm.full_description,
      role: projectForm.role,
      contribution: projectForm.contribution,
      images: projectForm.images,
      videos: projectForm.videos,
      tech: formattedTech,
      color: projectForm.color,
      platforms: projectForm.platforms,
      repo_link: projectForm.repo_link,
      project_link: projectForm.project_link,
      more_info_link: projectForm.more_info_link
    }

    try {
      let { error } = currentProject
        ? await supabase.from('projects').update(payload).eq('id', currentProject.id)
        : await supabase.from('projects').insert([payload])

      if (error && (error.message.includes('role') || error.message.includes('contribution'))) {
        const fallbackPayload = { ...payload }
        delete fallbackPayload.role
        delete fallbackPayload.contribution
        const res = currentProject
          ? await supabase.from('projects').update(fallbackPayload).eq('id', currentProject.id)
          : await supabase.from('projects').insert([fallbackPayload])
        if (res.error) throw res.error
        showStatus('Project saved! (Catatan: Harap buat kolom "role" dan "contribution" tipe text di tabel projects Supabase Anda agar tersimpan)', 'error')
      } else if (error) {
        throw error
      } else {
        showStatus(currentProject ? 'Project updated successfully!' : 'Project created successfully!')
      }
      setShowProjectModal(false)
      fetchData()
    } catch (error) {
      showStatus('Failed to save project: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!supabase || !window.confirm('Are you sure you want to delete this project?')) return
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      showStatus('Project deleted.')
      fetchData()
    } catch (error) {
      showStatus('Delete failed: ' + error.message, 'error')
    }
  }

  // --- EXPERIENCE CRUD ---
  const openAddExp = () => {
    setCurrentExp(null)
    setExpForm({
      role: '',
      company: '',
      period: '',
      description: ''
    })
    setShowExpModal(true)
  }

  const openEditExp = (exp) => {
    setCurrentExp(exp)
    setExpForm({
      role: exp.role || '',
      company: exp.company || '',
      period: exp.period || '',
      description: exp.description || ''
    })
    setShowExpModal(true)
  }

  const handleExpSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)

    const payload = {
      role: expForm.role,
      company: expForm.company,
      period: expForm.period,
      description: expForm.description
    }

    try {
      if (currentExp) {
        const { error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', currentExp.id)
        if (error) throw error
        showStatus('Experience updated successfully!')
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([payload])
        if (error) throw error
        showStatus('Experience added successfully!')
      }
      setShowExpModal(false)
      fetchData()
    } catch (error) {
      showStatus('Failed to save experience: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExp = async (id) => {
    if (!supabase || !window.confirm('Are you sure you want to delete this experience?')) return
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id)
      if (error) throw error
      showStatus('Experience deleted.')
      fetchData()
    } catch (error) {
      showStatus('Delete failed: ' + error.message, 'error')
    }
  }

  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [profilePicUrl, setProfilePicUrl] = useState(() => {
    if (!supabase) return null
    return supabase.storage.from('project-images').getPublicUrl('profile/avatar.png').data.publicUrl + '?t=' + Date.now()
  })

  const [cvUrl, setCvUrl] = useState('')
  const [uploadingCv, setUploadingCv] = useState(false)

  // Fetch CV setting when authenticated
  useEffect(() => {
    if (!supabase || !session) return
    const fetchCv = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cv_url')
          .maybeSingle()

        if (data && data.value) {
          setCvUrl(data.value)
        } else {
          const storageUrl = supabase.storage.from('project-images').getPublicUrl('cv/resume.pdf').data.publicUrl
          setCvUrl(storageUrl)
        }
      } catch (e) { }
    }
    fetchCv()
  }, [session])

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !supabase) return
    setUploadingProfile(true)
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)
      
      const { error } = await supabase.storage
        .from('project-images')
        .upload('profile/avatar.png', compressedFile, {
          cacheControl: '0',
          upsert: true
        })

      if (error) {
        if (error.message.includes('bucket')) {
           throw new Error("Bucket 'project-images' not found.")
        }
        throw error
      }
      
      const newUrl = supabase.storage.from('project-images').getPublicUrl('profile/avatar.png').data.publicUrl + '?t=' + Date.now()
      setProfilePicUrl(newUrl)
      
      showStatus('Profile picture updated successfully!')
    } catch (err) {
      showStatus(err.message, 'error')
    } finally {
      setUploadingProfile(false)
      e.target.value = ''
    }
  }

  const handleCvFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !supabase) return
    setUploadingCv(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cv/CV_Farhan_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        if (uploadError.message.includes('bucket')) {
          throw new Error("Storage bucket 'project-images' not found.")
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

      setCvUrl(publicUrl)

      try {
        await supabase.from('site_settings').upsert({ key: 'cv_url', value: publicUrl }, { onConflict: 'key' })
      } catch (dbErr) { }

      showStatus('CV file uploaded and URL saved successfully!')
    } catch (err) {
      showStatus('Failed to upload CV: ' + err.message, 'error')
    } finally {
      setUploadingCv(false)
      e.target.value = ''
    }
  }

  const handleSaveCvUrl = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'cv_url', value: cvUrl }, { onConflict: 'key' })

      if (error && error.message.includes('relation "site_settings" does not exist')) {
        showStatus('CV URL updated! (Optional: Create table "site_settings" in Supabase for table persistence)', 'success')
      } else if (error) {
        throw error
      } else {
        showStatus('CV URL saved to database successfully!')
      }
    } catch (err) {
      showStatus('Error saving CV URL: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- RENDERING LOGIN PANEL ---
  if (!session) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-logo">f.</div>
          <h2>Admin Secure Login</h2>
          <p className="admin-login-subtitle">Manage portfolio projects & experiences</p>

          {loginError && <div className="admin-error-box">{loginError}</div>}

          {!supabase && (
            <div className="admin-warning-box">
              <strong>Supabase Connection Missing</strong>
              <p>Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, then run a local build.</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="admin-input-group">
              <label htmlFor="admin-email">Email Address</label>
              <input
                id="admin-email"
                type="email"
                required
                disabled={!supabase}
                placeholder="admin@farhan.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="admin-input-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                disabled={!supabase}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="admin-btn-login"
              disabled={loading || !supabase}
            >
              {loading ? 'Logging in...' : 'Sign In Securely'}
            </button>
          </form>
          <div className="admin-login-footer">
            <a href="/">← Return to Portfolio</a>
          </div>
        </div>
      </div>
    )
  }

  // --- RENDERING DASHBOARD PANEL ---
  return (
    <div className="admin-dashboard">
      {statusMessage.text && (
        <div className={`admin-toast admin-toast--${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-logo">f.</span>
          <div>
            <h1>Control Panel</h1>
            <span className="admin-user-badge">{session.user?.email}</span>
          </div>
        </div>
        <div className="admin-header__actions">
          <button onClick={handleSyncData} className="admin-btn admin-btn--outline" title="Populate database with local hardcoded items if table is empty" disabled={loading}>
            ⚡ Sync Local Data
          </button>
          <a href="/" className="admin-btn admin-btn--outline">
            👁️ View Site
          </a>
          <button onClick={handleLogout} className="admin-btn admin-btn--danger">
            Log Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="admin-content">
        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📂 Projects ({projects.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'experiences' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            💼 Experiences ({experiences.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Info
          </button>
        </div>

        {dataLoading ? (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <p>Fetching database entries...</p>
          </div>
        ) : (
          <div className="admin-table-container">
            {activeTab === 'projects' && (
              <div className="admin-section-data">
                <div className="admin-section-header">
                  <h2>Projects List</h2>
                  <button onClick={openAddProject} className="admin-btn admin-btn--primary">
                    + Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="admin-empty-state">
                    <p>No projects found in database.</p>
                    <button onClick={handleSyncData} className="admin-btn admin-btn--outline">
                      Load Hardcoded Data
                    </button>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Visual</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Year</th>
                        <th>Tech Stack</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(proj => (
                        <tr key={proj.id}>
                          <td>
                            <div className="admin-td-visual" style={{ background: `${proj.color}15` }}>
                              {proj.image ? (
                                <img src={proj.image} alt="" />
                              ) : (
                                <div className="admin-visual-fallback" style={{ color: proj.color }}>{proj.title[0]}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong>{proj.title}</strong>
                            <div className="admin-platforms-row">
                              {proj.platforms?.map(p => (
                                <span key={p} className="admin-tag-platform">{p}</span>
                              ))}
                            </div>
                          </td>
                          <td>{proj.category}</td>
                          <td>{proj.year}</td>
                          <td>
                            <div className="admin-tech-cell">
                              {proj.tech?.slice(0, 3).map(t => (
                                <span key={t} className="admin-tag-tech">{t}</span>
                              ))}
                              {proj.tech?.length > 3 && <span>+{proj.tech.length - 3} more</span>}
                            </div>
                          </td>
                          <td>
                            <div className="admin-actions-cell" style={{ gap: '4px' }}>
                              <button onClick={() => moveProject(projects.indexOf(proj), -1)} disabled={projects.indexOf(proj) === 0} className="admin-action-btn admin-action-btn--outline" title="Move Up">↑</button>
                              <button onClick={() => moveProject(projects.indexOf(proj), 1)} disabled={projects.indexOf(proj) === projects.length - 1} className="admin-action-btn admin-action-btn--outline" title="Move Down">↓</button>
                              <button onClick={() => openEditProject(proj)} className="admin-action-btn admin-action-btn--edit">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteProject(proj.id)} className="admin-action-btn admin-action-btn--delete">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === 'experiences' && (
              <div className="admin-section-data">
                <div className="admin-section-header">
                  <h2>Experiences List</h2>
                  <button onClick={openAddExp} className="admin-btn admin-btn--primary">
                    + Add Experience
                  </button>
                </div>

                {experiences.length === 0 ? (
                  <div className="admin-empty-state">
                    <p>No experiences found in database.</p>
                    <button onClick={handleSyncData} className="admin-btn admin-btn--outline">
                      Load Hardcoded Data
                    </button>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Company</th>
                        <th>Period</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiences.map(exp => (
                        <tr key={exp.id}>
                          <td><strong>{exp.role}</strong></td>
                          <td>{exp.company}</td>
                          <td><span className="admin-period-pill">{exp.period}</span></td>
                          <td><p className="admin-desc-cell">{exp.description}</p></td>
                          <td>
                            <div className="admin-actions-cell" style={{ gap: '4px' }}>
                              <button onClick={() => moveExperience(experiences.indexOf(exp), -1)} disabled={experiences.indexOf(exp) === 0} className="admin-action-btn admin-action-btn--outline" title="Move Up">↑</button>
                              <button onClick={() => moveExperience(experiences.indexOf(exp), 1)} disabled={experiences.indexOf(exp) === experiences.length - 1} className="admin-action-btn admin-action-btn--outline" title="Move Down">↓</button>
                              <button onClick={() => openEditExp(exp)} className="admin-action-btn admin-action-btn--edit">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteExp(exp.id)} className="admin-action-btn admin-action-btn--delete">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="admin-section-data">
                <div className="admin-section-header">
                  <h2>Profile Settings</h2>
                </div>
                <div className="admin-form-group" style={{maxWidth: '400px', marginTop: '24px'}}>
                  <label>Profile Picture (About Section)</label>
                  <p className="admin-help-text" style={{marginBottom: '12px'}}>Upload a photo to be displayed in the About Me section.</p>
                  
                  {profilePicUrl && (
                    <div style={{marginBottom: '16px'}}>
                      <img 
                        src={profilePicUrl} 
                        alt="Profile" 
                        style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--color-border)', boxShadow: 'var(--shadow-sm)'}} 
                        onError={(e) => e.target.style.display = 'none'} 
                      />
                    </div>
                  )}

                  <input type="file" accept="image/*" onChange={handleProfilePicUpload} disabled={uploadingProfile} className="admin-form-input" />
                  {uploadingProfile && <span className="admin-uploading-text" style={{display: 'block', marginTop: '8px', color: 'var(--color-primary)'}}>Uploading and compressing...</span>}
                </div>

                {/* CV / Resume Section */}
                <div className="admin-form-group" style={{maxWidth: '540px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--color-border)'}}>
                  <label style={{fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px', display: 'block'}}>Curriculum Vitae (CV / Resume)</label>
                  <p className="admin-help-text" style={{marginBottom: '16px'}}>
                    Upload your CV (PDF or Word document) or set a direct link. Users can download this when clicking "Download CV" in the Hero section.
                  </p>

                  {cvUrl && (
                    <div style={{marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <a 
                        href={cvUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="admin-btn admin-btn--outline"
                        style={{fontSize: '0.85rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px'}}
                      >
                        📄 Preview Current CV ↗
                      </a>
                    </div>
                  )}

                  <div style={{marginBottom: '16px'}}>
                    <label style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '6px', display: 'block'}}>
                      Upload New CV File (.pdf, .doc, .docx):
                    </label>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleCvFileUpload} 
                      disabled={uploadingCv} 
                      className="admin-form-input" 
                    />
                    {uploadingCv && (
                      <span className="admin-uploading-text" style={{display: 'block', marginTop: '8px', color: '#10b981'}}>
                        Uploading CV to storage...
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '6px', display: 'block'}}>
                      Or Custom Direct Link / Google Drive URL:
                    </label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <input 
                        type="url" 
                        placeholder="https://.../my-cv.pdf" 
                        value={cvUrl || ''} 
                        onChange={e => setCvUrl(e.target.value)} 
                        className="admin-form-input" 
                        style={{flex: 1}}
                      />
                      <button 
                        type="button" 
                        onClick={handleSaveCvUrl} 
                        disabled={loading}
                        className="admin-btn admin-btn--primary" 
                        style={{whiteSpace: 'nowrap'}}
                      >
                        Save URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{currentProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowProjectModal(false)} className="admin-modal-close">&times;</button>
            </div>
            <form onSubmit={handleProjectSubmit} className="admin-modal-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={e => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Website">Website</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={projectForm.year}
                    onChange={e => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Accent Color</label>
                  <div className="admin-color-picker-row">
                    <input
                      type="color"
                      value={projectForm.color}
                      onChange={e => setProjectForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="#6366F1"
                      value={projectForm.color}
                      onChange={e => setProjectForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Short Description (Hero card summary)</label>
                <input
                  type="text"
                  value={projectForm.description}
                  onChange={e => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Full Description (Modal Detail)</label>
                <textarea
                  rows="4"
                  value={projectForm.full_description}
                  onChange={e => setProjectForm(prev => ({ ...prev, full_description: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Role (e.g. Lead Mobile Developer, Fullstack Engineer)</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Mobile Developer & UI/UX Designer"
                  value={projectForm.role}
                  onChange={e => setProjectForm(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Key Contributions (Responsibilities & features built - 1 bullet per line)</label>
                <textarea
                  rows="4"
                  placeholder="• Developed OCR label scanning with Google Cloud Vision&#10;• Designed mobile app wireframes and high-fidelity prototypes in Figma&#10;• Architected FastAPI backend REST APIs"
                  value={projectForm.contribution}
                  onChange={e => setProjectForm(prev => ({ ...prev, contribution: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Images ({projectForm.images.length} uploaded)</label>
                <div className="admin-upload-field">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="project-image-file"
                    className="admin-file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="project-image-file" className="admin-upload-btn">
                    {uploadingImage ? 'Uploading...' : '📁 Add Image'}
                  </label>
                </div>
                {projectForm.images.length > 0 && (
                  <div className="admin-media-list">
                    {projectForm.images.map((url, idx) => (
                      <div key={idx} className="admin-media-item">
                        <img src={url} alt={`Image ${idx + 1}`} className="admin-media-thumb" />
                        <span className="admin-media-label" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          Image {idx + 1}
                          <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0} style={{ padding: '0 4px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>◀</button>
                          <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === projectForm.images.length - 1} style={{ padding: '0 4px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>▶</button>
                        </span>
                        <button type="button" className="admin-media-remove" onClick={() => removeImage(idx)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Videos ({projectForm.videos.length} uploaded)</label>
                <div className="admin-upload-field">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    id="project-video-file"
                    className="admin-file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="project-video-file" className="admin-upload-btn">
                    {uploadingVideo ? 'Uploading...' : '🎥 Add Video'}
                  </label>
                </div>
                {projectForm.videos.length > 0 && (
                  <div className="admin-media-list">
                    {projectForm.videos.map((url, idx) => (
                      <div key={idx} className="admin-media-item">
                        <video src={url} muted className="admin-media-thumb" />
                        <span className="admin-media-label" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          Video {idx + 1}
                          <button type="button" onClick={() => moveVideo(idx, -1)} disabled={idx === 0} style={{ padding: '0 4px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>◀</button>
                          <button type="button" onClick={() => moveVideo(idx, 1)} disabled={idx === projectForm.videos.length - 1} style={{ padding: '0 4px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>▶</button>
                        </span>
                        <button type="button" className="admin-media-remove" onClick={() => removeVideo(idx)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Flutter, Firebase, Dart"
                  value={projectForm.tech}
                  onChange={e => setProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Platforms</label>
                <div className="admin-checkbox-row">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={projectForm.platforms.includes('android')}
                      onChange={() => handlePlatformCheckbox('android')}
                    />
                    Android
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={projectForm.platforms.includes('ios')}
                      onChange={() => handlePlatformCheckbox('ios')}
                    />
                    iOS
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={projectForm.platforms.includes('web')}
                      onChange={() => handlePlatformCheckbox('web')}
                    />
                    Web
                  </label>
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={projectForm.platforms.includes('figma')}
                      onChange={() => handlePlatformCheckbox('figma')}
                    />
                    Figma
                  </label>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Live Project Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.project_link}
                    onChange={e => setProjectForm(prev => ({ ...prev, project_link: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Source Code Link (GitHub)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.repo_link}
                    onChange={e => setProjectForm(prev => ({ ...prev, repo_link: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>More Info Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.more_info_link}
                    onChange={e => setProjectForm(prev => ({ ...prev, more_info_link: e.target.value }))}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setShowProjectModal(false)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="admin-btn admin-btn--primary">
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {showExpModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{currentExp ? 'Edit Experience' : 'New Experience'}</h2>
              <button onClick={() => setShowExpModal(false)} className="admin-modal-close">&times;</button>
            </div>
            <form onSubmit={handleExpSubmit} className="admin-modal-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={expForm.role}
                    onChange={e => setExpForm(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={expForm.company}
                    onChange={e => setExpForm(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Period *</label>
                <input
                  type="text"
                  placeholder="e.g. Jun 2025 - Aug 2025"
                  required
                  value={expForm.period}
                  onChange={e => setExpForm(prev => ({ ...prev, period: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Description / Key Achievements</label>
                <textarea
                  rows="4"
                  value={expForm.description}
                  onChange={e => setExpForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setShowExpModal(false)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="admin-btn admin-btn--primary">
                  {loading ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
