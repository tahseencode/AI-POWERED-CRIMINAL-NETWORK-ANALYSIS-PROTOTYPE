import React, { useState } from 'react';
import { FileText, UploadCloud, CheckCircle2, Languages, FileCheck, UserPlus, Sparkles } from 'lucide-react';

export default function DataIngestionStudio({ currentRole, onOpenAddSuspectWithData }) {
  const sampleFIRErickEkka = `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C / Section 173 BNSS)
1. District: North 24 Parganas, P.S.: Barrackpore Special Thana, Year: 2026, FIR No.: 142/2026, Date: 28/08/2026
2. Acts & Sections: Section 111 BNS 2024, Arms Act 1959 Sec 25/27, BSA 2024 Sec 63
3. (a) Occurrence of Offence: Day: Friday, Date: 28/08/2026, Time: 21:30 hrs
4. Type of Information: Written / Intelligence Source
5. Place of Occurrence: Near Ichhapur Rifle Factory Perimeter, Barrackpore
6. Complainant / Informant: Sub-Inspector A. K. Banerjee
7. Details of known / suspected / unknown accused with full particulars:
   (1) Erick Ekka, S/O John Ekka, Resident of Barrackpore Station Road, North 24 Parganas (Age approx 31 years)
8. Particulars of properties stolen / involved: 2 country-made 9mm semi-automatic pistols, 15 live rounds ammunition, Mahindra Bolero (WB-24-AX-5512), Cash Rs. 4,50,000/-
9. Brief Description of Incident / Modus Operandi: On secret intelligence, raiding party intercepted Mahindra Bolero WB-24-AX-5512 driven by accused Erick Ekka. Search revealed concealed cavity under driver seat containing illegal arms. Accused Erick Ekka confessed to acting as logistics courier for illegal firearm syndicate. Phone: +919831445566, UPI: erick.ekka@icici.`;

  const sampleFIRHindi = `प्रथम सूचना रिपोर्ट (FIR No. WB-2026/104)
थाना: बैरकपुर, उत्तर 24 परगना
दिनांक: 24/08/2026
अभियुक्त: तारिक अल-हसनी (उर्फ कबीर भाई) आयु 49 वर्ष
मोबाइल नंबर: +919830112233
वाहन नंबर: WB-02-AB-1234 (महिंद्रा स्कॉर्पियो)
घटना स्थल: इछापुर डिफेंस एस्टेट परिधि
विवरण: गुप्त सूचना के आधार पर अभियुक्त को अवैध हथियारों की तस्करी और हवाला फंड ट्रांसफर (खाता 50100991823411) के संबंध में पकड़ा गया।
धारा: भारतीय न्याय संहिता (BNS) धारा 111, 318 एवं बीएसए 2024 धारा 63।`;

  const sampleBengali = `এফআইআর নং: WB-2026/088
থানা: শিলিগুড়ি জংশন থানা (জিরো এফআইআর)
অভিযুক্ত: রাজু মন্ডল (ওরফে রাজু সর্দার) বয়স ৩৮
মোবাইল: +919874556611
গাড়ি নম্বর: WB-24-K-9988
ঘটনাস্থল: শিলিগুড়ি করিডোর থেকে ইছাপুর ডিফেন্স এস্টেট
আইনি ধারা: BNS Sec 111 (Organized Crime), Arms Act Sec 25.`;

  const sampleEnglish = `FIRST INFORMATION REPORT (e-FIR No. WB-2026/912)
Police Station: Kolkata Port Trust PS
Date: 23/08/2026
Suspect: Sunil 'Doctor' Roy (Age 44)
Phone: +919831998877 | UPI: matrixops@okhdfcbank
Account: 50100991823411 (HDFC Bank Park Street)
Incident Locus: Dock-7 Maritime Container Yard (22.5411, 88.3217)
Narrative: Multi-modal cyber-fraud and Hawala laundering conduit transferring funds to Bitcoin vault bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh.
Statutory Code: Section 111 BNS 2024, IT Act Sec 66D, BSA Sec 63.`;

  const [rawText, setRawText] = useState(sampleFIRErickEkka);
  const [sourceType, setSourceType] = useState('FIR_NARRATIVE');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleIngest = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch('/api/ingest/ocr-ner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: rawText,
          source_type: sourceType,
          language: language,
          officer_badge: 'IO-KOLKATA-8842',
          role: currentRole
        })
      });
      const data = await resp.json();
      setExtractionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToGraph = () => {
    if (!extractionResult || !onOpenAddSuspectWithData) return;

    if (extractionResult.auto_filled_suspect) {
      onOpenAddSuspectWithData(extractionResult.auto_filled_suspect);
      return;
    }

    const ner = extractionResult.legal_ner_extraction?.entities || {};
    const bio = ner.biographic_data?.[0] || {};
    const comm = ner.communication_identifiers || [];
    const veh = ner.vehicular_logistics || [];
    const fin = ner.financial_instruments || [];
    const loc = ner.spatial_and_geographic || [];
    const stat = ner.statutory_and_legal || {};
    const crime = stat.crime_details || {};

    const prefill = {
      name: bio.full_name || bio.suspect_name || bio.name || "Extracted Suspect",
      aliases: bio.aliases || [],
      role: bio.role_inferred || crime.role || "Syndicate Operative",
      threat_score: bio.threat_score || 0.82,
      age: bio.age ? parseInt(bio.age, 10) : 31,
      gender: bio.gender || "Male",
      father_or_relative: bio.father_or_relative || "",
      crime_title: crime.crime_title || `Extracted Case: ${stat.fir_number || 'FIR Intelligence'}`,
      crime_category: crime.crime_category || "Arms Trafficking & Organised Crime",
      incident_narrative: crime.incident_narrative || rawText.substring(0, 400),
      modus_operandi: crime.modus_operandi || "Concealed vehicle cavity transport.",
      seized_contraband: crime.seized_contraband || "Country-made pistols, live rounds, vehicle, cash.",
      fir_number: stat.fir_number || "",
      police_station: stat.police_station || "Barrackpore Special Thana",
      phone_numbers: comm.filter(c => (c.type === 'PHONE' || c.type === 'Phone_Number' || c.type === 'Phone')).map(c => c.value),
      vehicle_plates: veh.map(v => v.plate_number),
      bank_accounts: fin.filter(f => (f.type === 'BANK_ACCOUNT' || f.type === 'Bank_Account')).map(f => f.identifier),
      upi_ids: fin.filter(f => (f.type === 'UPI_ID' || f.type === 'UPI')).map(f => f.identifier),
      locations: loc.map(l => l.location_name || l.district),
      statutory_acts: (stat.statutory_sections || []).map(sec => ({
        act: sec.includes('Arms') ? 'Arms Act 1959' : sec.includes('IT') ? 'Information Technology Act 2000' : 'Bharatiya Nyaya Sanhita (BNS) 2024',
        section: sec,
        title: sec,
        explanation: 'Extracted automatically from multilingual FIR narrative.'
      }))
    };

    onOpenAddSuspectWithData(prefill);
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '420px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Multilingual Document Scanner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Upload FIR & Police Document Scanner
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Paste or upload scanned FIRs, call logs, or diaries in English, Hindi, or Bengali to automatically extract key crime facts.
          </p>
        </div>

        {/* Source Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>Document Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              style={{ width: '100%', background: '#ffffff', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '6px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
            >
              <option value="FIR_NARRATIVE">FIR / Zero-FIR Report</option>
              <option value="CDR_IPDR">Phone Call Records (CDR)</option>
              <option value="BANK_STR">Bank / Hawala Log</option>
              <option value="OSINT_REPORT">Intelligence Report</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>Load Sample FIR</label>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => { setRawText(sampleFIRErickEkka); setLanguage('en'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px' }}>Erick FIR</button>
              <button type="button" onClick={() => { setRawText(sampleEnglish); setLanguage('en'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>English</button>
              <button type="button" onClick={() => { setRawText(sampleHindi); setLanguage('hi'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>हिन्दी</button>
              <button type="button" onClick={() => { setRawText(sampleBengali); setLanguage('bn'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>বাংলা</button>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <textarea
          rows={10}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste FIR text, charge-sheet, or seized document details in English, Hindi, or Bengali..."
          style={{
            width: '100%',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px',
            color: 'var(--text-primary)',
            fontSize: '12px',
            resize: 'none',
            outline: 'none',
            flex: 1,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
          }}
        />

        <button
          type="button"
          onClick={handleIngest}
          disabled={loading}
          className="btn-primary"
          style={{ justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 600 }}
        >
          <UploadCloud size={16} />
          <span>{loading ? 'Scanning & Extracting Information...' : 'Scan & Extract Case Details'}</span>
        </button>
      </div>

      {/* Right Column: Extracted Information Cards */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {extractionResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-cyan">
                  <Languages size={12} />
                  Language: {extractionResult.ocr_processing?.detected_language || 'English'}
                </span>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} />
                  {extractionResult.legal_ner_extraction?.total_entities_extracted} Details Extracted
                </span>
              </div>
              <button
                type="button"
                onClick={handleTransferToGraph}
                className="btn-primary"
                style={{
                  fontSize: '11px',
                  padding: '6px 14px',
                  fontWeight: 700
                }}
              >
                <UserPlus size={13} />
                <span>+ Add Extracted Suspect to Case</span>
              </button>
            </div>

            {/* 6 Core Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {/* Suspect Names & Aliases */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-crimson)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  1. Suspect Names & Aliases
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.biographic_data?.map((b, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    <strong>{b.full_name}</strong> {b.age ? `(Age: ${b.age})` : ''}
                    {b.aliases?.length > 0 && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Aliases: {b.aliases.join(', ')}</div>}
                  </div>
                ))}
              </div>

              {/* Phone Numbers & SIMs */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  2. Phone Numbers & SIMs
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.communication_identifiers?.map((c, i) => (
                  <div key={i} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '3px', fontWeight: 600 }}>
                    {c.type}: {c.value}
                  </div>
                ))}
              </div>

              {/* Spatial & Geographic */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  3. Crime Locations & Safehouses
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.spatial_and_geographic?.map((s, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {s.location_name} ({s.district})
                  </div>
                ))}
              </div>

              {/* Financial Instruments */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-violet)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  4. Bank Accounts & Hawala Wallets
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.financial_instruments?.map((f, i) => (
                  <div key={i} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#6d28d9', marginBottom: '3px', fontWeight: 600 }}>
                    {f.type}: {f.identifier}
                  </div>
                ))}
              </div>

              {/* Vehicular Logistics */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  5. Vehicles & License Plates
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.vehicular_logistics?.map((v, i) => (
                  <div key={i} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#b45309', marginBottom: '3px', fontWeight: 600 }}>
                    Plate: {v.plate_number}
                  </div>
                ))}
              </div>

              {/* Statutory & Legal Codes */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: '#b91c1c', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                  6. Applicable Legal Sections (BNS)
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Sections: {extractionResult.legal_ner_extraction?.entities?.statutory_and_legal?.statutory_sections?.join(', ') || 'BNS Sec 111'}
                </div>
                {extractionResult.legal_ner_extraction?.entities?.statutory_and_legal?.zero_fir_status && (
                  <span className="badge badge-amber" style={{ marginTop: '6px', fontSize: '9px' }}>Zero-FIR Recorded</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <FileCheck size={44} style={{ margin: '0 auto 12px', opacity: 0.4, color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Ready to Scan Police Documents
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              Paste any FIR text, charge-sheet, or seized document on the left and click Scan to extract names, phones, vehicles, and sections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
