import { useEffect, useRef, useState } from 'react';
import { projects } from './data/projects.js';
import { useRevealOnScroll } from './hooks/useRevealOnScroll.js';
import { useParallax } from './hooks/useParallax.js';

const socials = [
  {
    id: 'discord',
    label: 'Discord',
    href: 'https://discordapp.com/users/auri',
    handle: '@auri.dev',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20.5 4.5c-1.6-.8-3.2-1.4-4.8-1.7-.2.4-.4.9-.6 1.4-1.8-.3-3.6-.3-5.4 0-.2-.5-.4-1-.6-1.4-1.6.3-3.2.9-4.8 1.7C1.7 9.1.8 13.6 1.3 18.1c1.7 1.2 3.4 2.1 5.2 2.7.4-.6.8-1.2 1.1-1.9-.6-.2-1.1-.5-1.7-.8.1-.1.2-.3.3-.4 3.2 1.5 6.8 1.5 10 0 .1.1.2.3.3.4-.5.3-1.1.6-1.7.8.3.7.7 1.3 1.1 1.9 1.8-.6 3.5-1.5 5.2-2.7.5-4.5-.4-9-3-13.6Zm-11 10.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/willube',
    handle: 'github.com/willube',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 .5C5.6.5.4 5.7.4 12.1c0 5.1 3.3 9.5 7.9 11 .6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.3 1.1-3.2-.1-.3-.5-1.6.1-3.3 0 0 .9-.3 3 .1.9-.3 1.8-.4 2.7-.4.9 0 1.8.1 2.7.4 2.1-.4 3-.1 3-.1.6 1.7.2 3 .1 3.3.7.9 1.1 1.9 1.1 3.2 0 4.7-2.8 5.7-5.4 6 .4.4.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.9 7.9-11C23.6 5.7 18.4.5 12 .5Z"
          fill="currentColor"
        />
      </svg>
    )
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    href: 'https://soundcloud.com/auri',
    handle: 'soundcloud.com/auri',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.5 15.8c.2 0 .4-.2.4-.4V9.7a.4.4 0 0 0-.8 0v5.7c0 .2.2.4.4.4Zm1.6 0c.2 0 .4-.2.4-.4V9.4a.4.4 0 0 0-.8 0v6c0 .2.2.4.4.4Zm1.6 0c.2 0 .4-.2.4-.4V9a.4.4 0 0 0-.8 0v6.4c0 .2.2.4.4.4Zm1.7 0c.2 0 .4-.2.4-.4V8.2a.4.4 0 0 0-.8 0v7.2c0 .2.2.4.4.4ZM11 15.8c.2 0 .4-.2.4-.4V6.9a.4.4 0 0 0-.8 0v8.5c0 .2.2.4.4.4Zm9.7-.2c1.6 0 3-1.3 3-3 0-1.7-1.4-3-3-3-.4 0-.8.1-1.1.2a4 4 0 0 0-3.9-3.4c-.7 0-1.3.2-1.9.4v8.6h6.9Z"
          fill="currentColor"
        />
      </svg>
    )
  }
];

const highlightTags = [
  '19 Jahre',
  'Full-Stack Developer',
  'Security Research',
  'Roblox Scripting',
  'FL Studio',
  'Synthwave ✦ Cyberpunk',
  'System Automation'
];

const milestones = [
  {
    title: 'Security Lab Praktikum',
    meta: '2024 – 2025 · Berlin',
    description:
      'Threat Hunting, Incident Response Playbooks und Pentesting-Automatisierung für Startups, die Zero-Trust ernst meinen.'
  },
  {
    title: 'Roblox Creator Collective',
    meta: '2023 · Remote',
    description:
      'Community-driven Scripting-Workshops mit über 2.000 Teilnehmenden, Live-Coding und eigenem Asset-Marktplatz.'
  },
  {
    title: 'Producer & Mixing Engineer',
    meta: 'seit 2021 · Worldwide',
    description:
      'Genre-fluid Beats, Dolby Atmos Mixdowns und Sample Packs, die zwischen Chillwave und Hardwave oszillieren.'
  }
];

function SectionBadge({ icon, children }) {
  return (
    <span className="section__badge">
      <span aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

export default function App() {
  const glowRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  useRevealOnScroll();
  useParallax(glowRef, 0.12);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!formStatus) return undefined;
    const timeout = window.setTimeout(() => setFormStatus(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [formStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.email || !payload.message) {
      setFormStatus({ type: 'error', text: 'Bitte fülle alle Felder aus. ✦' });
      return;
    }

    setFormStatus({ type: 'success', text: 'Danke! Deine Nachricht ist auf dem Weg zu Auri.' });
    event.currentTarget.reset();
  };

  return (
    <div className="app">
      <div className="app__glow-sphere" ref={glowRef} aria-hidden="true" />

      <div className={`loader-overlay ${isReady ? 'is-hidden' : ''}`} aria-hidden={isReady}>
        <div className="loader" role="status" aria-label="Portfolio wird geladen" />
      </div>

      <header className="top-bar">
        <div className="top-bar__inner">
          <a className="brand" href="#top">
            <span className="brand__badge">A</span>
            <span>Auri Studio</span>
          </a>
          <nav className="nav-links" aria-label="Hauptnavigation">
            <a href="#projects">Projekte</a>
            <a href="#about">Über mich</a>
            <a href="#contact">Kontakt</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="section-container hero__inner">
            <article className="hero__card fade-section">
              <span className="hero__badge">developer ✦ producer ✦ security</span>
              <h1 className="hero__title">Hey, ich bin Auri – Entwickler, Musikproduzent & Security-Enthusiast.</h1>
              <p className="hero__subtitle">
                Ich baue immersive Web-Erlebnisse, sichere Systeme und pulsierende Soundwelten. Zwischen Code-Automation, Roblox-Universen und
                FL Studio Sessions halte ich Tech und Kunst im Gleichgewicht.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#projects">Projekte ansehen</a>
                <a className="button button--ghost" href="#contact">Kontakt aufnehmen</a>
              </div>
            </article>

            <aside className="avatar-card fade-section" aria-label="Virtuelles Portrait von Auri">
              <div className="avatar-card__inner">
                <span className="avatar-card__initials">AU</span>
              </div>
            </aside>
          </div>
        </section>

        <section id="about" className="section fade-section">
          <div className="section-container">
            <SectionBadge icon="✹">Über mich</SectionBadge>
            <div className="section__heading-group">
              <h2 className="section__title">Code, Culture &amp; Cyber Sicherheit</h2>
              <p className="section__lead">
                Ich bin Auri, 19 Jahre jung, aufgewachsen in Berlin und getrieben von neugieriger Energie. Meine Welt besteht aus Full-Stack-
                Entwicklung, Systemsicherheit und Musikproduktion – oft alles gleichzeitig. Ich liebe es, aus ungewöhnlichen Ideen zuverlässige
                Experiences zu bauen.
              </p>
            </div>

            <div className="about__grid">
              <div className="about-card">
                <h3>Was mich antreibt</h3>
                <p>
                  Egal ob Browser, Roblox oder Studio – ich suche nach cleanen, skalierbaren Lösungen mit einem Hauch Future Nostalgia. Ich arbeite
                  hands-on, iterativ und gerne mit Menschen, die genauso für Tech und Sound brennen.
                </p>
                <div className="tag-grid">
                  {highlightTags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="about-card">
                <h3>Milestones &amp; Highlights</h3>
                <div className="timeline" role="list">
                  {milestones.map((milestone) => (
                    <article className="timeline__item" role="listitem" key={milestone.title}>
                      <span className="timeline__meta">{milestone.meta}</span>
                      <h4 className="timeline__title">{milestone.title}</h4>
                      <p className="timeline__description">{milestone.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section fade-section">
          <div className="section-container">
            <SectionBadge icon="▣">Projekte</SectionBadge>
            <h2 className="section__title">Ausgewählte Arbeiten</h2>
            <p className="section__lead">Ein Mix aus Web-Apps, Roblox-Experiences, Security-Tooling und Sounddesign-Projekten.</p>

            <div className="projects__grid" role="list">
              {projects.map((project) => (
                <article className="project-card" role="listitem" key={project.id}>
                  <a className="project-thumb" href={project.url} target="_blank" rel="noreferrer" aria-label={`Projekt ${project.title}`}>
                    <img src={project.image} alt="Projektillustration" loading="lazy" />
                  </a>
                  <div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <div className="stack-list" aria-label="Technologien">
                    {project.tech.map((tech) => (
                      <span className="stack-chip" key={`${project.id}-${tech}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="more-projects">
              <a href="https://github.com/willube?tab=repositories" target="_blank" rel="noreferrer">
                Mehr anzeigen
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section fade-section">
          <div className="section-container contact-section">
            <div className="contact-card">
              <SectionBadge icon="✉">Kontakt</SectionBadge>
              <h2 className="section__title">Sag Hallo.</h2>
              <p className="contact-card__lead">
                Lass uns über dein nächstes Projekt sprechen – sichere Apps, immersive Games oder neue Soundscapes. Ich antworte innerhalb von 48
                Stunden.
              </p>
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  Name
                  <input name="name" type="text" placeholder="Wie heißt du?" autoComplete="name" required />
                </label>
                <label>
                  E-Mail
                  <input name="email" type="email" placeholder="dein.name@email.com" autoComplete="email" required />
                </label>
                <label>
                  Nachricht
                  <textarea name="message" placeholder="Worum geht es?" required />
                </label>
                <button type="submit" className="button button--primary">
                  Nachricht senden
                </button>
                {formStatus && (
                  <p role="status" className={`form-status form-status--${formStatus.type}`}>
                    {formStatus.text}
                  </p>
                )}
              </form>
            </div>

            <div className="contact-meta" aria-label="Weitere Kontaktmöglichkeiten">
              {socials.map((social) => (
                <div className="contact-meta__item" key={social.id}>
                  {social.icon}
                  <div>
                    <span>{social.label}</span>
                    <a href={social.href} target="_blank" rel="noreferrer">
                      {social.handle}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__links">
            <a href="#top">Zurück nach oben</a>
            <a href="#projects">Projekte</a>
            <a href="#contact">Kontakt</a>
          </div>
          <span>© {new Date().getFullYear()} Auri Studio. Crafted with Herzblut &amp; Future Nostalgia.</span>
        </div>
      </footer>
    </div>
  );
}
