import React, { useState } from 'react';
import { FileText, UploadCloud, Cpu, CheckCircle2, Shield, Languages, FileCheck, UserPlus, Sparkles } from 'lucide-react';

export default function DataIngestionStudio({ currentRole, onOpenAddSuspectWithData }) {
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

  const [rawText, setRawText] = useState(sampleEnglish);
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
    const ner = extractionResult.legal_ner_extraction?.entities || {};
    const bio = ner.biographic_data?.[0] || {};
    const comm = ner.communication_identifiers || [];
    const veh = ner.vehicular_logistics || [];
    const fin = ner.financial_instruments || [];
    const loc = ner.spatial_and_geographic || [];
    const stat = ner.statutory_and_legal || {};

    const prefill = {
      name: bio.suspect_name || "Extracted Suspect",
      aliases: bio.aliases || [],
      age: bio.age ? parseInt(bio.age, 10) : 35,
      gender: "Male",
      threat_score: 0.80,
      crime_title: `Extracted Case: ${stat.fir_number || 'FIR Intelligence'}`,
      crime_category: "Organized Crime & Syndicate",
      incident_narrative: rawText.substring(0, 300),
      fir_number: stat.fir_number || "",
      police_station: stat.police_station || "Special Cell",
      phone_numbers: comm.filter(c => c.type === 'PHONE').map(c => c.value),
      vehicle_plates: veh.map(v => v.plate_number),
      bank_accounts: fin.filter(f => f.type === 'BANK_ACCOUNT').map(f => f.identifier),
      upi_ids: fin.filter(f => f.type === 'UPI_ID').map(f => f.identifier),
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
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '440px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Multilingual Ingestion Studio */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
              Multimodal Ingestion & Legal NER
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Multilingual OCR (En/Hi/Bn) & Maitreyi-Y1 Legal LLM parsing BNS/BNSS/BSA schemas.
          </p>
        </div>

        {/* Ingestion Source Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              style={{ width: '100%', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '12px', marginTop: '4px' }}
            >
              <option value="FIR_NARRATIVE">FIR / e-FIR / Zero-FIR</option>
              <option value="CDR_IPDR">CDR / IPDR Log Dump</option>
              <option value="BANK_STR">Financial Hawala Log</option>
              <option value="OSINT_REPORT">Surveillance / OSINT</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Sample Script</label>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <button onClick={() => { setRawText(sampleEnglish); setLanguage('en'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px' }}>En</button>
              <button onClick={() => { setRawText(sampleHindi); setLanguage('hi'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px' }}>हिन्दी</button>
              <button onClick={() => { setRawText(sampleBengali); setLanguage('bn'); }} className="btn-primary" style={{ padding: '5px 8px', fontSize: '11px' }}>বাংলা</button>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <textarea
          rows={10}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste legacy FIR scan text, charge-sheet, or diary entry in English, Hindi, or Bengali..."
          style={{
            width: '100%',
            background: 'rgba(7, 9, 14, 0.75)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px',
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            resize: 'none',
            outline: 'none',
            flex: 1
          }}
        />

        <button
          onClick={handleIngest}
          disabled={loading}
          className="btn-primary"
          style={{ justifyContent: 'center', padding: '10px' }}
        >
          <UploadCloud size={16} />
          <span>{loading ? 'Processing Multilingual OCR & NER...' : 'Ingest & Extract Legal Entities'}</span>
        </button>
      </div>

      {/* Right Column: Extracted Legal Ontologies */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {extractionResult ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-cyan">
                  <Languages size={12} />
                  {extractionResult.ocr_processing?.detected_language}
                </span>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} />
                  {extractionResult.legal_ner_extraction?.total_entities_extracted} Entities Extracted
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleTransferToGraph}
                  className="btn-primary"
                  style={{
                    fontSize: '11px',
                    padding: '5px 12px',
                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(124, 77, 255, 0.35) 100%)',
                    border: '1px solid var(--accent-cyan)'
                  }}
                  title="Open Add Suspect Modal with extracted details"
                >
                  <UserPlus size={13} color="var(--accent-cyan)" />
                  <span>+ Ingest Extracted Suspect to Graph</span>
                </button>
                <span className="badge badge-violet" style={{ fontSize: '9px' }}>
                  Maitreyi-Y1 BNS LoRA
                </span>
              </div>
            </div>

            {/* 6 Core Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {/* Biographic Data */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. Biographic Data
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.biographic_data?.map((b, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>
                    <strong>{b.full_name}</strong> {b.age ? `(Age: ${b.age})` : ''}
                    {b.aliases?.length > 0 && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Aliases: {b.aliases.join(', ')}</div>}
                  </div>
                ))}
              </div>

              {/* Communication Identifiers */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. Communication Identifiers
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.communication_identifiers?.map((c, i) => (
                  <div key={i} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '3px' }}>
                    {c.type}: {c.value}
                  </div>
                ))}
              </div>

              {/* Spatial & Geographic */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  3. Spatial & Geographic
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.spatial_and_geographic?.map((s, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>
                    {s.location_name} ({s.district})
                  </div>
                ))}
              </div>

              {/* Financial Instruments */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-violet)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  4. Financial Instruments
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.financial_instruments?.map((f, i) => (
                  <div key={i} style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#d8b4fe', marginBottom: '3px' }}>
                    {f.type}: {f.identifier}
                  </div>
                ))}
              </div>

              {/* Vehicular Logistics */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  5. Vehicular Logistics
                </h4>
                {extractionResult.legal_ner_extraction?.entities?.vehicular_logistics?.map((v, i) => (
                  <div key={i} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginBottom: '3px' }}>
                    Plate: {v.plate_number}
                  </div>
                ))}
              </div>

              {/* Statutory & Legal Codes */}
              <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px' }}>
                <h4 style={{ fontSize: '11px', color: '#f43f5e', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  6. Statutory & Legal
                </h4>
                <div style={{ fontSize: '12px', color: '#fff' }}>
                  Sections: {extractionResult.legal_ner_extraction?.entities?.statutory_and_legal?.statutory_sections?.join(', ') || 'BNS Sec 111'}
                </div>
                {extractionResult.legal_ner_extraction?.entities?.statutory_and_legal?.zero_fir_status && (
                  <span className="badge badge-amber" style={{ marginTop: '6px', fontSize: '9px' }}>Zero-FIR Detected</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <FileCheck size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>
              Multilingual Legal Extraction Engine
            </h3>
            <p style={{ fontSize: '12px' }}>
              Input any Indian law enforcement text or document scan on the left to extract the 6 core intelligence ontologies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
