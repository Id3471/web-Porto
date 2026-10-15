import { useTypewriter } from "../../hooks";
import { usePortfolio } from "../../hooks/usePortfolio";
import { portfolioApiUrl } from "../../data/portfolioApi";
import { Button } from "../ui";
import "./Hero.css";

function CodeCard({ profile }) {
  const lines = [
    {
      n: 1,
      code: [
        { t: "const ", c: "kw" },
        { t: "dev", c: "var" },
        { t: " = {", c: "p" },
      ],
    },
    {
      n: 2,
      code: [
        { t: "  nom", c: "prop" },
        { t: ": ", c: "p" },
        { t: `'${profile.firstName}'`, c: "str" },
        { t: ",", c: "p" },
      ],
    },
    {
      n: 3,
      code: [
        { t: "  role", c: "prop" },
        { t: ": ", c: "p" },
        { t: `'${profile.role}'`, c: "str" },
        { t: ",", c: "p" },
      ],
    },
    {
      n: 4,
      code: [
        { t: "  stack", c: "prop" },
        { t: ": [", c: "p" },
        { t: "'React'", c: "str" },
        { t: ", ", c: "p" },
        { t: "'Node'", c: "str" },
        { t: ", ", c: "p" },
        { t: "'Laravel'", c: "str" },
        { t: "],", c: "p" },
      ],
    },
    {
      n: 5,
      code: [
        { t: "  base", c: "prop" },
        { t: ": ", c: "p" },
        { t: `'${profile.location}'`, c: "str" },
        { t: ",", c: "p" },
      ],
    },
    {
      n: 6,
      code: [
        { t: "  dispo", c: "prop" },
        { t: ": ", c: "p" },
        { t: "true", c: "kw" },
        { t: ",", c: "p" },
      ],
    },
    { n: 7, code: [{ t: "}", c: "p" }] },
    { n: 8, code: [] },
    {
      n: 9,
      code: [
        { t: "export", c: "kw" },
        { t: " default", c: "kw" },
        { t: " dev", c: "var" },
        { t: ";", c: "p" },
      ],
    },
  ];

  const colors = {
    kw: "var(--accent-2)",
    var: "var(--text)",
    prop: "var(--text-soft)",
    str: "#fbbf24",
    p: "var(--text-faint)",
  };

  return (
    <div className="hero__code-card" aria-hidden="true">
      <div className="hero__code-bar">
        <span className="dot dot--red" />
        <span className="dot dot--yellow" />
        <span className="dot dot--green" />
        <span className="hero__code-file mono">dev.js</span>
      </div>
      <pre className="hero__code mono">
        {lines.map((line) => (
          <div key={line.n} className="hero__code-line">
            <span className="hero__code-num">{line.n}</span>
            <span>
              {line.code.map((seg, i) => (
                <span key={i} style={{ color: colors[seg.c] }}>
                  {seg.t}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export default function Hero() {
  const { profile, projects, skillGroups } = usePortfolio()
  const typed = useTypewriter(profile.roles);

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="hero__glow hero__glow--1" aria-hidden="true" />
      <div className="hero__glow hero__glow--2" aria-hidden="true" />

      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__badge">
            <span className="hero__badge-dot" />
            Disponible pour de nouvelles opportunités
          </span>

          <h1 className="hero__title">
            Bonjour, je suis <span className="gradient-text">{profile.firstName}</span>
            <span className="hero__title-role mono">
              {typed}
              <span className="hero__caret" aria-hidden="true">
                |
              </span>
            </span>
          </h1>

          <p className="hero__subtitle">
            {profile.summary}
          </p>

          <div className="hero__actions">
            <Button href="#projects" icon="arrowRight" iconPosition="right">
              Voir mes projets
            </Button>
            <Button href="#contact" variant="outline">
              Me contacter
            </Button>
            {profile.cvUrl ? (
              <Button href={portfolioApiUrl('/cv')} variant="outline" download>
                Télécharger mon CV
              </Button>
            ) : (
              <Button variant="outline" disabled title="Le CV sera disponible après son ajout dans l’administration">
                CV bientôt disponible
              </Button>
            )}
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>{skillGroups.reduce((total, group) => total + group.items.length, 0)}+</strong>
              <span>Technologies maîtrisées</span>
            </div>
            <div className="hero__stat">
              <strong>{projects.length}+</strong>
              <span>Projets réalisés</span>
            </div>
            <div className="hero__stat">
              <strong>{profile.languages.length}</strong>
              <span>Langues parlées</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <CodeCard profile={profile} />
        </div>
      </div>

      <a
        href="#about"
        className="hero__scroll mono"
        aria-label="Défiler vers À propos"
      >
        scroll
        <span className="hero__scroll-line" />
      </a>
    </section>
  );
}
