import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      {/* ---------- NAVBAR ---------- */}
      <nav className="home-nav">
        <div className="nav-inner">
          <img src={logo} alt="SportClub" />
          <div className="nav-links">
            <a href="#servicios" className="link">Sedes</a>
            <a href="#servicios" className="link">Servicios</a>
            <a href="#planes" className="link">Ver Planes</a>
            <Link to="/login" className="btn-ghost">Iniciar Sesión</Link>
            <Link to="/register" className="btn-gold">Regístrate</Link>
          </div>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="hero">
        <div className="hero-content">
          <span className="hero-badge">Nueva sede La Serena</span>
          <h1>Tu gimnasio,<br />tus reglas</h1>
          <p>
            Equipamiento de alto rendimiento, clases dirigidas y la mejor
            infraestructura. Inscríbete hoy con matrícula costo cero.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="cta-gold">¡Quiero entrenar!</Link>
            <a href="#servicios" className="cta-outline">Conocer el gym</a>
          </div>
        </div>
      </header>

      {/* ---------- SERVICIOS ---------- */}
      <section className="services" id="servicios">
        <div className="section-inner">
          <div className="section-title">
            <h2>Entrena a otro nivel</h2>
            <p>Diseñado para sacar tu máximo potencial</p>
          </div>

          <div className="services-grid">
            <article className="service-card">
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3 3-3 3-3-3 3-3zM5 9l3 3-3 3-3-3 3-3zM19 9l3 3-3 3-3-3 3-3zM12 16l3 3-3 3-3-3 3-3z" fill="#f5b820"/>
              </svg>
              <h3>Peso Libre y Máquinas</h3>
              <p>Equipos biomecánicos de última generación, mancuernas hasta 50kg y racks olímpicos.</p>
            </article>

            <article className="service-card">
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7.5-4.6-10-9.2C.6 8.9 2 5.5 5.2 5.5c1.9 0 3.1 1 3.8 2.1.7 1.1 1.4 1.9 3 1.9s2.3-.8 3-1.9c.7-1.1 1.9-2.1 3.8-2.1 3.2 0 4.6 3.4 3.2 6.3C19.5 16.4 12 21 12 21z" fill="#e24b4a"/>
                <path d="M5 12h3l1.5-3 2 5 1.5-2h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Zona Cardio</h3>
              <p>Trotadoras, elípticas y escaladoras con pantallas integradas para que no pierdas el ritmo.</p>
            </article>

            <article className="service-card">
              <svg className="svc-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="8.5" cy="8" r="3" fill="#2b7de9"/>
                <circle cx="16" cy="9" r="2.5" fill="#2b7de9"/>
                <path d="M3 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5v1H3v-1z" fill="#2b7de9"/>
                <path d="M14.5 20v-1c0-1.6-.5-3-1.4-4 .8-.5 1.8-.8 2.9-.8 2.6 0 4.5 1.8 4.5 4.5V20h-6z" fill="#2b7de9"/>
              </svg>
              <h3>Clases Grupales</h3>
              <p>Spinning, Zumba, CrossFit y Yoga. Más de 50 clases a la semana incluidas en tu plan.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- PLANES ---------- */}
      <section className="plans" id="planes">
        <div className="section-inner">
          <div className="section-title">
            <h2>Elige tu plan</h2>
            <p>Sin contratos amarrados. Cancela cuando quieras.</p>
          </div>

          <div className="plans-grid">
            {/* Plan Base */}
            <div className="plan base">
              <div className="plan-name">Plan Base</div>
              <div className="plan-price">$14.990<span>/mes</span></div>
              <ul>
                <li><span className="mk yes">✓</span> Acceso a sede local</li>
                <li><span className="mk yes">✓</span> Área de máquinas y peso libre</li>
                <li className="off"><span className="mk no">✕</span> Clases grupales</li>
                <li className="off"><span className="mk no">✕</span> Invitar a un amigo</li>
              </ul>
              <Link to="/register" className="plan-cta">Elegir Plan Base</Link>
            </div>

            {/* Plan Black (destacado) */}
            <div className="plan black">
              <span className="plan-tag">Más elegido</span>
              <div className="plan-name">Plan Black</div>
              <div className="plan-price">$22.990<span>/mes</span></div>
              <ul>
                <li><span className="mk yes">✓</span> Acceso a <strong>todas las sedes</strong></li>
                <li><span className="mk yes">✓</span> Área de máquinas y peso libre</li>
                <li><span className="mk yes">✓</span> Todas las clases grupales</li>
                <li><span className="mk yes">✓</span> Sillones de masajes</li>
                <li><span className="mk yes">✓</span> Invita a un amigo (5 pases/mes)</li>
              </ul>
              <Link to="/register" className="plan-cta">Unirse al Plan Black</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="home-footer" id="contacto">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={logo} alt="SportClub" />
            <p>La cadena de gimnasios con mayor crecimiento. Innovación, tecnología y resultados reales.</p>
          </div>

          <div className="footer-col">
            <h4>Enlaces Útiles</h4>
            <a href="#planes">Reglamento interno</a>
            <a href="#planes">Trabaja con nosotros</a>
            <a href="#planes">Preguntas Frecuentes</a>
          </div>

          <div className="footer-col">
            <h4>Síguenos</h4>
            <div className="footer-social">
              <a href="#contacto" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.7 9.8 2.7 10.2 2.7 12s0 2.2.1 3.4c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.4s0-2.2-.1-3.4c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8.1a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zm6.2-8.3a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
              </a>
              <a href="#contacto" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2 1.5 3.6 3.5 3.9v2.4c-1.2 0-2.4-.3-3.5-.9v6.1c0 3.1-2.5 5.6-5.6 5.6S5.3 17.6 5.3 14.5 7.8 9 10.9 9c.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-1.7 0-3 1.4-3 3.1s1.4 3.1 3 3.1 3.1-1.3 3.1-3.1V3h2.5z"/></svg>
              </a>
              <a href="#contacto" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5c-.3-1.1-1.1-1.9-2.2-2.2C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.8.5C2.1 5.6 1.3 6.4 1 7.5.5 9.4.5 12 .5 12s0 2.6.5 4.5c.3 1.1 1.1 1.9 2.2 2.2 1.9.5 8.8.5 8.8.5s6.9 0 8.8-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.9.5-4.5.5-4.5s0-2.6-.5-4.5zM9.8 15.5v-7l5.7 3.5-5.7 3.5z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SportClub. Todos los derechos reservados. Sede La Serena, Región de Coquimbo.
        </div>
      </footer>
    </div>
  );
}

export default Home;
