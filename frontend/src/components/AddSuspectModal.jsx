import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldAlert, 
  FileText, 
  Layers, 
  Phone, 
  Truck, 
  CreditCard, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2,
  Scale
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    label: "🔫 Arms Smuggling Operative",
    data: {
      name: "Vikram 'Vicky' Singh",
      aliases: ["V. Singh", "Vicky Shooter", "Kallu"],
      role: "Inter-State Firearms Courier & Armorer",
      threat_score: 0.84,
      age: 34,
      gender: "Male",
      cctns_id: "WB-CCTNS-2026-22910",
      crime_title: "Inter-State Munger Firearms Trunk Pipeline & Cache Supply",
      crime_category: "Armed Weapon Trafficking & Syndicate Logistics",
      incident_narrative: "Suspect procured 12 semi-automatic country-made pistols and 120 rounds from Munger illegal ordnance caches and transported them concealed inside modified heavy freight truck chassis across the Jharkhand-Bengal border to supply Tariq Al-Hasani's enforcement wing.",
      modus_operandi: "Operates with concealed hydraulic false bottoms in cargo trucks; switches between three disposable SIMs and communicates only via coded audio memos.",
      seized_contraband: "12x 9mm Country-made Semi-Automatic Pistols, 120 live cartridges, Tata 407 truck (WB-25-A-4431), 3 burner phones",
      statutory_acts: [
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 111",
          title: "Organized Crime Syndicate Offence",
          explanation: "Continuous trafficking of illegal weaponry in coordination with syndicate kingpin Tariq Al-Hasani."
        },
        {
          act: "Arms Act 1959",
          section: "Section 25(1AA) & 25(1A)",
          title: "Trafficking of Prohibited Arms & Ammunition",
          explanation: "Inter-state manufacturing, procurement, and transport of prohibited high-caliber firearms."
        },
        {
          act: "Bharatiya Sakshya Adhiniyam (BSA) 2024",
          section: "Section 63",
          title: "Admissibility of Electronic Logs & GPS Traces",
          explanation: "Cryptographically verified toll ANPR hits and CDR triangulation across NH-2 corridor."
        }
      ],
      fir_number: "FIR-2026/118/WB-ASN",
      police_station: "Asansol Industrial Crime Thana",
      incident_date: "2026-08-27 22:45 IST",
      incident_locus: "NH-2 Barakar Checkpost, Paschim Bardhaman",
      case_status: "Non-Bailable Warrant Active / Vehicle Impounded",
      phone_numbers: ["+919875114422", "+919830559900"],
      vehicle_plates: ["WB-25-A-4431", "JH-05-BC-8899"],
      bank_accounts: ["602011993344"],
      upi_ids: ["vickyarms@ybl"],
      locations: ["Asansol Border Depot", "Barakar Highway Warehouse"],
      known_associates: ["PERSON_001", "PERSON_003"],
      associate_relation: "COLLABORATES_WITH"
    }
  },
  {
    label: "💼 Hawala Laundering Mule",
    data: {
      label: "Hawala",
      name: "Ramesh 'Cashier' Agarwal",
      aliases: ["R. K. Agarwal", "Babu Ji"],
      role: "Hawala Cash Courier & Gold Bullion Transporter",
      threat_score: 0.74,
      age: 47,
      gender: "Male",
      cctns_id: "WB-CCTNS-2026-31045",
      crime_title: "Burrabazar Gold Bullion & Angadia Hawala Channel",
      crime_category: "Financial Fraud, Hawala & PMLA Offence",
      incident_narrative: "Collected and disbursed unaccounted cash tranches totaling ₹2.8 Crore across Burrabazar jewelry clearing houses on behalf of Sunil Roy. Converted cash into 24-karat untraceable gold biscuits to facilitate illegal overseas remittance.",
      modus_operandi: "Used coded token currency notes (₹10 serial matching) for cash handoffs; split physical currency into sealed tea packet bundles.",
      seized_contraband: "₹48,50,000 unaccounted cash in sealed packets, 4 gold bars (400g), token note records ledger",
      statutory_acts: [
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 316",
          title: "Criminal Breach of Trust",
          explanation: "Misappropriating commercial trading accounts for illegal syndicate cash remittance."
        },
        {
          act: "Prevention of Money Laundering Act (PMLA) 2002",
          section: "Section 3",
          title: "Money Laundering & Concealment of Proceeds",
          explanation: "Converting illegal extortion proceeds into gold bullion and routing through angadia networks."
        }
      ],
      fir_number: "FIR-2026/142/WB-BUR",
      police_station: "Burrabazar Special Economic Offence Thana",
      incident_date: "2026-08-26 14:15 IST",
      incident_locus: "Cotton Street Angadia Hub, Burrabazar, Kolkata",
      case_status: "Arrested with Cash / Remand in Progress",
      phone_numbers: ["+919831448822"],
      vehicle_plates: ["WB-01-AX-9912"],
      bank_accounts: ["401022881144"],
      upi_ids: ["ragarwal@okicici"],
      locations: ["Burrabazar Safe Vault"],
      known_associates: ["PERSON_002"],
      associate_relation: "OPERATES_UNDER"
    }
  },
  {
    label: "💻 Cyber Syndicate Operator",
    data: {
      name: "Aman 'GhostByte' Verma",
      aliases: ["A. Verma", "Cipher09"],
      role: "Synthetic Identity & Deepfake Extortion Developer",
      threat_score: 0.79,
      age: 27,
      gender: "Male",
      cctns_id: "WB-CCTNS-2026-40912",
      crime_title: "AI Deepfake Officer Impersonation & Digital Arrest Scam",
      crime_category: "Cyber Extortion & Telecom Gateway Fraud",
      incident_narrative: "Developed AI voice clones and fake video streams mimicking senior CBI/ED officers to orchestrate 'digital arrest' video extortion calls against vulnerable citizens, siphoning ₹85 Lakh into mule UPI handles within 48 hours.",
      modus_operandi: "Hosted phishing landing pages on bulletproof Russian servers; routed incoming VoIP traffic through Kolkata SIM-boxes controlled by Imran Sheikh.",
      seized_contraband: "2x High-end Alienware Laptops, 4 External SSDs containing voice training models, ₹18 Lakh crypto USDT",
      statutory_acts: [
        {
          act: "Information Technology Act 2000",
          section: "Section 66D",
          title: "Cheating by Personation using Computer Resource",
          explanation: "Impersonating law enforcement officers via synthetic deepfake video calls."
        },
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 318",
          title: "Cheating & Extortion by Deceit",
          explanation: "Fraudulently coercing victims under fear of fabricated legal arrest."
        }
      ],
      fir_number: "FIR-2026/155/WB-CYB",
      police_station: "West Bengal State Cyber Crime Cell",
      incident_date: "2026-08-25 18:30 IST",
      incident_locus: "Salt Lake Sector V Tech Hub",
      case_status: "Digital Forensics Image Created / Under Analysis",
      phone_numbers: ["+919874005511"],
      vehicle_plates: ["WB-06-Q-7722"],
      bank_accounts: ["201099448833"],
      upi_ids: ["amanbyte@okaxis"],
      locations: ["Salt Lake Server Room"],
      known_associates: ["PERSON_004"],
      associate_relation: "COLLABORATES_WITH"
    }
  }
];

export default function AddSuspectModal({ isOpen, onClose, onSuspectAdded, existingSuspects = [], prefilledData = null }) {
  const [activeTab, setActiveTab] = useState('biometrics'); // 'biometrics' | 'crime' | 'network'
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    aliases: '',
    role: 'Syndicate Operative',
    threat_score: 0.75,
    age: 32,
    gender: 'Male',
    cctns_id: '',
    
    // Rich Crime Profile
    crime_title: '',
    crime_category: 'Organized Crime & Firearms Trafficking',
    incident_narrative: '',
    modus_operandi: '',
    seized_contraband: '',
    statutory_acts: [
      {
        act: 'Bharatiya Nyaya Sanhita (BNS) 2024',
        section: 'Section 111',
        title: 'Organized Crime Syndicate Offence',
        explanation: 'Engaging in organized syndicate conspiracy, extortion, and contraband logistics.'
      },
      {
        act: 'Arms Act 1959',
        section: 'Section 25',
        title: 'Unlawful Possession & Transit of Firearms',
        explanation: 'Inter-district trafficking and possession of prohibited unlicenced firearms.'
      }
    ],
    fir_number: '',
    police_station: 'Barrackpore Special Crime Thana',
    incident_date: '2026-08-28 19:30 IST',
    incident_locus: 'Ichhapur Safehouse Perimeter',
    case_status: 'Under Active Investigation / Warrant Issued',

    // Network Identifiers
    phone_numbers: '',
    vehicle_plates: '',
    bank_accounts: '',
    upi_ids: '',
    locations: '',
    known_associates: [],
    associate_relation: 'COLLABORATES_WITH'
  });

  // Load prefilled data if passed
  React.useEffect(() => {
    if (prefilledData) {
      applyTemplate(prefilledData);
    }
  }, [prefilledData]);

  if (!isOpen) return null;

  const applyTemplate = (templateData) => {
    setFormData({
      ...formData,
      ...templateData,
      aliases: Array.isArray(templateData.aliases) ? templateData.aliases.join(', ') : (templateData.aliases || ''),
      phone_numbers: Array.isArray(templateData.phone_numbers) ? templateData.phone_numbers.join(', ') : (templateData.phone_numbers || ''),
      vehicle_plates: Array.isArray(templateData.vehicle_plates) ? templateData.vehicle_plates.join(', ') : (templateData.vehicle_plates || ''),
      bank_accounts: Array.isArray(templateData.bank_accounts) ? templateData.bank_accounts.join(', ') : (templateData.bank_accounts || ''),
      upi_ids: Array.isArray(templateData.upi_ids) ? templateData.upi_ids.join(', ') : (templateData.upi_ids || ''),
      locations: Array.isArray(templateData.locations) ? templateData.locations.join(', ') : (templateData.locations || ''),
      known_associates: templateData.known_associates || []
    });
    setErrorMsg('');
  };

  const handleAddAct = () => {
    setFormData({
      ...formData,
      statutory_acts: [
        ...formData.statutory_acts,
        {
          act: 'Bharatiya Nyaya Sanhita (BNS) 2024',
          section: 'Section 318',
          title: 'Cheating & Financial Deception',
          explanation: 'Fraudulent transactions and routing illicit funds through deception.'
        }
      ]
    });
  };

  const handleRemoveAct = (index) => {
    const nextActs = formData.statutory_acts.filter((_, i) => i !== index);
    setFormData({ ...formData, statutory_acts: nextActs });
  };

  const handleActChange = (index, field, value) => {
    const nextActs = [...formData.statutory_acts];
    nextActs[index] = { ...nextActs[index], [field]: value };
    setFormData({ ...formData, statutory_acts: nextActs });
  };

  const handleAssociateToggle = (suspectId) => {
    let next;
    if (formData.known_associates.includes(suspectId)) {
      next = formData.known_associates.filter(id => id !== suspectId);
    } else {
      next = [...formData.known_associates, suspectId];
    }
    setFormData({ ...formData, known_associates: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Suspect full name is required.');
      setActiveTab('biometrics');
      return;
    }
    if (!formData.crime_title.trim()) {
      setErrorMsg('Crime Title / Incident Name is required.');
      setActiveTab('crime');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Parse arrays
      const payload = {
        name: formData.name.trim(),
        aliases: formData.aliases ? formData.aliases.split(',').map(s => s.trim()).filter(Boolean) : [],
        role: formData.role,
        threat_score: parseFloat(formData.threat_score),
        age: parseInt(formData.age, 10) || 30,
        gender: formData.gender,
        cctns_id: formData.cctns_id.trim() || undefined,
        
        // Rich Crime Profile
        crime_title: formData.crime_title.trim(),
        crime_category: formData.crime_category,
        incident_narrative: formData.incident_narrative.trim(),
        modus_operandi: formData.modus_operandi.trim(),
        seized_contraband: formData.seized_contraband.trim(),
        statutory_acts: formData.statutory_acts,
        fir_number: formData.fir_number.trim(),
        police_station: formData.police_station.trim(),
        incident_date: formData.incident_date.trim(),
        incident_locus: formData.incident_locus.trim(),
        case_status: formData.case_status,

        // Network Entities
        phone_numbers: formData.phone_numbers ? formData.phone_numbers.split(',').map(s => s.trim()).filter(Boolean) : [],
        vehicle_plates: formData.vehicle_plates ? formData.vehicle_plates.split(',').map(s => s.trim()).filter(Boolean) : [],
        bank_accounts: formData.bank_accounts ? formData.bank_accounts.split(',').map(s => s.trim()).filter(Boolean) : [],
        upi_ids: formData.upi_ids ? formData.upi_ids.split(',').map(s => s.trim()).filter(Boolean) : [],
        locations: formData.locations ? formData.locations.split(',').map(s => s.trim()).filter(Boolean) : [],
        known_associates: formData.known_associates,
        associate_relation: formData.associate_relation,

        officer_badge: 'IO-KOLKATA-8842',
        role_designation: 'Investigating Officer (IO)'
      };

      const resp = await fetch('/api/suspects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await resp.json();
      if (!resp.ok || !resData.success) {
        throw new Error(resData.detail || resData.message || 'Failed to add suspect');
      }

      if (onSuspectAdded) {
        onSuspectAdded(resData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d121d',
        border: '1px solid var(--accent-cyan)',
        boxShadow: '0 0 30px rgba(0, 229, 255, 0.25)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(13, 18, 29, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={18} color="#07090e" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                INGEST NEW SUSPECT & CRIME DOSSIER
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
                BNS/BNSS Statutory Framework • Comprehensive Crime Profile & Knowledge Graph Integration
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Intelligence Presets Bar */}
        <div style={{
          padding: '10px 24px',
          background: 'rgba(0, 229, 255, 0.04)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} /> Quick Presets:
          </span>
          {PRESET_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(tmpl.data)}
              className="btn-primary"
              style={{ fontSize: '10px', padding: '4px 10px', background: 'rgba(7, 9, 14, 0.8)' }}
            >
              {tmpl.label}
            </button>
          ))}
        </div>

        {/* Form Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(7, 9, 14, 0.5)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('biometrics')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: activeTab === 'biometrics' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              background: activeTab === 'biometrics' ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
              color: activeTab === 'biometrics' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} /> 1. Suspect Biometrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crime')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: activeTab === 'crime' ? '2px solid var(--accent-crimson)' : '2px solid transparent',
              background: activeTab === 'crime' ? 'rgba(255, 23, 68, 0.08)' : 'transparent',
              color: activeTab === 'crime' ? 'var(--accent-crimson)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Scale size={15} /> 2. Crime Details & Statutory Acts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('network')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: activeTab === 'network' ? '2px solid var(--accent-violet)' : '2px solid transparent',
              background: activeTab === 'network' ? 'rgba(124, 77, 255, 0.08)' : 'transparent',
              color: activeTab === 'network' ? 'var(--accent-violet)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-tech)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Layers size={15} /> 3. Network & Evidence Identifiers
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <div style={{
              background: 'rgba(255, 23, 68, 0.15)',
              border: '1px solid var(--accent-crimson)',
              color: '#ff8a80',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: BIOMETRICS & IDENTITY */}
          {activeTab === 'biometrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Hasani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Aliases / Nicknames (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kabir Bhai, The Ghost"
                    value={formData.aliases}
                    onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Syndicate Role / Designation
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  >
                    <option value="Syndicate Kingpin / Strategic Boss">Syndicate Kingpin / Strategic Boss</option>
                    <option value="Chief Hawala Broker & Money Launderer">Chief Hawala Broker & Money Launderer</option>
                    <option value="Contraband Logistics Coordinator">Contraband Logistics Coordinator</option>
                    <option value="Inter-State Firearms Courier & Armorer">Inter-State Firearms Courier & Armorer</option>
                    <option value="Cyber & Communication Operator">Cyber & Communication Operator</option>
                    <option value="Ground Enforcer & Transport Driver">Ground Enforcer & Transport Driver</option>
                    <option value="Smuggling Convoy Navigator">Smuggling Convoy Navigator</option>
                    <option value="Shell Entity Director & Account Mule">Shell Entity Director & Account Mule</option>
                    <option value="Street Operative">Street Operative</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Age & Gender
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      style={{ width: '70px', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px' }}
                    />
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ flex: 1, background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    CCTNS / ICJS ID
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={formData.cctns_id}
                    onChange={(e) => setFormData({ ...formData, cctns_id: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>
              </div>

              {/* Threat Score Slider */}
              <div style={{
                background: 'rgba(7, 9, 14, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Initial Threat Score Assignment
                  </span>
                  <span style={{ color: formData.threat_score >= 0.8 ? 'var(--accent-crimson)' : 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {(formData.threat_score * 100).toFixed(0)}% ({formData.threat_score >= 0.8 ? 'Tier 1 Critical Threat' : formData.threat_score >= 0.6 ? 'Tier 2 High Threat' : 'Tier 3 Moderate Threat'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={formData.threat_score}
                  onChange={(e) => setFormData({ ...formData, threat_score: parseFloat(e.target.value) })}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('crime')}
                  className="btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  Next: Crime Details ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED CRIME PROFILE & STATUTORY ACTS */}
          {activeTab === 'crime' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Crime Title / Operation Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cross-Border Arms Trunk & Ordnance Hijack"
                    value={formData.crime_title}
                    onChange={(e) => setFormData({ ...formData, crime_title: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid rgba(255, 23, 68, 0.4)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Incident Category
                  </label>
                  <select
                    value={formData.crime_category}
                    onChange={(e) => setFormData({ ...formData, crime_category: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  >
                    <option value="Organized Crime Syndicate & Arms Smuggling">Organized Crime & Arms Smuggling</option>
                    <option value="Financial Fraud, Hawala & PMLA Offence">Financial Fraud & Hawala Money Laundering</option>
                    <option value="Armed Weapon Trafficking & Syndicate Logistics">Armed Weapon Trafficking & Logistics</option>
                    <option value="Cyber Extortion & Telecom Gateway Fraud">Cyber Extortion & SIM Box Fraud</option>
                    <option value="Armed Violence, Attempted Murder & Extortion">Armed Violence & Shootout</option>
                    <option value="Narcotics & Trans-Border Smuggling">Narcotics & Trans-Border Smuggling</option>
                    <option value="Benami Financial Laundering">Benami Financial Laundering</option>
                  </select>
                </div>
              </div>

              {/* Crime Narrative / Full Description */}
              <div>
                <label style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                  Detailed Crime Narrative / Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide comprehensive details of the criminal incident, victims, stolen/transferred property, and evidence discovered..."
                  value={formData.incident_narrative}
                  onChange={(e) => setFormData({ ...formData, incident_narrative: e.target.value })}
                  style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Modus Operandi (M.O.)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specific execution methods, burner phone protocols, scout cars, cash layering..."
                    value={formData.modus_operandi}
                    onChange={(e) => setFormData({ ...formData, modus_operandi: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', marginTop: '4px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                    Seized Weapons, Contraband & Assets
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. 3x 9mm pistols, ₹45,00,000 cash, 12 SIM cards, seized vehicles..."
                    value={formData.seized_contraband}
                    onChange={(e) => setFormData({ ...formData, seized_contraband: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', marginTop: '4px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Statutory Acts & Sections Builder */}
              <div style={{
                background: 'rgba(7, 9, 14, 0.6)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '8px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Scale size={16} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                      Statutory Acts & Sections Breakdown (with Legal Explanations)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAct}
                    className="btn-primary"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    <Plus size={12} /> Add Section
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {formData.statutory_acts.map((actItem, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(13, 18, 29, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                          value={actItem.act}
                          onChange={(e) => handleActChange(idx, 'act', e.target.value)}
                          style={{ flex: 1.2, background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px' }}
                        >
                          <option value="Bharatiya Nyaya Sanhita (BNS) 2024">Bharatiya Nyaya Sanhita (BNS) 2024</option>
                          <option value="Arms Act 1959">Arms Act 1959</option>
                          <option value="Bharatiya Sakshya Adhiniyam (BSA) 2024">Bharatiya Sakshya Adhiniyam (BSA) 2024</option>
                          <option value="Information Technology Act 2000">Information Technology Act 2000</option>
                          <option value="Prevention of Money Laundering Act (PMLA) 2002">Prevention of Money Laundering Act (PMLA) 2002</option>
                          <option value="Narcotic Drugs & Psychotropic Substances (NDPS) Act">NDPS Act 1985</option>
                          <option value="Unlawful Activities Prevention Act (UAPA)">UAPA 1967</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Section (e.g. Sec 111)"
                          value={actItem.section}
                          onChange={(e) => handleActChange(idx, 'section', e.target.value)}
                          style={{ width: '130px', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px' }}
                        />

                        <input
                          type="text"
                          placeholder="Offence Title"
                          value={actItem.title}
                          onChange={(e) => handleActChange(idx, 'title', e.target.value)}
                          style={{ flex: 1.5, background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px' }}
                        />

                        {formData.statutory_acts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAct(idx)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-crimson)', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Detailed Legal Explanation of why this section applies to the suspect..."
                        value={actItem.explanation}
                        onChange={(e) => handleActChange(idx, 'explanation', e.target.value)}
                        style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#cbd5e1', padding: '6px', borderRadius: '4px', fontSize: '11px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* FIR & Jurisdiction */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>FIR Number</label>
                  <input
                    type="text"
                    placeholder="FIR-2026/XXX/WB"
                    value={formData.fir_number}
                    onChange={(e) => setFormData({ ...formData, fir_number: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>Police Station</label>
                  <input
                    type="text"
                    value={formData.police_station}
                    onChange={(e) => setFormData({ ...formData, police_station: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>Case Status</label>
                  <select
                    value={formData.case_status}
                    onChange={(e) => setFormData({ ...formData, case_status: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px 8px', borderRadius: '4px', fontSize: '11px' }}
                  >
                    <option value="Under Active Investigation / Warrant Issued">Under Investigation / Warrant Issued</option>
                    <option value="Charge Sheet Prepared / Committal">Charge Sheet Prepared</option>
                    <option value="Arrested / In Judicial Custody">Arrested / In Custody</option>
                    <option value="Proclaimed Offender / Absconding">Proclaimed Offender / Absconding</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('biometrics')}
                  className="btn-primary"
                  style={{ padding: '8px 16px', background: 'transparent' }}
                >
                  ⬅ Back: Biometrics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('network')}
                  className="btn-primary"
                  style={{ padding: '8px 16px' }}
                >
                  Next: Network & Evidence ➔
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: NETWORK ENTITIES & EVIDENTIARY IDENTIFIERS */}
          {activeTab === 'network' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} /> Phone Numbers (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +919830112233, +919874556677"
                    value={formData.phone_numbers}
                    onChange={(e) => setFormData({ ...formData, phone_numbers: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={13} /> Vehicle License Plates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WB-02-AB-1234, WB-24-K-9988"
                    value={formData.vehicle_plates}
                    onChange={(e) => setFormData({ ...formData, vehicle_plates: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-violet)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={13} /> Bank Accounts & UPI Handles
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <input
                      type="text"
                      placeholder="Account No."
                      value={formData.bank_accounts}
                      onChange={(e) => setFormData({ ...formData, bank_accounts: e.target.value })}
                      style={{ flex: 1, background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="UPI (e.g. ops@okhdfc)"
                      value={formData.upi_ids}
                      onChange={(e) => setFormData({ ...formData, upi_ids: e.target.value })}
                      style={{ flex: 1, background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> Safehouses / Sighting Locations
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ichhapur Safehouse, Kolkata Port Dock-7"
                    value={formData.locations}
                    onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                    style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>
              </div>

              {/* Known Syndicate Associates Linker */}
              <div style={{
                background: 'rgba(7, 9, 14, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} color="var(--accent-cyan)" /> Link Existing Syndicate Associates
                  </label>
                  <select
                    value={formData.associate_relation}
                    onChange={(e) => setFormData({ ...formData, associate_relation: e.target.value })}
                    style={{ background: '#07090e', border: '1px solid var(--border-subtle)', color: 'var(--accent-cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}
                  >
                    <option value="COLLABORATES_WITH">COLLABORATES_WITH</option>
                    <option value="COMMANDS">COMMANDS (Subordinate to Target)</option>
                    <option value="OPERATES_UNDER">OPERATES_UNDER (Reports to Target)</option>
                  </select>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Select network members with whom this suspect shares communication, commands, or funds transfers:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                  {existingSuspects.map((s) => {
                    const isChecked = formData.known_associates.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleAssociateToggle(s.id)}
                        style={{
                          background: isChecked ? 'rgba(0, 229, 255, 0.15)' : 'rgba(13, 18, 29, 0.8)',
                          border: isChecked ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{s.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('crime')}
                  className="btn-primary"
                  style={{ padding: '8px 16px', background: 'transparent' }}
                >
                  ⬅ Back: Crime Details
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
                    color: '#07090e',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  {submitting ? 'INGESTING TO GRAPH...' : '🚀 COMMIT SUSPECT TO KNOWLEDGE GRAPH'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
