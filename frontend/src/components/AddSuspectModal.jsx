import React, { useState, useEffect } from 'react';
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
  Scale,
  UploadCloud,
  FileCheck,
  Image as ImageIcon,
  Clock,
  AlertTriangle,
  Cpu,
  Fingerprint,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    label: "🚨 Erick Ekka (Arms Syndicate)",
    data: {
      name: "Erick Ekka",
      aliases: ["Erick", "Chhotu"],
      role: "Logistics Courier & Firearms Transporter",
      threat_score: 0.82,
      age: 31,
      gender: "Male",
      father_or_relative: "John Ekka",
      cctns_id: "WB-CCTNS-2026-14288",
      crime_title: "Illegal Firearms Possession & Inter-State Transit Syndicate",
      crime_category: "Armed Weapon Trafficking & Syndicate Logistics",
      incident_narrative: "Accused Erick Ekka intercepted driving Mahindra Bolero (WB-24-AX-5512) near Ichhapur Rifle Factory perimeter carrying 2 country-made 9mm semi-automatic pistols and 15 live rounds concealed under driver seat cavity.",
      modus_operandi: "Transports contraband firearms and ammunition concealed inside specially fabricated hydraulic cavity under driver seat of carrier vehicle.",
      seized_contraband: "2x 9mm semi-automatic country pistols, 15 live rounds ammunition, Mahindra Bolero (WB-24-AX-5512), Cash ₹4,50,000/-",
      statutory_acts: [
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 111",
          title: "Organized Crime Syndicate Offence",
          explanation: "Acting as logistics transporter and contraband courier for organized firearms syndicate."
        },
        {
          act: "Arms Act 1959",
          section: "Section 25/27",
          title: "Trafficking and Possession of Illegal Arms",
          explanation: "Unlawful transportation and possession of prohibited country-made semi-automatic pistols."
        },
        {
          act: "Bharatiya Sakshya Adhiniyam (BSA) 2024",
          section: "Section 63",
          title: "Admissibility of Electronic Records & GPS Logs",
          explanation: "Cryptographically verified mobile cell tower triangulation and electronic seizure ledger."
        }
      ],
      fir_number: "FIR-142/2026",
      police_station: "Barrackpore Special Thana",
      incident_date: "2026-08-28 21:30 IST",
      incident_locus: "Near Ichhapur Rifle Factory Perimeter, Barrackpore",
      case_status: "Under Active Investigation / Evidence Admitted",
      phone_numbers: ["+919831445566"],
      vehicle_plates: ["WB-24-AX-5512"],
      bank_accounts: ["309110482910"],
      upi_ids: ["erick.ekka@icici"],
      locations: ["Barrackpore Station Road", "Ichhapur Rifle Factory Perimeter"],
      known_associates: ["PERSON_001"],
      associate_relation: "OPERATES_UNDER"
    }
  },
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
      phone_numbers: ["+919875114422", "+919830221199"],
      vehicle_plates: ["WB-25-A-4431"],
      bank_accounts: ["401099283412"],
      upi_ids: ["vickysupply@okaxis"],
      locations: ["Asansol Safehouse Depot", "Ichhapur Buffer Yard"],
      known_associates: ["PERSON_001"],
      associate_relation: "OPERATES_UNDER"
    }
  },
  {
    label: "💼 Hawala Laundering Mule",
    data: {
      name: "Dinesh 'Munim' Agarwal",
      aliases: ["Munimji", "D.K. Agarwal"],
      role: "Hawala Cashier & Layering Mule",
      threat_score: 0.76,
      age: 46,
      gender: "Male",
      cctns_id: "WB-CCTNS-2026-10492",
      crime_title: "Burrabazar Angadia Hawala Network & Multi-Account Layering",
      crime_category: "Financial Fraud, Hawala & PMLA Offence",
      incident_narrative: "Operated as primary bullion-settlement cashier routing un-invoiced extortion proceeds from North 24 Parganas industrial units into 14 shell current accounts before converting them into overseas crypto tokens.",
      modus_operandi: "Token-based cash collection via Angadia delivery agents in Burrabazar; utilizes pre-activated SIM routers to initiate multi-hop RTGS transfers under ₹5 Lakh to evade automated bank STR flags.",
      seized_contraband: "₹48,50,000 unaccounted cash, 2 Gold Bullion Biscuits (200g), Ledger diaries with encrypted Hawala tokens, Hardware cold wallet",
      statutory_acts: [
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 316 & 318",
          title: "Criminal Breach of Trust & Fraudulent Cheating",
          explanation: "Concealing illicit origins of syndicate proceeds using benami financial identities."
        },
        {
          act: "Prevention of Money Laundering Act (PMLA) 2002",
          section: "Section 3 & 4",
          title: "Offence of Money-Laundering",
          explanation: "Direct involvement in process and activity connected with proceeds of organized crime."
        }
      ],
      fir_number: "FIR-2026/094/WB-KOL",
      police_station: "Burrabazar Special Police Station",
      incident_date: "2026-08-25 14:15 IST",
      incident_locus: "Cotton Street Commercial Vault, Kolkata",
      case_status: "Interrogation in Custody / Bank Accounts Frozen",
      phone_numbers: ["+919831009944"],
      vehicle_plates: ["WB-02-E-9021"],
      bank_accounts: ["50100991823411", "91902003881245"],
      upi_ids: ["munimops@okhdfcbank"],
      locations: ["Burrabazar Commercial Vault", "Kolkata Port Trust Hub"],
      known_associates: ["PERSON_002"],
      associate_relation: "COLLABORATES_WITH"
    }
  },
  {
    label: "💻 Cyber Syndicate Operator",
    data: {
      name: "Siddharth 'Neo' Sen",
      aliases: ["GhostByte", "Cyber-Sam"],
      role: "Cyber Operator & Encrypted Comm Architect",
      threat_score: 0.81,
      age: 28,
      gender: "Male",
      cctns_id: "WB-CCTNS-2026-33901",
      crime_title: "Darknet SIM-Box Gateway & Offshore Bitcoin Transfer Infrastructure",
      crime_category: "Cyber Extortion & Telecom Gateway Fraud",
      incident_narrative: "Engineered unauthorized VoIP-GSM gateways and dynamic proxy routing for extortion calls targeting local businessmen while shielding Tariq Al-Hasani's mobile coordinates.",
      modus_operandi: "Deployed 32-port GSM gateway with cloned IMSI cards; automated bot scripts to shuffle Bitcoin balances across Tornado-style mixing services.",
      seized_contraband: "32-Port GSM SIM-Box, 184 Cloned SIM Cards, 2 High-End Server Rigs, Encrypted USB YubiKeys, 4.2 BTC wallet address",
      statutory_acts: [
        {
          act: "Information Technology Act 2000",
          section: "Section 66D & 43",
          title: "Cheating by Personation Using Computer Resource",
          explanation: "Setting up spoofed communication gateways to facilitate organized extortion."
        },
        {
          act: "Bharatiya Nyaya Sanhita (BNS) 2024",
          section: "Section 111",
          title: "Organized Crime Syndicate Offence",
          explanation: "Providing technical and infrastructural support to syndicate extortion operations."
        }
      ],
      fir_number: "FIR-2026/204/WB-SLK",
      police_station: "Bidhannagar Cyber Crime PS",
      incident_date: "2026-08-26 18:00 IST",
      incident_locus: "Sector V Tech Hub, Salt Lake, Kolkata",
      case_status: "Digital Evidence Admitted under BSA Sec 63 / Remand Pending",
      phone_numbers: ["+919874550011"],
      vehicle_plates: ["WB-06-K-8812"],
      bank_accounts: ["602011448833"],
      upi_ids: ["ghostops@okicici"],
      locations: ["Salt Lake Sector V Cyber Node"],
      known_associates: ["PERSON_001"],
      associate_relation: "OPERATES_UNDER"
    }
  }
];

const SAMPLE_MEDIA_FILES = [
  {
    name: "FIR_142_2026_Erick_Ekka_Arms_Trafficking.pdf",
    type: "application/pdf",
    size: "318 KB",
    tag: "📄 FIR Document (Erick Ekka)",
    content: `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C / Section 173 BNSS)
1. District: North 24 Parganas, P.S.: Barrackpore Special Thana, Year: 2026, FIR No.: 142/2026, Date: 28/08/2026
2. Acts & Sections: Section 111 BNS 2024, Arms Act 1959 Sec 25/27, BSA 2024 Sec 63
3. (a) Occurrence of Offence: Day: Friday, Date: 28/08/2026, Time: 21:30 hrs
4. Type of Information: Written / Intelligence Source
5. Place of Occurrence: Near Ichhapur Rifle Factory Perimeter, Barrackpore
6. Complainant / Informant: Sub-Inspector A. K. Banerjee
7. Details of known / suspected / unknown accused with full particulars:
   (1) Erick Ekka, S/O John Ekka, Resident of Barrackpore Station Road, North 24 Parganas (Age approx 31 years)
8. Particulars of properties stolen / involved: 2 country-made 9mm semi-automatic pistols, 15 live rounds ammunition, Mahindra Bolero (WB-24-AX-5512), Cash Rs. 4,50,000/-
9. Brief Description of Incident / Modus Operandi: On secret intelligence, raiding party intercepted Mahindra Bolero WB-24-AX-5512 driven by accused Erick Ekka. Search revealed concealed cavity under driver seat containing illegal arms. Accused Erick Ekka confessed to acting as logistics courier for illegal firearm syndicate. Phone: +919831445566, UPI: erick.ekka@icici.`
  },
  {
    name: "Scanned_Zero_FIR_ArmsSmuggling.pdf",
    type: "application/pdf",
    size: "245 KB",
    tag: "📄 Legal FIR Document Scan",
    content: `FIRST INFORMATION REPORT (Zero-FIR No. WB-2026/142)
Police Station: Barrackpore Special Crime Thana
Date: 27/08/2026 21:30 IST
Accused: Rajesh 'Kaalia' Pandey (Age 37, Male)
Aliases: Kaalia Pistol, R.K. Pandey
Phone: +919875991122 | Alt: +919830554433
Vehicle Plate: WB-24-M-9911 (Mahindra Bolero Pickup)
Bank Account: 402011993344 (SBI Barrackpore) | UPI: kaaliaops@oksbi
Incident Locus: Ichhapur Defence Estate Perimeter Gate-4
Narrative: Accused intercepted while transporting an unauthorized consignment of 8 country-made 9mm semi-automatic pistols and 90 live rounds concealed inside a false-roof compartment of carrier vehicle WB-24-M-9911. Cash sum of ₹14,50,000 recovered from vehicle cabin.
Modus Operandi: Uses fake defense supplier entry pass to bypass state highway checkpoints during midnight transit hours.
Statutory Code: Section 111 BNS 2024 (Organized Crime), Arms Act Sec 25(1AA) & 25(1A), BSA 2024 Sec 63.`
  },
  {
    name: "Evidence_Photo_Seized_Glock_Pistols.jpg",
    type: "image/jpeg",
    size: "1.8 MB",
    tag: "📸 Seized Contraband Photo Scan",
    content: `FORENSIC SEIZURE MEMO & IMAGE EVIDENCE REPORT
Evidence Exhibit Tag: EX-2026-WB-ARM-088
Date of Seizure: 28/08/2026
Suspect / Possessor: Aniket 'Rifle' Ghosh (Age 31)
Phone: +919831889900 | Vehicle: WB-04-J-3344
Location of Seizure: Asansol Railway Goods Shed
Seized Materials: 6x Country-made Semi-Automatic Pistols, 60 live cartridges, ₹8,00,000 currency notes, 2 GPS trackers.
Narrative: Photographic proof confirming illicit weapon transfer from Jharkhand border courier to local distributor.
Statute: BNS Section 111, Arms Act Section 25, BSA Section 63 Digital Certification.`
  },
  {
    name: "Hawala_Bank_STR_Transaction_Report.pdf",
    type: "application/pdf",
    size: "512 KB",
    tag: "📄 Financial STR & Hawala Ledger",
    content: `SUSPICIOUS TRANSACTION REPORT (STR / PMLA Ref: WB-FIU-2026-771)
Reporting Entity: HDFC Bank Park Street Branch
Subject: Farooq 'Hawala' Sheikh (Age 42)
Aliases: Farooq Bhai, Sethji
Account Number: 50100991823411 | UPI: farooqtransfers@okhdfcbank
Total Turnover Flagged: ₹2,40,00,000 across 30 days
Narrative: Multi-hop structuring where round sums of ₹49,000 were deposited simultaneously across 12 branch ATMs and transferred immediately to offshore crypto escrow wallets.
Statute: PMLA 2002 Section 3/4, BNS Section 316, BSA Section 63.`
  }
];

export default function AddSuspectModal({ isOpen, onClose, onSuspectAdded, existingSuspects = [], prefilledData = null }) {
  const [activeTab, setActiveTab] = useState('media'); // 'media', 'identity', 'crime', 'network', 'prediction'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [role, setRole] = useState('Syndicate Operative');
  const [threatScore, setThreatScore] = useState(0.75);
  const [age, setAge] = useState(32);
  const [gender, setGender] = useState('Male');
  const [cctnsId, setCctnsId] = useState('');

  // Detailed Crime Profile
  const [crimeTitle, setCrimeTitle] = useState('');
  const [crimeCategory, setCrimeCategory] = useState('Armed Weapon Trafficking & Syndicate Logistics');
  const [incidentNarrative, setIncidentNarrative] = useState('');
  const [modusOperandi, setModusOperandi] = useState('');
  const [seizedContraband, setSeizedContraband] = useState('');
  const [statutoryActs, setStatutoryActs] = useState([
    {
      act: "Bharatiya Nyaya Sanhita (BNS) 2024",
      section: "Section 111",
      title: "Organized Crime Syndicate Offence",
      explanation: "Active involvement in continuous unlawful syndicate activity and extortion."
    },
    {
      act: "Arms Act 1959",
      section: "Section 25",
      title: "Unlawful Arms Possession & Supply",
      explanation: "Possession and transportation of unlicenced country-made firearms."
    }
  ]);
  const [firNumber, setFirNumber] = useState('');
  const [policeStation, setPoliceStation] = useState('Barrackpore Special Crime Thana');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentLocus, setIncidentLocus] = useState('Ichhapur Safehouse Corridor');
  const [caseStatus, setCaseStatus] = useState('Under Active Investigation / Warrant Issued');

  // Network & Identifiers
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [vehiclePlates, setVehiclePlates] = useState('');
  const [bankAccounts, setBankAccounts] = useState('');
  const [upiIds, setUpiIds] = useState('');
  const [locations, setLocations] = useState('');
  const [selectedAssociate, setSelectedAssociate] = useState('');
  const [associateRelation, setAssociateRelation] = useState('COLLABORATES_WITH');

  // Media Upload & OCR State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadedFileHash, setUploadedFileHash] = useState('');
  const [isExtractingMedia, setIsExtractingMedia] = useState(false);
  const [mediaExtractionSuccess, setMediaExtractionSuccess] = useState(false);
  const [evidenceAttachment, setEvidenceAttachment] = useState(null);

  // AI Predictive Outcome State
  const [predictiveOutcome, setPredictiveOutcome] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Populate from prefilledData or default preset
  useEffect(() => {
    if (prefilledData) {
      populateFormData(prefilledData);
    } else if (isOpen && !name) {
      populateFormData(PRESET_TEMPLATES[0].data);
    }
  }, [prefilledData, isOpen]);

  const populateFormData = (d) => {
    if (!d) return;
    setName(d.name || '');
    setAliases(Array.isArray(d.aliases) ? d.aliases.join(', ') : (d.aliases || ''));
    setRole(d.role || 'Syndicate Operative');
    setThreatScore(d.threat_score !== undefined ? d.threat_score : 0.75);
    setAge(d.age || 32);
    setGender(d.gender || 'Male');
    setCctnsId(d.cctns_id || '');

    setCrimeTitle(d.crime_title || '');
    setCrimeCategory(d.crime_category || 'Armed Weapon Trafficking & Syndicate Logistics');
    setIncidentNarrative(d.incident_narrative || '');
    setModusOperandi(d.modus_operandi || '');
    setSeizedContraband(d.seized_contraband || '');
    if (d.statutory_acts && d.statutory_acts.length > 0) {
      setStatutoryActs(d.statutory_acts);
    }
    setFirNumber(d.fir_number || '');
    setPoliceStation(d.police_station || 'Barrackpore Special Crime Thana');
    setIncidentDate(d.incident_date || '');
    setIncidentLocus(d.incident_locus || 'Ichhapur Safehouse Corridor');
    setCaseStatus(d.case_status || 'Under Active Investigation / Warrant Issued');

    setPhoneNumbers(Array.isArray(d.phone_numbers) ? d.phone_numbers.join(', ') : (d.phone_numbers || ''));
    setVehiclePlates(Array.isArray(d.vehicle_plates) ? d.vehicle_plates.join(', ') : (d.vehicle_plates || ''));
    setBankAccounts(Array.isArray(d.bank_accounts) ? d.bank_accounts.join(', ') : (d.bank_accounts || ''));
    setUpiIds(Array.isArray(d.upi_ids) ? d.upi_ids.join(', ') : (d.upi_ids || ''));
    setLocations(Array.isArray(d.locations) ? d.locations.join(', ') : (d.locations || ''));
    if (d.known_associates && d.known_associates.length > 0) {
      setSelectedAssociate(d.known_associates[0]);
    }
    if (d.associate_relation) {
      setAssociateRelation(d.associate_relation);
    }
    if (d.evidence_attachment) {
      setEvidenceAttachment(d.evidence_attachment);
      setUploadedFileName(d.evidence_attachment.file_name);
      setUploadedFileHash(d.evidence_attachment.sha256_hash);
    }
    if (d.predicted_outcome) {
      setPredictiveOutcome(d.predicted_outcome);
    } else {
      triggerLivePrediction(d);
    }
  };

  const handleApplyPreset = (presetData) => {
    populateFormData(presetData);
    setMediaExtractionSuccess(false);
  };

  // Trigger live AI outcome prediction when suspect attributes change
  const triggerLivePrediction = async (currentData = null) => {
    const payload = currentData || {
      name: name || "Target Suspect",
      role: role || "Syndicate Operative",
      threat_score: threatScore,
      crime_title: crimeTitle,
      crime_category: crimeCategory,
      incident_narrative: incidentNarrative,
      modus_operandi: modusOperandi,
      seized_contraband: seizedContraband,
      phone_numbers: phoneNumbers ? phoneNumbers.split(',').map(s => s.trim()) : [],
      vehicle_plates: vehiclePlates ? vehiclePlates.split(',').map(s => s.trim()) : []
    };

    setIsPredicting(true);
    try {
      const resp = await fetch('/api/predict/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const pred = await resp.json();
        setPredictiveOutcome(pred);
      }
    } catch (err) {
      console.error("Error generating outcome prediction:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  // Process sample media evidence file
  const handleSelectSampleMedia = async (sample) => {
    setIsExtractingMedia(true);
    setError(null);
    setUploadedFileName(sample.name);
    setUploadedFileSize(sample.size);

    try {
      const resp = await fetch('/api/ingest/upload-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          raw_text: sample.content,
          source_type: sample.type.includes('pdf') ? 'SCANNED_LEGAL_PDF' : 'EVIDENCE_PHOTO_SCAN',
          officer_badge: 'IO-KOLKATA-8842',
          role: 'Investigating Officer (IO)'
        })
      });

      if (!resp.ok) throw new Error("Media extraction engine failed.");
      const result = await resp.json();

      if (result.auto_filled_suspect) {
        populateFormData(result.auto_filled_suspect);
        setEvidenceAttachment(result.file_info);
        setUploadedFileHash(result.file_info.sha256_hash);
        setPredictiveOutcome(result.predictive_outcome);
        setMediaExtractionSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Failed to parse evidence file.");
    } finally {
      setIsExtractingMedia(false);
    }
  };

  // Handle actual file upload from input
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingMedia(true);
    setError(null);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_type', file.type.includes('pdf') ? 'SCANNED_LEGAL_PDF' : 'EVIDENCE_PHOTO_SCAN');
    formData.append('officer_badge', 'IO-KOLKATA-8842');
    formData.append('role', 'Investigating Officer (IO)');

    try {
      const resp = await fetch('/api/ingest/upload-media', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) throw new Error("Server OCR extraction error.");
      const result = await resp.json();

      if (result.auto_filled_suspect) {
        populateFormData(result.auto_filled_suspect);
        setEvidenceAttachment(result.file_info);
        setUploadedFileHash(result.file_info.sha256_hash);
        setPredictiveOutcome(result.predictive_outcome);
        setMediaExtractionSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Error extracting text from uploaded media.");
    } finally {
      setIsExtractingMedia(false);
    }
  };

  // Statutory Acts Array Helpers
  const handleAddAct = () => {
    setStatutoryActs([
      ...statutoryActs,
      { act: "Bharatiya Nyaya Sanhita (BNS) 2024", section: "Section 318", title: "Cheating by Personation", explanation: "Inducing victims through forged electronic identity." }
    ]);
  };

  const handleUpdateAct = (index, field, value) => {
    const updated = [...statutoryActs];
    updated[index][field] = value;
    setStatutoryActs(updated);
  };

  const handleRemoveAct = (index) => {
    if (statutoryActs.length <= 1) return;
    setStatutoryActs(statutoryActs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Suspect Full Name is required.");
      setActiveTab('identity');
      return;
    }
    if (!crimeTitle.trim()) {
      setError("Crime Title / Incident Description is required.");
      setActiveTab('crime');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      aliases: aliases ? aliases.split(',').map(s => s.trim()).filter(Boolean) : [],
      role: role.trim(),
      threat_score: parseFloat(threatScore),
      attribute_load: parseFloat((threatScore * 3.5).toFixed(1)),
      age: parseInt(age, 10) || 32,
      gender: gender,
      cctns_id: cctnsId.trim() || undefined,
      crime_title: crimeTitle.trim(),
      crime_category: crimeCategory,
      incident_narrative: incidentNarrative.trim(),
      modus_operandi: modusOperandi.trim(),
      seized_contraband: seizedContraband.trim(),
      statutory_acts: statutoryActs,
      fir_number: firNumber.trim(),
      police_station: policeStation.trim(),
      incident_date: incidentDate.trim(),
      incident_locus: incidentLocus.trim(),
      case_status: caseStatus.trim(),
      phone_numbers: phoneNumbers ? phoneNumbers.split(',').map(s => s.trim()).filter(Boolean) : [],
      vehicle_plates: vehiclePlates ? vehiclePlates.split(',').map(s => s.trim()).filter(Boolean) : [],
      bank_accounts: bankAccounts ? bankAccounts.split(',').map(s => s.trim()).filter(Boolean) : [],
      upi_ids: upiIds ? upiIds.split(',').map(s => s.trim()).filter(Boolean) : [],
      locations: locations ? locations.split(',').map(s => s.trim()).filter(Boolean) : [],
      known_associates: selectedAssociate ? [selectedAssociate] : [],
      associate_relation: associateRelation,
      evidence_attachment: evidenceAttachment || (uploadedFileName ? {
        file_name: uploadedFileName,
        sha256_hash: uploadedFileHash || "SHA256-PENDING",
        bsa_digital_certificate: "BSA-2024-CERT-ADMITTED",
        verified_at: new Date().toISOString()
      } : null),
      predicted_outcome: predictiveOutcome
    };

    try {
      const resp = await fetch('/api/suspects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.detail || "Failed to commit suspect to Knowledge Graph.");
      }

      const resData = await resp.json();
      if (onSuspectAdded) {
        onSuspectAdded(resData);
      }
      onClose();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Ingest Suspect & Evidence Media to Knowledge Graph
                </h2>
                <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
                  Multilingual OCR & AI Prediction
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Upload FIRs/proof photos for automatic OCR extraction and historical case trajectory forecasting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Intelligence Presets Bar */}
        <div style={{
          padding: '10px 24px',
          background: '#f1f5f9',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Sparkles size={13} color="var(--accent-cyan)" /> 1-Click Intelligence Presets:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {PRESET_TEMPLATES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.data)}
                style={{
                  padding: '4px 10px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: '#ffffff',
          padding: '0 24px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'media' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'media' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: activeTab === 'media' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UploadCloud size={14} />
            <span>1. Upload FIR / Proof File</span>
            {uploadedFileName && <span className="badge badge-emerald" style={{ fontSize: '8px', padding: '1px 4px' }}>Extracted</span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'identity' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'identity' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: activeTab === 'identity' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} />
            <span>2. Suspect Details & Aliases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crime')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'crime' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'crime' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: activeTab === 'crime' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Scale size={14} />
            <span>3. Crime Details & Law Sections</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('network');
              triggerLivePrediction();
            }}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'network' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'network' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: activeTab === 'network' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={14} />
            <span>4. Gang Links & Next Moves</span>
            <span className="badge badge-violet" style={{ fontSize: '8px', padding: '1px 4px' }}>🔮 Forecast</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 1: UPLOAD MEDIA & PROOF (PDF / PNG / JPG / OCR AUTO-DETECTION)         */}
            {/* ========================================================================= */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Drag and Drop Zone */}
                <div style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#f0f9ff',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx"
                    onChange={handleFileUpload}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)'
                    }}>
                      <UploadCloud size={24} />
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Drop FIR Documents, Crime Proof Photos, or Seizure Memos Here
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, maxWidth: '480px' }}>
                      Supports <strong>PDF, PNG, JPG, JPEG, WEBP, TXT</strong>. AI automatically runs Multilingual OCR (English, Hindi, Bengali), extracts legal entities, and predicts crime outcome.
                    </p>
                    <span className="badge badge-cyan" style={{ marginTop: '6px', fontSize: '10px' }}>
                      Browse Local Files
                    </span>
                  </div>
                </div>

                {/* Extraction Status Feedback */}
                {isExtractingMedia && (
                  <div style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: '#ede9fe',
                    border: '1px solid #c4b5fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Cpu size={20} className="pulse-slow" color="var(--accent-violet)" />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#4c1d95' }}>
                        Processing Multilingual OCR & Legal NER Extraction...
                      </div>
                      <div style={{ fontSize: '11px', color: '#6d28d9' }}>
                        Parsing {uploadedFileName} ({uploadedFileSize}) • Triangulating BNS Statutory Sections & Forecast Precedent Match
                      </div>
                    </div>
                  </div>
                )}

                {mediaExtractionSuccess && (
                  <div style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={20} color="var(--accent-emerald)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803d' }}>
                          Evidence Processed • Suspect Identified: <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{name || "Target Suspect"}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#166534', fontFamily: 'var(--font-mono)' }}>
                          File: {uploadedFileName} • SHA-256: {uploadedFileHash ? `${uploadedFileHash.slice(0, 16)}...` : 'VERIFIED'} • {statutoryActs?.length || 0} Statutory Acts Mapped
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                      BSA 2024 Sec 63 Certified
                    </span>
                  </div>
                )}

                {/* 1-Click Sample Media Proofs */}
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <FileCheck size={14} /> Quick Demonstration: Test with Pre-Loaded Police Evidence Files
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {SAMPLE_MEDIA_FILES.map((sample, i) => (
                      <div
                        key={i}
                        onClick={() => handleSelectSampleMedia(sample)}
                        style={{
                          padding: '12px',
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                          e.currentTarget.style.background = '#e0f2fe';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--accent-violet)', fontWeight: 600 }}>{sample.tag}</span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{sample.size}</span>
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sample.name}
                        </div>
                        <button
                          type="button"
                          style={{
                            marginTop: '4px',
                            padding: '4px',
                            background: '#e0f2fe',
                            border: '1px solid #bae6fd',
                            borderRadius: '4px',
                            color: '#0369a1',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Auto-Extract & Predict
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: SUSPECT IDENTITY & BIOMETRICS                                      */}
            {/* ========================================================================= */}
            {activeTab === 'identity' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Suspect Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram 'Vicky' Singh"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Aliases / Street Nicknames (comma separated)
                    </label>
                    <input
                      type="text"
                      value={aliases}
                      onChange={(e) => setAliases(e.target.value)}
                      placeholder="e.g. Vicky Shooter, Kallu, V. Singh"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Syndicate Role / Operational Function
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Inter-State Firearms Courier"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Age & Gender
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        style={{
                          width: '80px',
                          padding: '9px 12px',
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      />
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          fontSize: '13px'
                        }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      CCTNS / ICJS Offender ID
                    </label>
                    <input
                      type="text"
                      value={cctnsId}
                      onChange={(e) => setCctnsId(e.target.value)}
                      placeholder="e.g. WB-CCTNS-2026-22910"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* Threat Score Slider */}
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Calibrated Threat Score (CPP / TRI Risk Metric)
                    </label>
                    <span style={{
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: threatScore >= 0.8 ? 'var(--accent-crimson)' : threatScore >= 0.6 ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                    }}>
                      {threatScore.toFixed(2)} / 1.00 ({threatScore >= 0.8 ? 'CRITICAL RISK' : threatScore >= 0.6 ? 'HIGH RISK' : 'MODERATE'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="1.00"
                    step="0.01"
                    value={threatScore}
                    onChange={(e) => setThreatScore(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: threatScore >= 0.8 ? '#dc2626' : '#0284c7' }}
                  />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: CRIME DETAILS & STATUTORY ACTS BUILDER                             */}
            {/* ========================================================================= */}
            {activeTab === 'crime' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Crime Title / Operation Name *
                    </label>
                    <input
                      type="text"
                      value={crimeTitle}
                      onChange={(e) => setCrimeTitle(e.target.value)}
                      placeholder="e.g. Inter-State Munger Firearms Trunk Pipeline & Cache Supply"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Crime Category
                    </label>
                    <select
                      value={crimeCategory}
                      onChange={(e) => setCrimeCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    >
                      <option value="Armed Weapon Trafficking & Syndicate Logistics">Armed Weapon Trafficking & Logistics</option>
                      <option value="Financial Fraud, Hawala & PMLA Offence">Financial Fraud, Hawala & PMLA Offence</option>
                      <option value="Cyber Extortion & Telecom Gateway Fraud">Cyber Extortion & Telecom Fraud</option>
                      <option value="Extortion, Intimidation & Murder Conspiracy">Extortion & Murder Conspiracy</option>
                      <option value="Cross-Border Contraband & Logistics">Cross-Border Contraband & Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Incident Narrative & Factual Summary (Full Case Context)
                  </label>
                  <textarea
                    rows={3}
                    value={incidentNarrative}
                    onChange={(e) => setIncidentNarrative(e.target.value)}
                    placeholder="Provide full description of suspect's unlawful actions, conspiratorial liaisons, and targets..."
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Modus Operandi (M.O. / Tactical Execution)
                    </label>
                    <textarea
                      rows={2}
                      value={modusOperandi}
                      onChange={(e) => setModusOperandi(e.target.value)}
                      placeholder="e.g. Uses false-bottom trucks; swaps burner SIMs every 48h..."
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Seized Weapons, Contraband & Assets
                    </label>
                    <textarea
                      rows={2}
                      value={seizedContraband}
                      onChange={(e) => setSeizedContraband(e.target.value)}
                      placeholder="e.g. 12x 9mm pistols, 120 cartridges, ₹35L cash, cold storage wallet..."
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic Statutory Acts Manager */}
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ⚖️ Statutory Acts & Legal Sections (With Law Enforcement Explanations)
                      </span>
                      <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                        Include specific section numbers along with legal justifications.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAct}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        background: '#e0f2fe',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        color: '#0369a1',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={13} /> Add Statutory Section
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {statutoryActs.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'grid',
                        gridTemplateColumns: '180px 140px 1fr 32px',
                        gap: '8px',
                        alignItems: 'center',
                        background: '#ffffff',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <select
                          value={item.act}
                          onChange={(e) => handleUpdateAct(idx, 'act', e.target.value)}
                          style={{
                            padding: '6px',
                            background: '#f8fafc',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '11px'
                          }}
                        >
                          <option value="Bharatiya Nyaya Sanhita (BNS) 2024">BNS 2024</option>
                          <option value="Arms Act 1959">Arms Act 1959</option>
                          <option value="Information Technology Act 2000">IT Act 2000</option>
                          <option value="Bharatiya Sakshya Adhiniyam (BSA) 2024">BSA 2024</option>
                          <option value="Prevention of Money Laundering Act (PMLA) 2002">PMLA 2002</option>
                          <option value="NDPS Act 1985">NDPS Act 1985</option>
                        </select>

                        <input
                          type="text"
                          value={item.section}
                          onChange={(e) => handleUpdateAct(idx, 'section', e.target.value)}
                          placeholder="e.g. Section 111"
                          style={{
                            padding: '6px 8px',
                            background: '#f8fafc',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '11px'
                          }}
                        />

                        <input
                          type="text"
                          value={item.explanation}
                          onChange={(e) => handleUpdateAct(idx, 'explanation', e.target.value)}
                          placeholder="Legal explanation / offence context..."
                          style={{
                            padding: '6px 8px',
                            background: '#f8fafc',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            fontSize: '11px'
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveAct(idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      FIR Number
                    </label>
                    <input
                      type="text"
                      value={firNumber}
                      onChange={(e) => setFirNumber(e.target.value)}
                      placeholder="e.g. FIR-2026/118/WB-ASN"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Police Station / Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={policeStation}
                      onChange={(e) => setPoliceStation(e.target.value)}
                      placeholder="e.g. Barrackpore Special Thana"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Case / Warrant Status
                    </label>
                    <input
                      type="text"
                      value={caseStatus}
                      onChange={(e) => setCaseStatus(e.target.value)}
                      placeholder="e.g. Warrant Issued / Active Trial"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: NETWORK & LIVE AI HISTORICAL OUTCOME FORECAST                      */}
            {/* ========================================================================= */}
            {activeTab === 'network' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Physical Network Identifiers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <Phone size={12} color="var(--accent-cyan)" /> Linked Phones / SIMs (comma separated)
                    </label>
                    <input
                      type="text"
                      value={phoneNumbers}
                      onChange={(e) => setPhoneNumbers(e.target.value)}
                      placeholder="+919875114422, +919830221199"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <Truck size={12} color="var(--accent-amber)" /> Vehicle License Plates (comma separated)
                    </label>
                    <input
                      type="text"
                      value={vehiclePlates}
                      onChange={(e) => setVehiclePlates(e.target.value)}
                      placeholder="WB-25-A-4431, WB-02-E-9021"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <CreditCard size={12} color="var(--accent-violet)" /> Bank Accounts & UPI Handles
                    </label>
                    <input
                      type="text"
                      value={bankAccounts}
                      onChange={(e) => setBankAccounts(e.target.value)}
                      placeholder="50100991823411, munimops@okhdfcbank"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <MapPin size={12} color="var(--accent-emerald)" /> Safehouses / Operating Locations
                    </label>
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      placeholder="Ichhapur Safehouse Depot, Asansol Yard"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Associate Linker */}
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Users size={13} color="var(--accent-cyan)" /> Link to Existing Syndicate Co-Conspirator in Graph
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select
                      value={selectedAssociate}
                      onChange={(e) => setSelectedAssociate(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="">-- Select Existing Suspect to Link --</option>
                      {existingSuspects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>

                    <select
                      value={associateRelation}
                      onChange={(e) => setAssociateRelation(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    >
                      <option value="COLLABORATES_WITH">COLLABORATES_WITH (Peer Conduit)</option>
                      <option value="COMMANDS">COMMANDS (Directs Operative)</option>
                      <option value="OPERATES_UNDER">OPERATES_UNDER (Reports to Kingpin)</option>
                      <option value="TRANSFERRED_FUNDS_TO">TRANSFERRED_FUNDS_TO (Hawala Flow)</option>
                    </select>
                  </div>
                </div>

                {/* 🔮 LIVE AI HISTORICAL PATTERN MATCH & OUTCOME FORECAST CARD */}
                <div style={{
                  background: '#ede9fe',
                  border: '1px solid #c4b5fd',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} color="var(--accent-violet)" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#4c1d95' }}>
                        🔮 AI Historical Pattern Recognition & Case Outcome Forecast
                      </span>
                    </div>
                    {predictiveOutcome && (
                      <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                        {predictiveOutcome.matched_historical_precedent?.similarity_percentage} Pattern Match
                      </span>
                    )}
                  </div>

                  {predictiveOutcome ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* Matched Precedent */}
                      <div style={{
                        background: '#ffffff',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        borderLeft: '3px solid var(--accent-violet)',
                        border: '1px solid #ddd6fe'
                      }}>
                        <div style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 600, marginBottom: '2px' }}>
                          Matched Historical Precedent Case:
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#4c1d95' }}>
                          {predictiveOutcome.matched_historical_precedent?.case_title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#5b21b6', marginTop: '4px' }}>
                          <strong>Historical Precedent Outcome:</strong> {predictiveOutcome.matched_historical_precedent?.actual_historical_outcome}
                        </div>
                      </div>

                      {/* Forecasted Progression Timeline */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {predictiveOutcome.forecasted_outcome_timeline?.map((step, idx) => (
                          <div key={idx} style={{
                            background: '#ffffff',
                            border: '1px solid #ddd6fe',
                            borderRadius: '6px',
                            padding: '8px 10px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{step.timeframe}</span>
                              <span style={{ fontSize: '9px', color: step.threat_level === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)', fontWeight: 700 }}>
                                {step.probability}
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                              {step.predicted_action}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tactical Intervention */}
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Target size={16} color="var(--accent-cyan)" />
                          <div>
                            <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 700 }}>
                              Recommended Law Enforcement Counter-Strategy:
                            </span>
                            <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                              {predictiveOutcome.tactical_intervention_strategy?.primary_action}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-cyan" style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>
                          Window: {predictiveOutcome.tactical_intervention_strategy?.critical_window_hours}h
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px' }}>
                      {isPredicting ? 'Evaluating case signatures against historical police archives...' : 'Click below to forecast syndicate trajectory.'}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
                BSA 2024 Sec 63 Hash-Chaining Enabled
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <UserPlus size={15} />
                <span>{submitting ? 'Ingesting to Knowledge Graph...' : 'COMMIT SUSPECT & EVIDENCE TO GRAPH'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
