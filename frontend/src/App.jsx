import React, { useState, useEffect } from 'react';
import Counter from './components/Counter';

// Fallback projects database if backend fetch fails
const FALLBACK_PROJECTS = [
  {
    category: "AI · EdTech",
    filterCategory: "ai",
    title: "EduAI · Intelligent Learning Platform",
    desc: "Real-time adaptive curricula for schools, universities, and corporate training—reimagining how learners and educators engage with content.",
    status: "Active development · Global education market",
    tags: ["AI-native", "High scalability"],
    link: "https://edu-ai-sable-kappa.vercel.app/"
  },
  {
    category: "AI · Content",
    filterCategory: "ai",
    title: "Inkwell AI · Writing & Content Engine",
    desc: "Deep language models fused with brand-voice intelligence for creators, marketers, and teams needing high-fidelity content.",
    status: "Live beta · B2C & B2B",
    tags: ["Subscription & enterprise", "Content & marketing"],
    link: "https://inkwell-ten-beige.vercel.app/"
  },
  {
    category: "Fintech · Adtech",
    filterCategory: "fintech",
    title: "Pulserop · Pay-Per-Click Earnings",
    desc: "Cumulative PPC earnings engine with intelligent monetisation tools, real-time analytics, and transparent payout infrastructure.",
    status: "Revenue generating · Cumulative model",
    tags: ["Publishers & affiliates", "Fintech"]
  },
  {
    category: "AI · Creative",
    filterCategory: "ai",
    title: "StoryVerse · Interactive Storytelling",
    desc: "Immersive AI-driven storytelling where users co-create narratives, worlds, and characters for entertainment and gaming.",
    status: "In development · Entertainment tech",
    tags: ["Creator economy", "Entertainment"],
    link: "https://storyverse-liard.vercel.app/"
  },
  {
    category: "SaaS · No-code",
    filterCategory: "saas",
    title: "Aleyo · Website Builder",
    desc: "No-code/low-code website builder with AI-assisted design and copywriting for non-technical entrepreneurs and SMEs.",
    status: "MVP live · SME market",
    tags: ["Recurring SaaS revenue", "Web & SME"],
    link: "https://aleyo-3-mu.vercel.app/"
  },
  {
    category: "OCR · Fintech",
    filterCategory: "fintech",
    title: "Cheque Processor using OCR",
    desc: "Enterprise-grade OCR that automates extraction, verification, and processing of physical cheque data for banks.",
    status: "Pilot stage · Financial sector",
    tags: ["Operational cost reduction", "Banking"],
    link: "https://cheque-front-end-eight.vercel.app/home"
  },
  {
    category: "AgriTech · AI",
    filterCategory: "emerging",
    title: "Drone Camera Biomass Prediction",
    desc: "AI-powered drone imaging that predicts crop biomass, health, and yield for data-driven agricultural decisions.",
    status: "Field trials · AgriTech",
    tags: ["Precision agriculture", "AgriTech"]
  },
  {
    category: "SaaS · Operations",
    filterCategory: "saas",
    title: "Inventory Studio",
    desc: "Smart inventory management with AI-driven demand forecasting, multi-warehouse sync, and supplier intelligence.",
    status: "Beta users · Supply chain",
    tags: ["Retail & distribution", "Operations"]
  },
  {
    category: "AI · Document Processing",
    filterCategory: "ai",
    title: "Intelligent Document Processor",
    desc: "Advanced NLP and OCR to extract, classify, and process complex documents at scale for legal, insurance, and healthcare.",
    status: "Enterprise ready · Compliance-focused",
    tags: ["Reduced manual review", "Legal & healthcare"],
    link: "https://etool-s.vercel.app/"
  },
  {
    category: "AI · Productivity",
    filterCategory: "saas",
    title: "AI Kanban · Intelligent Project Board",
    desc: "Smart AI-powered Kanban board with automated task prioritisation, intelligent suggestions, and real-time project intelligence.",
    status: "Live · Productivity & project management",
    tags: ["Teams & enterprise", "SaaS · AI"],
    link: "https://smart-kanban-ashen.vercel.app/"
  }
];

export default function App() {
  // Navigation States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects States
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [filter, setFilter] = useState('all');
  const [animateGrid, setAnimateGrid] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    ticket: '',
    message: ''
  });
  const [selectedChips, setSelectedChips] = useState([]);
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error
  const [statusMessage, setStatusMessage] = useState('');

  // Fetch projects from Python backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('API failure');
        return res.json();
      })
      .then(data => {
        setProjects(data);
      })
      .catch(err => {
        console.warn('Failed to fetch from backend API. Using local fallback data.', err);
      });
  }, []);

  // Trigger grid animation whenever the filter changes
  useEffect(() => {
    setAnimateGrid(false);
    const timer = setTimeout(() => {
      setAnimateGrid(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [filter]);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle contact chips interaction
  const toggleChip = (chipName) => {
    let updatedChips = [];
    if (selectedChips.includes(chipName)) {
      updatedChips = selectedChips.filter(c => c !== chipName);
    } else {
      updatedChips = [...selectedChips, chipName];
    }
    setSelectedChips(updatedChips);

    // Update message textarea value
    const currentText = formData.message;
    // Strip previous chips text
    const baseText = currentText.split('\n[Focus areas:')[0].trim();

    const newText = updatedChips.length > 0 
      ? `${baseText}\n[Focus areas: ${updatedChips.join(', ')}]`
      : baseText;

    setFormData(prev => ({
      ...prev,
      message: newText
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    setStatusMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
        setStatusMessage(result.detail || 'Failed to submit enquiry. Verify your inputs.');
      }
    } catch (err) {
      console.warn('Backend server offline. Saving enquiry locally to browser storage...', err);
      try {
        const localEnquiries = JSON.parse(localStorage.getItem('offline_enquiries') || '[]');
        localEnquiries.push({
          ...formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('offline_enquiries', JSON.stringify(localEnquiries));
        
        setFormStatus('success');
        setStatusMessage('local_offline');
      } catch (localErr) {
        console.error('Local storage failure:', localErr);
        setFormStatus('error');
        setStatusMessage('Unable to submit enquiry. Both backend and browser storage are offline.');
      }
    }
  };

  // Filter projects helper
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.filterCategory === filter);

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="navbar neo-border">
        <div className="container nav-container">
          <a href="#" className="nav-brand">
            <div className="brand-icon">RT</div>
            <div className="brand-details">
              <h1>Revise Tech</h1>
              <p>UK Venture Builder &amp; Incubator</p>
            </div>
          </a>
          
          <ul className="nav-menu">
            <li className="nav-item"><a href="#portfolio" className="nav-link">Portfolio</a></li>
            <li className="nav-item"><a href="#why" className="nav-link">Why Invest</a></li>
            <li className="nav-item"><a href="#services" className="nav-link">Services</a></li>
            <li className="nav-item"><a href="#cases" className="nav-link">Proven Impact</a></li>
            <li className="nav-item"><a href="#contact" className="nav-link">Investor Call</a></li>
          </ul>

          <div className="nav-actions">
            <a href="#contact" className="neo-btn neo-btn-accent">Book Call →</a>
          </div>

          <button 
            className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} 
            aria-label="Toggle Navigation"
            onClick={toggleMobileMenu}
          >
            <span style={mobileMenuOpen ? { transform: 'rotate(-45deg) translate(-5px, 6px)' } : {}}></span>
            <span style={mobileMenuOpen ? { opacity: 0 } : {}}></span>
            <span style={mobileMenuOpen ? { transform: 'rotate(45deg) translate(-5px, -6px)' } : {}}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <a href="#portfolio" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
          </li>
          <li className="mobile-nav-item">
            <a href="#why" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Why Invest</a>
          </li>
          <li className="mobile-nav-item">
            <a href="#services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
          </li>
          <li className="mobile-nav-item">
            <a href="#cases" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Proven Impact</a>
          </li>
          <li className="mobile-nav-item">
            <a href="#contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Investor Call</a>
          </li>
        </ul>
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="container hero-grid-layout">
          <div>
            <div className="hero-tag"><span></span> 10 active projects · UK-based</div>
            
            <h2 className="hero-title-text">
              Back the next generation of {' '}
              <span className="highlight-blue">intelligent</span>{' '}
              technology<span className="highlight-red">.</span>
            </h2>
            
            <p className="hero-description">
              Revise Tech Ltd builds and scales a portfolio of ten production-stage AI, fintech, and SaaS products. Engineered in the UK and built for global scale.
            </p>

            <div className="hero-bullets">
              <div className="hero-bullet-card">10 Active Projects</div>
              <div className="hero-bullet-card">5+ AI-Native Products</div>
              <div className="hero-bullet-card">UK Registered &amp; Regulated</div>
            </div>

            <div className="hero-actions-container">
              <a href="#contact" className="neo-btn neo-btn-primary">Schedule Call →</a>
              <a href="#portfolio" class="neo-btn">View Portfolio</a>
            </div>
          </div>

          {/* Right Column: Interactive Mondrian Dashboard */}
          <div className="mondrian-board">
            <div className="mondrian-cell mondrian-cell-1">
              <span className="mondrian-number">
                <Counter target={10} />
              </span>
              <span className="mondrian-label">Active Portfolio Projects</span>
              <span className="mondrian-desc">Diverse incubation stage across multiple technology sectors.</span>
            </div>
            <div className="mondrian-cell mondrian-cell-2">
              <span className="mondrian-number">AI</span>
              <span className="mondrian-label">Native Core</span>
              <span className="mondrian-desc">Advanced NLP, custom LLM routing, and OCR automation.</span>
            </div>
            <div className="mondrian-cell mondrian-cell-3">
              <span className="mondrian-number">
                <Counter target={5} suffix="+" />
              </span>
              <span className="mondrian-label">AI Platforms</span>
              <span className="mondrian-desc">Live production and Beta products running today.</span>
            </div>
            <div className="mondrian-cell mondrian-cell-4">
              <span className="mondrian-number">UK</span>
              <span className="mondrian-label">Engineering</span>
            </div>
            <div className="mondrian-cell mondrian-cell-5">
              <span className="mondrian-number">
                <Counter target={12000} prefix="+" />
              </span>
              <span className="mondrian-label">Active Users</span>
              <span className="mondrian-desc">Onboarded across portfolio beta networks in under 6 months.</span>
            </div>
            <div className="mondrian-cell mondrian-cell-6">
              <span className="mondrian-label">Valuation Uplift</span>
              <span className="mondrian-desc">Secured early-stage investment slots.</span>
            </div>
            <div className="mondrian-cell mondrian-cell-7">
              <span className="mondrian-label">Tech Stack Pillars</span>
              <span className="mondrian-desc" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>React · Python · Node.js · Go</span>
            </div>
            <div className="mondrian-cell mondrian-cell-8 bg-yellow">
              <span className="mondrian-label">Opportunity Status</span>
              <span className="mondrian-desc" style={{ fontWeight: 700 }}>OPEN FOR INVESTMENT</span>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Section */}
      <section id="portfolio" className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="section-header-block">
          <div>
            <span className="section-subtitle-tag">Investment Portfolio</span>
            <h3 className="section-main-title">Ten live products in high-growth verticals.</h3>
          </div>
          <p className="section-header-desc">
            Each project is live or in active development, positioned in multi-billion-pound global markets with structured paths to scale.
          </p>
        </div>

        {/* Interactive Filters */}
        <div className="filter-bar">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Projects</button>
          <button className={`filter-btn ${filter === 'ai' ? 'active' : ''}`} onClick={() => setFilter('ai')}>AI-Native</button>
          <button className={`filter-btn ${filter === 'saas' ? 'active' : ''}`} onClick={() => setFilter('saas')}>SaaS &amp; Operations</button>
          <button className={`filter-btn ${filter === 'fintech' ? 'active' : ''}`} onClick={() => setFilter('fintech')}>Fintech &amp; Adtech</button>
          <button className={`filter-btn ${filter === 'emerging' ? 'active' : ''}`} onClick={() => setFilter('emerging')}>AgriTech &amp; Emerging</button>
        </div>

        {/* Projects Grid Container */}
        <div id="projectGrid" className="portfolio-container-grid">
          {filteredProjects.map((p, index) => {
            let headerClass = 'header-default';
            if (p.filterCategory === 'ai') headerClass = 'header-ai';
            else if (p.filterCategory === 'fintech') headerClass = 'header-fintech';
            else if (p.filterCategory === 'saas') headerClass = 'header-saas';

            return (
              <article 
                key={p.title} 
                className="project-neo-card" 
                style={{ 
                  opacity: animateGrid ? 1 : 0, 
                  transform: animateGrid ? 'translateY(0)' : 'translateY(15px)', 
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${index * 60}ms`
                }}
              >
                <div className={`project-card-header ${headerClass}`}>
                  <span>{p.category}</span>
                  <span>●</span>
                </div>
                <div className="project-card-body">
                  <h3>{p.title}</h3>
                  <p className="project-card-desc">{p.desc}</p>
                  <p className="project-card-status">{p.status}</p>
                </div>
                <div className="project-card-footer">
                  <div className="project-card-tags">
                    <span className="project-card-tag">{p.tags[0] || ''}</span>
                    <span className="project-card-tag">{p.tags[1] || ''}</span>
                  </div>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-card-action-link">Visit →</a>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Why Invest Section */}
      <section id="why" className="why-invest-section">
        <div className="container">
          <div className="section-header-block">
            <div>
              <span className="section-subtitle-tag">Why Invest</span>
              <h3 className="section-main-title">A diversified, AI-first portfolio with UK governance.</h3>
            </div>
            <p className="section-header-desc">
              Revise Tech combines verified execution with structural clarity, allowing investors to participate in a diversified technological incubator.
            </p>
          </div>

          <div className="why-grid-layout">
            <div className="why-left-grid">
              <div className="why-neo-card">
                <div className="why-icon-block">🚀</div>
                <h4>Proven Execution</h4>
                <p>Ten products actively live or in development—demonstrating our capacity to build, ship, and iterate rapidly.</p>
              </div>
              <div className="why-neo-card">
                <div className="why-icon-block">🤖</div>
                <h4>AI-First Portfolio</h4>
                <p>Over half of our active portfolio is AI-native, placing Revise Tech in the highest-growth technology segment globally.</p>
              </div>
              <div className="why-neo-card">
                <div className="why-icon-block">🌍</div>
                <h4>Diverse Markets</h4>
                <p>Broad sector exposure spanning EdTech, AgriTech, Fintech, SaaS, and document processing, spreading market risk.</p>
              </div>
              <div className="why-neo-card">
                <div className="why-icon-block">🏛️</div>
                <h4>UK Governance</h4>
                <p>Registered UK entity with clear reporting structures, standard legal frameworks, and regulatory transparency.</p>
              </div>
            </div>

            <aside className="why-sidebar-card">
              <h3>Strategic Partnership</h3>
              <p>We invite investors who provide more than funding. Network access, industry knowledge, and operational expertise are highly valued.</p>
              <ul className="why-sidebar-list">
                <li>Preferential terms for initial early-stage funding rounds.</li>
                <li>Direct connection with the founders and technical roadmap input.</li>
                <li>Detailed quarterly milestones and reporting.</li>
                <li>Co-development opportunities on future incubations.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header-block">
            <div>
              <span className="section-subtitle-tag">Premium Services</span>
              <h3 className="section-main-title">Enterprise-grade technology that scales.</h3>
            </div>
            <p className="section-header-desc">
              Beyond our incubator portfolio, we deliver expert engineering, systems consultancy, and enterprise IT supply to scale your operation.
            </p>
          </div>

          <div className="services-grid-layout">
            <div className="service-neo-card">
              <span className="service-badge">Software Engineering</span>
              <h3>Web Apps, SaaS &amp; Agents</h3>
              <p>Modern product engineering using React, Python, Go, and Node.js built for performance, security, and cloud scalability.</p>
              <ul className="service-list-block">
                <li>Custom API &amp; platform architecture</li>
                <li>AI workflow &amp; agent integration</li>
                <li>Cloud-native serverless systems</li>
              </ul>
            </div>

            <div className="service-neo-card">
              <span className="service-badge">Tech Consultancy</span>
              <h3>Cloud, DevOps &amp; Strategy</h3>
              <p>Strategic cloud consultation to optimize architectures, reduce hosting expenditures, and maximize deployment frequency.</p>
              <ul className="service-list-block">
                <li>AWS, Azure, and Google Cloud strategy</li>
                <li>Infrastructure as Code &amp; CI/CD</li>
                <li>Zero-downtime database migrations</li>
              </ul>
            </div>

            <div className="service-neo-card">
              <span className="service-badge">IT Supply</span>
              <h3>Infrastructure Procurement</h3>
              <p>Provisioning of systems and enterprise hardware, lifecycle management, and workspace rollouts with secure provisioning.</p>
              <ul className="service-list-block">
                <li>Network architecture provisioning</li>
                <li>Workstation and endpoint management</li>
                <li>Procurement &amp; warranty management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Impact Section */}
      <section id="cases" className="cases-section">
        <div className="container">
          <div className="section-header-block">
            <div>
              <span className="section-subtitle-tag">Proven Impact</span>
              <h3 className="section-main-title">Real-world results that de-risk your choice.</h3>
            </div>
            <p className="section-header-desc">
              Case studies that highlight our capacity to deliver measurable success for early-stage ventures and enterprise teams alike.
            </p>
          </div>

          <div className="cases-grid-layout">
            <div className="case-neo-card">
              <div className="case-stat">
                <Counter target={340} prefix="+" suffix="%" />
              </div>
              <div className="case-tagline">Efficiency / Startup Hypergrowth</div>
              <p>Scaled a fintech company's system capacity from 0 to 12,000 active users in 6 months utilizing AWS serverless pipelines.</p>
            </div>

            <div className="case-neo-card">
              <div className="case-stat">
                <Counter target={70} suffix="%" />
              </div>
              <div className="case-tagline">Faster / Automation &amp; DevOps</div>
              <p>Decreased time-to-deployment by 70% and reduced cloud hosting costs by 32% with customized Terraform and Kubernetes systems.</p>
            </div>

            <div className="case-neo-card">
              <div className="case-stat">
                <Counter target={400} suffix="+" />
              </div>
              <div className="case-tagline">Endpoints / Enterprise Rollout</div>
              <p>Delivered fully compliant office hardware deployment and security hardening for an enterprise organization with 400+ employees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header-block">
            <div>
              <span className="section-subtitle-tag">Investor Call</span>
              <h3 className="section-main-title">co-own the future of digital solutions.</h3>
            </div>
            <p className="section-header-desc">
              Provide your project focus areas and investment capacity, and a lead from Revise Tech will reply within 24 hours to schedule a session.
            </p>
          </div>

          <div className="contact-grid-layout">
            {formStatus === 'success' ? (
              <div className="confirmation-box" style={{ margin: '0 auto' }}>
                <div className="status-badge status-success">Enquiry Sent</div>
                <h2 className="conf-title">Thank you, {formData.name}!</h2>
                <p className="conf-desc">
                  Your enquiry has been successfully logged. An investment representative from Revise Tech Ltd will respond to your query at <strong>{formData.email}</strong> within 24 hours to schedule our discovery call.
                </p>
                {statusMessage === 'local_offline' && (
                  <p style={{ 
                    border: '2px solid #000000', 
                    backgroundColor: '#ffc800', 
                    color: '#000000', 
                    padding: '0.75rem', 
                    marginTop: '-1rem',
                    marginBottom: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '3px 3px 0px #000000',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>
                    ⚠️ Note: Server is offline. Saved locally in browser storage.
                  </p>
                )}
                <div className="conf-actions">
                  <button 
                    className="neo-btn neo-btn-primary" 
                    onClick={() => {
                      setFormStatus('idle');
                      setFormData({ name: '', email: '', org: '', ticket: '', message: '' });
                      setSelectedChips([]);
                    }}
                  >
                    Submit Another Enquiry
                  </button>
                  <a href="#portfolio" className="neo-btn">View Projects</a>
                </div>
              </div>
            ) : (
              <div className="contact-card-box">
                <h3>Schedule an Investor Call</h3>
                <p style={{ marginBottom: '1.5rem' }}>Explore our projects, technical roadmap, and investment parameters at your convenience.</p>
                
                {formStatus === 'error' && (
                  <div style={{ 
                    border: '2.5px solid #000000', 
                    backgroundColor: '#e62217', 
                    color: '#ffffff', 
                    padding: '1rem', 
                    marginBottom: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: '4px 4px 0px #000000'
                  }}>
                    {statusMessage}
                  </div>
                )}

                <form className="contact-form-layout" onSubmit={handleSubmit}>
                  <div className="form-group-field">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      className="form-input-neo" 
                      placeholder="Jane Doe" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group-field">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      className="form-input-neo" 
                      placeholder="jane@company.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-field">
                    <label htmlFor="org">Organization / Fund</label>
                    <input 
                      type="text" 
                      id="org" 
                      required 
                      className="form-input-neo" 
                      placeholder="Your firm or fund name" 
                      value={formData.org}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-field">
                    <label htmlFor="ticket">Indicative Ticket Size</label>
                    <input 
                      type="text" 
                      id="ticket" 
                      required 
                      className="form-input-neo" 
                      placeholder="e.g. £50k - £500k" 
                      value={formData.ticket}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-field form-full-width">
                    <label htmlFor="message">What would you like to discuss?</label>
                    <textarea 
                      id="message" 
                      rows="5" 
                      required 
                      className="form-textarea-neo" 
                      placeholder="Share your focus areas, timelines, or initial questions..."
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="form-full-width">
                    <button 
                      type="submit" 
                      className="neo-btn neo-btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                      disabled={formStatus === 'loading'}
                    >
                      {formStatus === 'loading' ? 'Submitting...' : 'Submit Enquiry →'}
                    </button>
                  </div>
                </form>

                <p className="contact-meta-note">
                  Prefer direct channels? Email us directly at <a href="mailto:alexander@revise-tech.co.uk">alexander@revise-tech.co.uk</a>.
                </p>
              </div>
            )}

            {/* Sidebar block */}
            <div className="contact-sidebar-flow">
              <div className="contact-sidebar-block">
                <h4>Quick Topics</h4>
                <p style={{ marginBottom: '0.75rem' }}>Click topics to append them to your enquiry details:</p>
                <div className="contact-chips-wrap">
                  <button 
                    type="button"
                    className={`contact-chip-toggle ${selectedChips.includes('Portfolio Walkthrough') ? 'active' : ''}`}
                    onClick={() => toggleChip('Portfolio Walkthrough')}
                  >
                    Portfolio Walkthrough
                  </button>
                  <button 
                    type="button"
                    className={`contact-chip-toggle ${selectedChips.includes('Product Deep-Dives') ? 'active' : ''}`}
                    onClick={() => toggleChip('Product Deep-Dives')}
                  >
                    Product Deep-Dives
                  </button>
                  <button 
                    type="button"
                    className={`contact-chip-toggle ${selectedChips.includes('Term Sheet Details') ? 'active' : ''}`}
                    onClick={() => toggleChip('Term Sheet Details')}
                  >
                    Term Sheet Details
                  </button>
                  <button 
                    type="button"
                    className={`contact-chip-toggle ${selectedChips.includes('Q&A With Founders') ? 'active' : ''}`}
                    onClick={() => toggleChip('Q&A With Founders')}
                  >
                    Q&amp;A With Founders
                  </button>
                </div>
              </div>

              <div className="contact-sidebar-block">
                <h4>Incubator Alignment</h4>
                <p>We are particularly aligned with strategic partners containing industry roots in AI development, SaaS operations, regulated finance, or legal tech.</p>
              </div>

              <div className="contact-sidebar-block">
                <h4>Meeting Medium</h4>
                <p>First discovery meetings are held via Google Meet, Microsoft Teams, or in-person at our central London offices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="neo-footer">
        <div className="container footer-content">
          <span className="footer-copyright">
            © 2026 Revise Tech Ltd — All trademarks and intellectual property belong to their respective owners.
          </span>
          <div className="footer-links-row">
            <a href="#portfolio" className="footer-link-item">Portfolio</a>
            <a href="#why" className="footer-link-item">Why Invest</a>
            <a href="#services" className="footer-link-item">Services</a>
            <a href="#contact" className="footer-link-item">Call</a>
          </div>
        </div>
      </footer>
    </>
  );
}
