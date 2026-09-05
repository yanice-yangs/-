import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Eye, Heart, Mail, MoveRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'
import './hero.css'
import './theme.css'
import './portfolio.css'
import './about.css'
import './motion.css'
import './project-detail.css'
import { projects } from './portfolio-data'
import GlareHover from './components/GlareHover'
import BorderGlow from './components/BorderGlow'
import DotField from './components/DotField'

const skills = [
  { no: 'A.', title: 'AI 视觉生成', en: 'AIGC VISUAL', text: '熟练运用生成式工具与提示词工程，让创意从概念快速抵达高完成度视觉。', tags: ['PROMPT', 'IMAGE', 'MOTION'] },
  { no: 'B.', title: '品牌系统构建', en: 'BRAND SYSTEM', text: '从策略、核心图形到多场景延展，构建有辨识度且可持续生长的视觉语言。', tags: ['VI', 'CAMPAIGN', 'GUIDE'] },
  { no: 'C.', title: '多领域视觉表达', en: 'VISUAL DESIGN', text: '覆盖品牌、包装、UI 界面、版式与标志设计，将概念转化为完整的视觉成果。', tags: ['PACKAGING', 'UI', 'LAYOUT'] },
  { no: 'D.', title: '沟通与项目协作', en: 'TEAMWORK', text: '通过沟通、调研与协调解决项目落地问题，并分享 Illustrator、AE 动效与 AIGC 基础知识。', tags: ['RESEARCH', 'SHARING', 'TEAM'] },
]

function usePortfolioEngagement() {
  const [visitors, setVisitors] = useState(null)
  const [likes, setLikes] = useState(null)
  const [liked, setLiked] = useState(() => window.localStorage.getItem('portfolio-liked') === 'true')
  const [likePending, setLikePending] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'visit' }),
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Stats service unavailable')
        const data = await response.json()
        setVisitors(Number(data.visitors) || 0)
        setLikes(Number(data.likes) || 0)
      } catch (error) {
        if (error.name !== 'AbortError') {
          const localVisits = Number(window.localStorage.getItem('portfolio-visit-fallback')) || 0
          const nextVisits = localVisits + 1
          window.localStorage.setItem('portfolio-visit-fallback', String(nextVisits))
          setVisitors(nextVisits)
          setLikes(Number(window.localStorage.getItem('portfolio-like-fallback')) || 0)
        }
      }
    }
    loadStats()
    return () => controller.abort()
  }, [])

  const handleLike = async () => {
    if (liked || likePending) return
    const previousLikes = likes || 0
    setLiked(true)
    setLikePending(true)
    setLikes(previousLikes + 1)
    window.localStorage.setItem('portfolio-liked', 'true')
    window.localStorage.setItem('portfolio-like-fallback', String(previousLikes + 1))

    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      })
      if (!response.ok) throw new Error('Stats service unavailable')
      const data = await response.json()
      setVisitors(Number(data.visitors) || visitors || 0)
      setLikes(Number(data.likes) || previousLikes + 1)
    } catch {
      // Keep the optimistic local value so a third-party outage never blocks the hero.
    } finally {
      setLikePending(false)
    }
  }

  return { visitors, likes, liked, likePending, handleLike }
}

function EngagementPanel({ visitors, likes, liked, likePending, handleLike, placement = 'hero' }) {
  const formatCount = value => value === null ? '···' : new Intl.NumberFormat('zh-CN').format(value)

  return (
    <aside className={`engagement-panel ${placement === 'hero' ? 'hero-engagement' : 'contact-engagement'}`} aria-label="网站访问与点赞数据">
      <div className="engagement-heading">
        <span>访客互动</span><i />
        <em>{placement === 'hero' ? '每一次到访，都让灵感继续生长' : '点个赞留下回应；想合作或学做网站，欢迎发邮件'}</em>
      </div>
      <div className="engagement-items">
        <div className="engagement-stat">
          <Eye size={19} strokeWidth={1.4} />
          <span><small>累计访问</small><strong>{formatCount(visitors)}</strong></span>
        </div>
        <button className="engagement-like" type="button" aria-pressed={liked} disabled={likePending || liked} onClick={handleLike}>
          <Heart size={19} strokeWidth={1.4} fill={liked ? 'currentColor' : 'none'} />
          <span><small>{liked ? '感谢你的喜欢' : '为作品点赞'}</small><strong>{formatCount(likes)}</strong></span>
        </button>
      </div>
    </aside>
  )
}

function ProjectDetail({ project }) {
  if (!project) return null

  return (
    <section className="project-detail" role="dialog" aria-modal="true" aria-label={`${project.title}项目完整内容`}>
      <header className="project-detail-nav">
        <a href="#work" className="project-detail-back">← 返回项目</a>
        <div><strong>{project.title}</strong><span>{project.en} · {project.slides.length} PAGES</span></div>
        <span>SCROLL TO EXPLORE ↓</span>
      </header>
      <div className="project-detail-intro">
        <span>{project.id} / FULL CASE</span>
        <h1>{project.en}</h1>
        <p>{project.note}</p>
      </div>
      <div className="project-slides">
        {project.slides.map((slide, index) => (
          <figure key={slide}>
            <span>{String(index + 1).padStart(2, '0')} / {project.slides.length}</span>
            <img src={slide} alt={`${project.title}项目第 ${index + 1} 页`} width="1800" height="1013"
              loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
          </figure>
        ))}
      </div>
      <a href="#work" className="project-detail-footer">返回精选项目 ↑</a>
    </section>
  )
}

function App() {
  const appRef = useRef(null)
  const heroRef = useRef(null)
  const plumParallaxRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [plumsReady, setPlumsReady] = useState(false)
  const engagement = usePortfolioEngagement()
  const [activeDetail, setActiveDetail] = useState(() => window.location.hash.startsWith('#project-') ? window.location.hash.replace('#project-', '') : '')
  useEffect(() => {
    let frame = 0
    let navIsScrolled = window.scrollY > 40
    const updateNav = () => {
      frame = 0
      const nextScrolled = window.scrollY > 40
      if (nextScrolled !== navIsScrolled) {
        navIsScrolled = nextScrolled
        setScrolled(nextScrolled)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateNav)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    setScrolled(navIsScrolled)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const parallax = plumParallaxRef.current
    const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!hero || !parallax || !finePointer.matches) return undefined

    let frame = 0
    let nextX = 0
    let nextY = 0
    const renderParallax = () => {
      frame = 0
      parallax.style.setProperty('--plum-parallax-x', `${nextX.toFixed(2)}px`)
      parallax.style.setProperty('--plum-parallax-y', `${nextY.toFixed(2)}px`)
    }
    const queueRender = () => {
      if (!frame) frame = window.requestAnimationFrame(renderParallax)
    }
    const onPointerMove = (event) => {
      nextX = ((event.clientX / window.innerWidth) - 0.5) * 18
      nextY = ((event.clientY / window.innerHeight) - 0.5) * 12
      queueRender()
    }
    const resetParallax = () => {
      nextX = 0
      nextY = 0
      queueRender()
    }

    hero.addEventListener('pointermove', onPointerMove, { passive: true })
    hero.addEventListener('pointerleave', resetParallax)
    return () => {
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', resetParallax)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const syncDetail = () => {
      const hash = window.location.hash
      const isProjectDetail = hash.startsWith('#project-')
      setActiveDetail(isProjectDetail ? hash.replace('#project-', '') : '')

      // A detail page locks body scrolling. When its hash changes back to a
      // section, wait for React to release that lock before restoring position.
      if (!isProjectDetail && hash.length > 1) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
          })
        })
      }
    }
    window.addEventListener('hashchange', syncDetail)
    syncDetail()
    return () => window.removeEventListener('hashchange', syncDetail)
  }, [])

  useEffect(() => {
    if (!projects.some(project => project.detail === activeDetail)) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [activeDetail])

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = appRef.current
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      root.classList.add('motion-enabled')
      const desktopMotion = gsap.matchMedia()
      const context = gsap.context(() => {
        const opening = gsap.timeline({ defaults: { ease: 'expo.inOut' } })
        gsap.set('.hero-title-motion', { clipPath: 'inset(0 100% 0 0)', yPercent: 46, scaleX: 0.72, transformOrigin: 'center center' })
        gsap.set(['.nav', '.hero-bottom', '.hero-status', '.hero-engagement'], { autoAlpha: 0 })
        gsap.set('.hero-engagement', { y: 24 })

        opening
          .to('.nav', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0)
          .to('.hero-title-motion', { clipPath: 'inset(0 0% 0 0)', yPercent: 0, scaleX: 1, duration: 1.3 }, 0.05)
          .to(['.hero-bottom', '.hero-engagement', '.hero-status'], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.72)
          .call(() => ScrollTrigger.refresh())

        gsap.from('.about .section-head', {
          scrollTrigger: { trigger: '#about', start: 'top 78%' },
          xPercent: -16, autoAlpha: 0, duration: 1.1, ease: 'power4.out',
        })
        gsap.from('.about .portrait-wrap', {
          scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
          clipPath: 'inset(100% 0 0 0)', scale: 0.94, duration: 1.45, ease: 'expo.inOut',
        })
        gsap.from('.about .bio > *', {
          scrollTrigger: { trigger: '.about-grid', start: 'top 72%' },
          y: 74, autoAlpha: 0, duration: 1.05, stagger: 0.1, ease: 'power4.out',
        })
        gsap.from('.metrics > div', {
          scrollTrigger: { trigger: '.metrics', start: 'top 82%' },
          y: 90, autoAlpha: 0, duration: 1, stagger: 0.13, ease: 'power4.out',
        })

        gsap.from('.work-title h2', {
          scrollTrigger: { trigger: '.work-title', start: 'top 82%' },
          xPercent: -28, scaleX: 0.68, clipPath: 'inset(0 100% 0 0)', transformOrigin: 'left center',
          duration: 1.5, ease: 'expo.out',
        })
        gsap.from('.work-title p', {
          scrollTrigger: { trigger: '.work-title', start: 'top 78%' },
          y: 55, autoAlpha: 0, duration: 1, delay: 0.35, ease: 'power4.out',
        })
        ScrollTrigger.batch('.project-card', {
          start: 'top 88%',
          once: true,
          onEnter: batch => {
            gsap.fromTo(batch,
              { y: 125, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1.15, stagger: 0.16, ease: 'power4.out', overwrite: true })
            gsap.from(batch.map(card => card.querySelector('.project-art')).filter(Boolean), {
              clipPath: 'inset(0 0 100% 0)', duration: 1.25, stagger: 0.12, ease: 'expo.inOut',
            })
          },
        })

        // Continuous scrub work is reserved for larger screens where the subtle
        // parallax is visible. Mobile keeps the reveal without a scroll-bound tween.
        const allowScrubParallax = !navigator.deviceMemory || navigator.deviceMemory >= 4
        desktopMotion.add('(min-width: 1100px) and (pointer: fine)', () => {
          if (!allowScrubParallax) return undefined
          gsap.utils.toArray('.project-art img').forEach((image) => {
            gsap.fromTo(image, { scale: 1.08, yPercent: -3 }, {
              scale: 1.03, yPercent: 3, ease: 'none',
              scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
            })
          })
        })

        gsap.from('.ability-intro h2', {
          scrollTrigger: { trigger: '.ability-intro', start: 'top 82%' },
          xPercent: 24, scaleX: 0.72, clipPath: 'inset(0 0 0 100%)', transformOrigin: 'right center',
          duration: 1.45, ease: 'expo.out',
        })
        gsap.from('.ability-intro > p', {
          scrollTrigger: { trigger: '.ability-intro', start: 'top 80%' },
          y: 50, autoAlpha: 0, duration: 1, ease: 'power4.out',
        })
        ScrollTrigger.batch('.skill-card', {
          start: 'top 92%',
          once: true,
          onEnter: batch => gsap.fromTo(batch,
            { y: 105, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.14, ease: 'power4.out', overwrite: true }),
        })
        gsap.from('.experience-strip > *', {
          scrollTrigger: { trigger: '.experience-strip', start: 'top 86%' },
          x: -70, autoAlpha: 0, duration: 0.9, stagger: 0.11, ease: 'power3.out',
        })

        gsap.from('.contact-main h2', {
          scrollTrigger: { trigger: '#contact', start: 'top 66%' },
          yPercent: 55, scaleY: 0.68, clipPath: 'inset(100% 0 0 0)', transformOrigin: 'center bottom',
          duration: 1.55, ease: 'expo.out',
        })
        gsap.from(['.contact-main > p', '.contact-engagement', '.contact footer'], {
          scrollTrigger: { trigger: '#contact', start: 'top 58%' },
          y: 65, autoAlpha: 0, duration: 1, stagger: 0.15, ease: 'power4.out',
        })
      }, root)

      return () => {
        desktopMotion.revert()
        context.revert()
        root.classList.remove('motion-enabled')
      }
    })

    return () => media.revert()
  }, [])

  return (
    <div className="site-shell" ref={appRef}>
      <div className="grain" />
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <a className="brand" href="#top" aria-label="返回首页">一颗梅子酱<span>®</span></a>
        <nav className={menu ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={() => setMenu(false)}>关于 / ABOUT</a>
          <a href="#work" onClick={() => setMenu(false)}>项目 / WORK</a>
          <a href="#ability" onClick={() => setMenu(false)}>能力 / ABILITY</a>
        </nav>
        <a className="nav-cta" href="#contact">LET'S TALK <ArrowUpRight size={17} /></a>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="切换菜单"><span/><span/></button>
      </header>

      <ProjectDetail project={projects.find(project => project.detail === activeDetail)} />

      <main>
        <section className="hero" id="top" ref={heroRef}>
          <div className="hero-fallback" />
          <div className="hero-shade" />
          <div className="hero-title-position">
            <div className="hero-title-motion">
              <h1 className="hero-title">Visual Designer</h1>
            </div>
          </div>
          <div className="hero-sculpture" aria-hidden="true">
            <div className="plum-entry" data-ready={plumsReady}>
              <div className="plum-parallax" ref={plumParallaxRef}>
                <div className="plum-drift">
                  <div className="plum-sway">
                    <img className="hero-plums" src="/assets/hero-plums-silver-opt.webp" alt="" width="1491" height="1055" fetchPriority="high" decoding="async" onLoad={() => setPlumsReady(true)} />
                  </div>
                </div>
              </div>
            </div>
            <span className="sculpture-caption">EXPERIMENT 001 — CREATIVE MATTER</span>
          </div>
          <div className="hero-content page-width">
            <EngagementPanel {...engagement} />
            <div className="hero-bottom">
              <p className="hero-manifesto">让想象拥有形状，<br/>让设计产生<span>引力。</span><small>AIGC · BRAND · VISUAL</small></p>
              <a href="#work" className="scroll-link"><span>探索我的作品<br/><small>SELECTED WORK / 2025—26</small></span><ArrowDownRight /></a>
            </div>
            <div className="hero-status"><span className="live-dot"/> OPEN TO WORK <span>© 2026</span></div>
          </div>
        </section>

        <div className="post-hero">
          <div className="post-hero-field" aria-hidden="true">
            <DotField
              dotRadius={1.5}
              dotSpacing={18}
              cursorRadius={420}
              bulgeStrength={54}
              glowRadius={180}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom="rgba(236, 0, 155, .34)"
              gradientTo="rgba(255, 101, 200, .2)"
              glowColor="rgba(236, 0, 155, .14)"
            />
          </div>
          <div className="post-hero-content">

        <section className="about section page-width" id="about">
          <div className="about-liquid" aria-hidden="true"><span/><span/></div>
          <div className="section-head"><span>01 / PROFILE</span><span>BEHIND THE PIXELS ↓</span></div>
          <div className="about-grid">
            <div className="portrait-wrap portfolio-portrait">
              <div className="portrait-halo" />
              <img src="/assets/portfolio/profile.jpg" alt="作品集中的人物合照" width="958" height="1275" loading="lazy" />
              <div className="portrait-tag">VISUAL<br/>DESIGNER</div>
              <div className="portrait-code">一颗梅子酱<br/>NINGBO, CN</div>
            </div>
            <div className="bio">
              <p className="eyebrow"><Sparkles size={16}/> HELLO, I'M 一颗梅子酱</p>
              <h2>先读懂<span className="outline">业务</span>，<br/>再做好设计。</h2>
              <p className="bio-copy">我是一颗梅子酱，视觉传达设计本科在读。在校期间多次跟随教授参与项目，负责<em>从概念到执行的整个设计过程</em>，并参加各类设计大赛，获得米兰设计大赛一等奖等奖项。</p>
              <p className="bio-copy">我也与低年级同学分享 Illustrator、AE 动效及 AIGC 基础知识。在项目推进中，通过沟通协调、积极交流与深入调研，解决团队协作和设计落地中的问题。</p>
              <div className="facts">
                <div><small>EDUCATION</small><strong>视觉传达设计 · 本科</strong><span>2023.09 — 至今</span></div>
                <div><small>COLLABORATION</small><strong>合作请通过邮箱联系</strong><span>品牌 / 包装 / UI / 版式 / 标志</span></div>
              </div>
              <div className="contact-row">
                <a href="mailto:3244693649@qq.com"><Mail size={18}/> 3244693649@qq.com</a>
              </div>
            </div>
          </div>
          <div className="metrics">
            <div><strong>30<sup>+</sup></strong><span>设计与创新奖项<br/>AWARDS</span></div>
            <div><strong>19</strong><span>覆盖城市<br/>CITIES</span></div>
            <div><strong>120<sup>+</sup></strong><span>线下设计点位<br/>TOUCHPOINTS</span></div>
            <div><strong>20M<sup>+</sup></strong><span>累计线下曝光（2000万+人次）<br/>IMPRESSIONS</span></div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="page-width">
            <div className="section-head light"><span>02 / SELECTED WORK</span><span>2025—2026</span></div>
            <div className="work-title"><h2>SELECTED<span>↗</span><br/><i>WORKS</i></h2><p>品牌 / 包装 / UI / 版式 / 标志</p></div>
            <div className="projects">
              {projects.map((project) => (
                <article className="project-card portfolio-project" key={project.id}>
                  <GlareHover
                    className="project-art"
                    width="100%"
                    height="auto"
                    background="#080808"
                    borderRadius="0"
                    borderColor="transparent"
                    glareColor="#ec009b"
                    glareOpacity={0.28}
                    glareAngle={-30}
                    glareSize={280}
                    transitionDuration={850}
                  >
                    <img src={project.image} alt={`${project.title}作品展示`} loading="lazy" fetchPriority="low" decoding="async" width="1600" height="900" />
                    {project.detail && <a className="project-card-hit" href={`#project-${project.detail}`} aria-label={`查看${project.title}完整项目`} />}
                  </GlareHover>
                  <div className="project-meta">
                    <div><span>{project.id}</span><h3>{project.title}</h3><p>{project.en}</p></div>
                    <div className="project-side"><span>{project.type}</span><span>{project.pages}</span></div>
                    <button
                      aria-label={project.detail ? `查看${project.title}完整项目` : `查看${project.title}作品大图（新窗口）`}
                      onClick={() => project.detail
                        ? (window.location.hash = `project-${project.detail}`)
                        : window.open(project.image, '_blank', 'noopener,noreferrer')}
                    ><ArrowUpRight /></button>
                  </div>
                  <p className="project-note">{project.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ability section page-width" id="ability">
          <div className="section-head"><span>03 / SUPERPOWERS</span><span>WHAT I DO BEST</span></div>
          <div className="ability-intro"><p>NOT JUST<br/>A PRETTY PICTURE.</p><h2>创意，<span>不止</span><br/>一种解法。</h2></div>
          <div className="skills-grid">
            {skills.map((skill) => <BorderGlow
              className="skill-card"
              key={skill.no}
              edgeSensitivity={20}
              glowColor="320 100 52"
              backgroundColor="#160b13"
              borderRadius={16}
              glowRadius={24}
              glowIntensity={0.82}
              coneSpread={22}
              colors={['#ec009b', '#ff65c8', '#b21877']}
              fillOpacity={0.12}
            >
              <article className="skill-card-content">
                <div className="skill-top"><span>{skill.no}</span><ArrowUpRight /></div>
                <div><small>{skill.en}</small><h3>{skill.title}</h3><p>{skill.text}</p></div>
                <div className="tags">{skill.tags.map(t => <span key={t}>{t}</span>)}</div>
              </article>
            </BorderGlow>)}
          </div>
          <div className="experience-strip">
            <span>EXPERIENCE LOG</span>
            <div><strong>项目实践</strong><small>跟随教授参与项目，承担从概念到执行的设计工作</small></div>
            <div><strong>设计竞赛</strong><small>参加各类设计大赛，获米兰设计大赛一等奖等奖项</small></div>
            <div><strong>协作与分享</strong><small>分享 Illustrator、AE 与 AIGC 基础知识，推进团队协作</small></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-flare"/><div className="contact-grid-bg"/>
          <div className="page-width contact-inner">
            <div className="section-head light"><span>04 / CONTACT</span><span>START A CONVERSATION</span></div>
            <div className="contact-main">
              <p><span className="live-dot"/> AVAILABLE FOR OPPORTUNITIES</p>
              <h2>LET'S MAKE<br/><span>SOMETHING</span><br/>MEMORABLE.</h2>
              <div className="contact-actions">
                <a href="mailto:3244693649@qq.com" className="mail-link">发送邮件 <MoveRight /></a>
                <EngagementPanel {...engagement} placement="contact" />
              </div>
            </div>
            <footer>
              <div className="brand footer-brand">一颗梅子酱<span>®</span></div>
              <p>一颗梅子酱 · AI 视觉设计 / 品牌创意<br/>NINGBO, CHINA · 2026</p>
              <div><a href="mailto:3244693649@qq.com">EMAIL ↗</a></div>
            </footer>
          </div>
        </section>
          </div>
        </div>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
