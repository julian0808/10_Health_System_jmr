"use client";

import { useMemo, useState } from "react";

type Patient = {
  id: number;
  name: string;
  initials: string;
  color: string;
  condition: string;
  doctor: string;
  room: string;
  status: "Stable" | "Monitoring" | "Needs review";
  admitted: string;
};

const initialPatients: Patient[] = [
  { id: 1, name: "Ava Rodriguez", initials: "AR", color: "coral", condition: "Post-op recovery", doctor: "Dr. Maya Chen", room: "04-B", status: "Stable", admitted: "Today, 08:42" },
  { id: 2, name: "Marcus Thompson", initials: "MT", color: "blue", condition: "Cardiac observation", doctor: "Dr. Eli Warren", room: "12-A", status: "Monitoring", admitted: "Today, 07:18" },
  { id: 3, name: "Sofia Patel", initials: "SP", color: "gold", condition: "Respiratory care", doctor: "Dr. Maya Chen", room: "07-C", status: "Needs review", admitted: "Yesterday, 19:34" },
  { id: 4, name: "Noah Williams", initials: "NW", color: "green", condition: "Orthopedic recovery", doctor: "Dr. Theo Brooks", room: "18-D", status: "Stable", admitted: "Yesterday, 16:11" },
  { id: 5, name: "Liam Okafor", initials: "LO", color: "purple", condition: "Neurology consult", doctor: "Dr. Priya Shah", room: "09-A", status: "Monitoring", admitted: "Yesterday, 14:56" },
];

const slides = [
  { eyebrow: "Clinical focus", title: "Make every handoff count.", body: "One clear view for the people caring for your patients today.", accent: "teal", metric: "98.6%", metricLabel: "care plan completion" },
  { eyebrow: "Team pulse", title: "The right context, right when it matters.", body: "Surface the signals that help your team move with confidence.", accent: "coral", metric: "24 min", metricLabel: "average response time" },
  { eyebrow: "Patient first", title: "Calm systems make better care.", body: "Less searching. More time for thoughtful, human care.", accent: "gold", metric: "4.9/5", metricLabel: "patient experience" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 3 2 5-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-2v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 9.6 15a1.7 1.7 0 0 0-1.55-1H8v-2h.05a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V6h2v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06A1.7 1.7 0 0 0 19.4 11c.16.6.7 1 1.55 1H21v2h-.05a1.7 1.7 0 0 0-1.55 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    moon: <path d="M20.8 15.3A8.5 8.5 0 0 1 8.7 3.2 8.5 8.5 0 1 0 20.8 15.3Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">{paths[name]}</svg>;
}

export default function Home() {
  const [patients, setPatients] = useState(initialPatients);
  const [slide, setSlide] = useState(0);
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All patients");
  const [modal, setModal] = useState<"create" | Patient | null>(null);

  const visiblePatients = useMemo(() => patients.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.condition} ${patient.doctor}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All patients" || patient.status === status;
    return matchesQuery && matchesStatus;
  }), [patients, query, status]);

  const activeSlide = slides[slide];
  const navigateTo = (section: string) => {
    setActiveSection(section);
    window.history.replaceState(null, "", section === "Overview" ? "#overview" : `#${section.toLowerCase()}`);
    window.setTimeout(() => document.getElementById(section === "Patients" ? "patients" : section.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };
  const savePatient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const condition = String(form.get("condition"));
    const doctor = String(form.get("doctor"));
    const room = String(form.get("room"));
    if (!name || !condition || !doctor || !room) return;
    if (modal && typeof modal !== "string") {
      setPatients((current) => current.map((patient) => patient.id === modal.id ? { ...patient, name, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2), condition, doctor, room } : patient));
    } else {
      setPatients((current) => [{ id: Date.now(), name, initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2), color: "teal", condition, doctor, room, status: "Stable", admitted: "Just now" }, ...current]);
    }
    setModal(null);
  };

  return (
    <main className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => navigateTo("Overview")} aria-label="PulseCare home"><span className="brand-mark">+</span><span>pulse<span>care</span></span></a>
        <div className="workspace-label">Workspace</div>
        <nav aria-label="Workspace navigation">
          <button className={`nav-link ${activeSection === "Overview" ? "active" : ""}`} onClick={() => navigateTo("Overview")}><Icon name="grid" />Overview</button>
          <button className={`nav-link ${activeSection === "Patients" ? "active" : ""}`} onClick={() => navigateTo("Patients")}><Icon name="users" />Patients<span className="nav-count">{patients.length + 19}</span></button>
          <button className={`nav-link ${activeSection === "Schedule" ? "active" : ""}`} onClick={() => navigateTo("Schedule")}><Icon name="calendar" />Schedule</button>
          <button className={`nav-link ${activeSection === "Insights" ? "active" : ""}`} onClick={() => navigateTo("Insights")}><Icon name="chart" />Insights</button>
        </nav>
        <div className="nav-bottom"><a className="nav-link" href="#settings"><Icon name="settings" />Settings</a></div>
        <div className="profile"><div className="avatar avatar-teal">JM</div><div><strong>Julian Mesa Restrepo</strong><span>Administrator</span></div><span className="profile-dot" /></div>
      </aside>
      <section className="content">
        <header className="topbar"><a className="mobile-brand" href="#overview" onClick={() => navigateTo("Overview")} aria-label="PulseCare home"><span className="brand-mark">+</span>pulsecare</a><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="top-actions"><button className="icon-button" aria-label="Search"><Icon name="search" /></button><button className="icon-button notification" aria-label="Notifications"><Icon name="bell" /><i /></button><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode"><Icon name={dark ? "sun" : "moon"} /></button></div></header>
        <div className="inner">
          <section className={`hero hero-${activeSlide.accent}`} id="overview"><div className="hero-copy"><div className="eyebrow">{activeSlide.eyebrow} <span className="live-dot" /> Live overview</div><h1>{activeSlide.title}</h1><p>{activeSlide.body}</p><button className="hero-action" onClick={() => { navigateTo("Patients"); document.getElementById("patients")?.scrollIntoView({ behavior: "smooth" }); }}>View patient records <Icon name="arrow" /></button></div><div className="hero-visual"><div className="orb orb-large" /><div className="orb orb-small" /><div className="hero-metric"><strong>{activeSlide.metric}</strong><span>{activeSlide.metricLabel}</span></div><div className="crosshair">+</div></div><div className="slider-controls"><button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Previous slide">&#8592;</button><div className="slide-dots">{slides.map((item, index) => <button key={item.title} className={index === slide ? "selected" : ""} onClick={() => setSlide(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><button onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Next slide">&#8594;</button></div></section>
          {activeSection === "Schedule" && <section className="workspace-view" id="schedule"><div className="view-heading"><div><span className="section-kicker">Monday, September 08</span><h2>Today&apos;s schedule</h2></div><button className="primary-button"><Icon name="plus" />Book appointment</button></div><div className="schedule-list"><div className="schedule-item"><span className="schedule-time">09:30</span><div><strong>Ward round</strong><span>Dr. Maya Chen · North wing</span></div><span className="schedule-tag live">In progress</span></div><div className="schedule-item"><span className="schedule-time">11:00</span><div><strong>Care team sync</strong><span>Conference room 2 · 8 attendees</span></div><span className="schedule-tag">Upcoming</span></div><div className="schedule-item"><span className="schedule-time">14:15</span><div><strong>Specialist consultations</strong><span>3 patients · Outpatient clinic</span></div><span className="schedule-tag">Upcoming</span></div></div></section>}
          {activeSection === "Insights" && <section className="workspace-view" id="insights"><div className="view-heading"><div><span className="section-kicker">Performance snapshot</span><h2>Care insights</h2></div><span className="insight-period">Last 30 days ▾</span></div><div className="insight-grid"><div className="insight-card"><span className="stat-label">Average length of stay</span><strong>3.8 <small>days</small></strong><span className="stat-trend up">↓ 8.4% <small>vs previous period</small></span></div><div className="insight-card"><span className="stat-label">Readmission rate</span><strong>4.2<span>%</span></strong><span className="stat-trend up">↓ 1.1% <small>vs previous period</small></span></div><div className="insight-card insight-chart"><span className="stat-label">Patient volume</span><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><span className="chart-labels"><small>W1</small><small>W2</small><small>W3</small><small>W4</small></span></div></div></section>}
          <section className="section-header"><div><span className="section-kicker">Monday, September 08, 2025</span><h2>Good morning, Julian <span>✦</span></h2></div><button className="primary-button" onClick={() => setModal("create")}><Icon name="plus" />Add patient</button></section>
          <section className="stats-grid"><div className="stat-card"><span className="stat-label">Total patients</span><strong>{patients.length + 19}</strong><span className="stat-trend up">+12.5% <small>vs last week</small></span><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i className="tall" /></div></div><div className="stat-card"><span className="stat-label">In care today</span><strong>18</strong><span className="stat-trend up">+4.2% <small>vs yesterday</small></span><div className="pulse-line" /></div><div className="stat-card"><span className="stat-label">Needs attention</span><strong>03</strong><span className="stat-trend down">-2 cases <small>since morning</small></span><div className="attention-dots"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="stat-card capacity"><span className="stat-label">Bed capacity</span><strong>76<span>%</span></strong><span className="stat-trend neutral">19 beds available</span><div className="capacity-track"><i /></div></div></section>
          <section className="records-section" id="patients"><div className="records-heading"><div><span className="section-kicker">Care directory</span><h2>Patient records</h2></div><button className="text-button">View all <Icon name="arrow" /></button></div><div className="table-toolbar"><div className="search-box"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients, conditions..." /></div><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter patients by status"><option>All patients</option><option>Stable</option><option>Monitoring</option><option>Needs review</option></select><button className="filter-button">Filter <span>☷</span></button></div><div className="table-wrap"><table><thead><tr><th>Patient</th><th>Condition</th><th>Assigned doctor</th><th>Room</th><th>Status</th><th>Admitted</th><th /></tr></thead><tbody>{visiblePatients.map((patient) => <tr key={patient.id}><td><div className="patient-cell"><div className={`avatar avatar-${patient.color}`}>{patient.initials}</div><strong>{patient.name}</strong></div></td><td>{patient.condition}</td><td>{patient.doctor}</td><td className="room">{patient.room}</td><td><span className={`status status-${patient.status.toLowerCase().replace(" ", "-")}`}><i />{patient.status}</span></td><td className="muted">{patient.admitted}</td><td><button className="edit-button" onClick={() => setModal(patient)}>Edit</button></td></tr>)}</tbody></table>{visiblePatients.length === 0 && <div className="empty-state">No patients match your search.</div>}</div></section>
        </div>
      </section>
      {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><form className="modal" onSubmit={savePatient}><div className="modal-header"><div><span className="section-kicker">Care directory</span><h2>{typeof modal === "string" ? "Add patient" : "Edit patient"}</h2></div><button type="button" className="icon-button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" /></button></div><label>Patient name<input name="name" defaultValue={typeof modal === "string" ? "" : modal.name} placeholder="e.g. Ava Rodriguez" /></label><label>Condition<input name="condition" defaultValue={typeof modal === "string" ? "" : modal.condition} placeholder="e.g. Post-op recovery" /></label><label>Assigned doctor<input name="doctor" defaultValue={typeof modal === "string" ? "" : modal.doctor} placeholder="e.g. Dr. Maya Chen" /></label><label>Room<input name="room" defaultValue={typeof modal === "string" ? "" : modal.room} placeholder="e.g. 04-B" /></label><button className="primary-button submit" type="submit">{typeof modal === "string" ? "Create patient" : "Save changes"}</button></form></div>}
    </main>
  );
}
