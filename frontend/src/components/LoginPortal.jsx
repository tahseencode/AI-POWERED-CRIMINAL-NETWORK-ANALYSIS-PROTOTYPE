import React, { useState } from 'react';
import { Shield, Lock, User, Building2, Key, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function LoginPortal({ onLoginSuccess }) {
  const [officerId, setOfficerId] = useState('1234');
  const [password, setPassword] = useState('1234');
  const [role, setRole] = useState('Investigating Officer (IO)');
  const [station, setStation] = useState('Barrackpore Special Thana (North 24 Parganas)');
  const [captchaInput, setCaptchaInput] = useState('7842');
  const [captchaCode, setCaptchaCode] = useState('7842');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!officerId.trim() || !password.trim()) {
      setErrorMsg('Please enter both Officer ID and Password.');
      return;
    }

    if (captchaInput.trim() !== captchaCode.trim()) {
      setErrorMsg('Invalid Security Code (Captcha). Please re-enter.');
      return;
    }

    // Sample ID & Password check: '1234' / '1234' (also accept any valid credentials)
    if (officerId.trim() === '1234' && password.trim() === '1234') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          badgeId: 'IO-8842 (ID: 1234)',
          name: 'Sub-Inspector A. K. Banerjee',
          role: role,
          station: station
        });
      }, 500);
    } else {
      // Allow custom officer ID/pass or inform user of sample 1234
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          badgeId: officerId,
          name: `Officer ${officerId}`,
          role: role,
          station: station
        });
      }, 500);
    }
  };

  const handleQuickDemoLogin = () => {
    setOfficerId('1234');
    setPassword('1234');
    setCaptchaInput(captchaCode);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        badgeId: 'IO-8842 (ID: 1234)',
        name: 'Sub-Inspector A. K. Banerjee',
        role: role,
        station: station
      });
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f1f5f9'
    }}>
      {/* 1. Official Top Banner */}
      <header style={{
        background: '#0f2942',
        color: '#ffffff',
        padding: '12px 24px',
        borderBottom: '3px solid #ff9933',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '4px',
            background: '#1e3a8a',
            border: '1px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Government of India • Ministry of Home Affairs / State Police
            </div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px', margin: 0 }}>
              CRIME & CRIMINAL NETWORK ANALYSIS PORTAL (CCTNS / ICJS INTEGRATED)
            </h1>
          </div>
        </div>

        <div style={{
          background: '#14532d',
          border: '1px solid #22c55e',
          color: '#86efac',
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={13} color="#86efac" />
          <span>NATIONAL ICJS GRID: SECURE & ONLINE</span>
        </div>
      </header>

      {/* 2. Tricolor National Accent Bar */}
      <div style={{
        height: '4px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        <div style={{ background: '#ff9933' }} />
        <div style={{ background: '#ffffff' }} />
        <div style={{ background: '#138808' }} />
      </div>

      {/* 3. Main Login Enclosure */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          {/* Card Header Strip */}
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #cbd5e1',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Law Enforcement Officer Authentication
              </h2>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                Enter your official badge ID and credentials to access case intelligence.
              </p>
            </div>
          </div>

          {/* Login Form Body */}
          <form onSubmit={handleLogin} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '10px 12px',
                color: '#b91c1c',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Credentials Info Box */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '4px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700 }}>
                  Official Demo Access Credentials:
                </div>
                <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                  Officer ID: <strong style={{ color: '#0f172a' }}>1234</strong> | Password: <strong style={{ color: '#0f172a' }}>1234</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="btn-primary"
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                1-Click Login
              </button>
            </div>

            {/* Field: Officer ID */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Officer Badge ID / Service Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }}>
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. 1234 or IO-8842"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }}>
                  <Key size={15} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 1234"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Field: Official Role */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Official Designation / Role <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#0f172a',
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Investigating Officer (IO)">Investigating Officer (IO)</option>
                <option value="Station House Officer (SHO)">Station House Officer (SHO)</option>
                <option value="Superintendent of Police (SP)">Superintendent of Police (SP)</option>
                <option value="Crime Intelligence Analyst">Crime Intelligence Analyst</option>
                <option value="Public Prosecutor">Public Prosecutor</option>
              </select>
            </div>

            {/* Field: Police Station */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Police Station / Jurisdiction Thana
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#0f172a',
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Barrackpore Special Thana (North 24 Parganas)">Barrackpore Special Thana (North 24 Parganas)</option>
                <option value="Kolkata Cyber Crime Cell (Lalbazar)">Kolkata Cyber Crime Cell (Lalbazar)</option>
                <option value="Siliguri Junction Special PS (Darjeeling)">Siliguri Junction Special PS (Darjeeling)</option>
                <option value="Asansol Special Operations PS (Paschim Bardhaman)">Asansol Special Operations PS (Paschim Bardhaman)</option>
                <option value="CID West Bengal HQ (Bhabani Bhawan)">CID West Bengal HQ (Bhabani Bhawan)</option>
              </select>
            </div>

            {/* Security Captcha Code */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                Security Verification Code <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter code"
                  required
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                />
                <div style={{
                  background: '#1e293b',
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '4px',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  userSelect: 'none',
                  fontFamily: 'monospace'
                }}>
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="btn-secondary"
                  style={{ padding: '8px 10px' }}
                  title="Refresh Captcha"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 700,
                marginTop: '6px'
              }}
            >
              {loading ? (
                <span>Authenticating Officer Credentials...</span>
              ) : (
                <>
                  <span>Secure Official Login</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Statutory Security Disclaimer */}
          <div style={{
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '12px 20px',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} color="#15803d" />
            <span>Authorized law enforcement personnel only. All access is logged under BSA 2024 Sec 63.</span>
          </div>
        </div>
      </div>

      {/* 4. Official Footer */}
      <footer style={{
        background: '#0f2942',
        color: '#cbd5e1',
        borderTop: '3px solid #ff9933',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '11px'
      }}>
        <div>
          <strong style={{ color: '#ffffff' }}>Government of India • Ministry of Home Affairs (MHA)</strong>
          <span style={{ margin: '0 8px', color: '#64748b' }}>|</span>
          <span>Inter-Operable Criminal Justice System (ICJS) & CCTNS Integrated</span>
        </div>
        <div style={{ color: '#94a3b8' }}>
          <span>Restricted Police Portal • ISO/IEC 27001 Security Compliant</span>
        </div>
      </footer>
    </div>
  );
}
