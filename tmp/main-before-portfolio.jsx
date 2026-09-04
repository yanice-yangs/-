import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Mail, MoveRight, Phone, Sparkles } from 'lucide-react'
import './styles.css'
import './hero.css'
import './theme.css'

const projects = [
  {
    id: '01',
    title: '一布千面',
    en: 'ONE CLOTH, THOUSAND FACES',
    type: 'AIGC / BRAND / CULTURAL DESIGN',
    year: '2025—26',
    cls: 'cloth',
    note: '枣阳粗布非遗 AIGC 文创设计',
  },
  {
    id: '02',
    title: 'EXPO 2026',
    en: 'ENERGY IN MOTION',
    type: 'VISUAL SYSTEM / MOTION',
    year: '2026',
    cls: 'expo',
    note: '上海展会全案视觉体系',
  },
  {
    id: '03',
    title: '城市触点',
    en: 'URBAN TOUCHPOINTS',
    type: 'SYSTEM / WAYFINDING / OOH',
    year: '2026',
    cls: 'city',
    note: '19 城线下物料标准化设计',
  },
]

const skills = [
  { no: 'A.', title: 'AI 视觉生成', en: 'AIGC VISUAL', text: '熟练运用生成式工具与提示词工程，让创意从概念快速抵达高完成度视觉。', tags: ['PROMPT', 'IMAGE', 'MOTION'] },
  { no: 'B.', title: '品牌系统构建', en: 'BRAND SYSTEM', text: '从策略、核心图形到多场景延展，构建有辨识度且可持续生长的视觉语言。', tags: ['VI', 'CAMPAIGN', 'GUIDE'] },
  { no: 'C.', title: '跨场景落地', en: 'REAL-WORLD DESIGN', text: '覆盖线上传播、展会、线下物料与交互界面，兼顾创意表达和真实执行。', tags: ['DIGITAL', 'EXPO', 'OOH'] },
  { no: 'D.', title: '设计 × 技术', en: 'DESIGN × TECH', text: '参与 VR 交互系统研发，以复合视角探索文化、技术与商业之间的新连接。', tags: ['VR', 'UI', 'RESEARCH'] },
]

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [plumsReady, setPlumsReady] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="site-shell">
      <div className="grain" />
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <a className="brand" href="#top" aria-label="返回首页">YXM<span>®</span></a>
        <nav className={menu ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={() => setMenu(false)}>关于 / ABOUT</a>
          <a href="#work" onClick={() => setMenu(false)}>项目 / WORK</a>
          <a href="#ability" onClick={() => setMenu(false)}>能力 / ABILITY</a>
        </nav>
        <a className="nav-cta" href="#contact">LET'S TALK <ArrowUpRight size={17} /></a>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="切换菜单"><span/><span/></button>
      </header>

      <main>
        <section className="hero" id="top">
          <video className="hero-video" autoPlay muted loop playsInline poster="/assets/hero-poster.svg">
            <source src="https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
          <div className="hero-fallback" />
          <div className="hero-shade" />
          <div className="hero-content page-width">
            <div className="hero-title-wrap">
              <h1 aria-label="Visual Designer"><span>Visual Designer</span></h1>
              <div className="hero-subline"><span>杨雪梅 / YANG XUEMEI</span><span>A New Visual Era.</span></div>
            </div>
            <div className="hero-sculpture" aria-hidden="true">
              <div className="plum-entry" data-ready={plumsReady}>
                <div className="plum-drift">
                  <div className="plum-sway">
                    <img className="hero-plums" src="/assets/hero-plums-silver.png" alt="" width="1491" height="1055" fetchPriority="high" decoding="async" onLoad={() => setPlumsReady(true)} />
                  </div>
                </div>
              </div>
              <span className="sculpture-caption">EXPERIMENT 001 — CREATIVE MATTER</span>
            </div>
            <div className="hero-bottom">
              <p className="hero-manifesto">让想象拥有形状，<br/>让设计产生<span>引力。</span><small>AIGC · BRAND · VISUAL</small></p>
              <a href="#work" className="scroll-link"><span>探索我的作品<br/><small>SELECTED WORK / 2025—26</small></span><ArrowDownRight /></a>
            </div>
            <div className="hero-status"><span className="live-dot"/> OPEN TO WORK <span>© 2026</span></div>
          </div>
        </section>

        <section className="about section page-width" id="about">
          <div className="section-head"><span>01 / PROFILE</span><span>BEHIND THE PIXELS ↓</span></div>
          <div className="about-grid">
            <div className="portrait-wrap">
              <div className="portrait-halo" />
              <img src="/assets/profile.jpg" alt="视觉设计师杨雪梅" />
              <div className="portrait-tag">VISUAL<br/>DESIGNER</div>
              <div className="portrait-code">YXM—02<br/>NINGBO, CN</div>
            </div>
            <div className="bio">
              <p className="eyebrow"><Sparkles size={16}/> HELLO, I'M XUEMEI</p>
              <h2>我在创造<span className="outline">有温度的</span><br/>未来视觉。</h2>
              <p className="bio-copy">视觉传达专业本科在读，专注于 <em>AIGC 视觉、品牌系统与跨场景创意</em>。我相信设计不仅关乎好看，更是文化、技术与真实世界之间的一次精准连接。</p>
              <div className="facts">
                <div><small>EDUCATION</small><strong>武昌首义学院</strong><span>视觉传达 · 专业 1/127</span></div>
                <div><small>BASED IN</small><strong>宁波 / 中国</strong><span>Available worldwide</span></div>
              </div>
              <div className="contact-row">
                <a href="mailto:3244693649@qq.com"><Mail size={18}/> 3244693649@qq.com</a>
                <a href="tel:17706882979"><Phone size={18}/> 177 0688 2979</a>
              </div>
            </div>
          </div>
          <div className="metrics">
            <div><strong>30<sup>+</sup></strong><span>设计与创新奖项<br/>AWARDS</span></div>
            <div><strong>19</strong><span>覆盖城市<br/>CITIES</span></div>
            <div><strong>120<sup>+</sup></strong><span>线下设计点位<br/>TOUCHPOINTS</span></div>
            <div><strong>20M<sup>+</sup></strong><span>累计线下曝光<br/>IMPRESSIONS</span></div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="page-width">
            <div className="section-head light"><span>02 / SELECTED WORK</span><span>2025—2026</span></div>
            <div className="work-title"><h2>SELECTED<span>↗</span><br/><i>WORKS</i></h2><p>聚焦品牌、AI 与文化创新的<br/>代表项目集合。</p></div>
            <div className="projects">
              {projects.map((project, i) => (
                <article className={`project-card ${project.cls}`} key={project.id}>
                  <div className="project-art" aria-hidden="true">
                    <span className="art-no">{project.id}</span>
                    <span className="art-word">{project.cls === 'cloth' ? '千面' : project.cls === 'expo' ? 'ENERGY' : 'CITY'}</span>
                    <span className="art-orb"/><span className="art-grid"/>
                  </div>
                  <div className="project-meta">
                    <div><span>{project.id}</span><h3>{project.title}</h3><p>{project.en}</p></div>
                    <div className="project-side"><span>{project.type}</span><span>{project.year}</span></div>
                    <button aria-label={`查看${project.title}项目`}><ArrowUpRight /></button>
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
            {skills.map((skill) => <article className="skill-card" key={skill.no}>
              <div className="skill-top"><span>{skill.no}</span><ArrowUpRight /></div>
              <div><small>{skill.en}</small><h3>{skill.title}</h3><p>{skill.text}</p></div>
              <div className="tags">{skill.tags.map(t => <span key={t}>{t}</span>)}</div>
            </article>)}
          </div>
          <div className="experience-strip">
            <span>EXPERIENCE LOG</span>
            <div><strong>滴滴</strong><small>产品 / 设计实习生 · 2026</small></div>
            <div><strong>擎波探索</strong><small>品牌设计实习生 · 2026</small></div>
            <div><strong>清华大学乡村振兴工作站</strong><small>实践成员 · 2025</small></div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-flare"/><div className="contact-grid-bg"/>
          <div className="page-width contact-inner">
            <div className="section-head light"><span>04 / CONTACT</span><span>START A CONVERSATION</span></div>
            <div className="contact-main">
              <p><span className="live-dot"/> AVAILABLE FOR OPPORTUNITIES</p>
              <h2>LET'S MAKE<br/><span>SOMETHING</span><br/>MEMORABLE.</h2>
              <a href="mailto:3244693649@qq.com" className="mail-link">发送邮件 <MoveRight /></a>
            </div>
            <footer>
              <div className="brand footer-brand">YXM<span>®</span></div>
              <p>杨雪梅 · AI 视觉设计 / 品牌创意<br/>NINGBO, CHINA · 2026</p>
              <div><a href="tel:17706882979">TEL ↗</a><a href="mailto:3244693649@qq.com">EMAIL ↗</a></div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
