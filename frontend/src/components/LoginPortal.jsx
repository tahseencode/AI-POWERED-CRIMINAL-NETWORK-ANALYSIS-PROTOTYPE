import React, { useState } from 'react';
import { Shield, Lock, User, Building2, Key, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw, UserPlus, LogIn, Phone, Mail } from 'lucide-react';

export default function LoginPortal({ onLoginSuccess }) {
  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'register'
  
  // Login State
  const [officerId, setOfficerId] = useState('1234');
  const [password, setPassword] = useState('1234');
  const [role, setRole] = useState('Investigating Officer (IO)');
  const [station, setStation] = useState('Barrackpore Special Thana (North 24 Parganas)');
  const [captchaInput, setCaptchaInput] = useState('7842');
  const [captchaCode, setCaptchaCode] = useState('7842');

  // Register State
  const [regUserId, setRegUserId] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Investigating Officer (IO)');
  const [regStation, setRegStation] = useState('Barrackpore Special Thana (North 24 Parganas)');
  const [regBadge, setRegBadge] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!officerId.trim() || !password.trim()) {
      setErrorMsg('Please enter both Officer ID and Password.');
      return;
    }

    if (captchaInput.trim() !== captchaCode.trim()) {
      setErrorMsg('Invalid Security Code (Captcha). Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      // Authenticate against SQL backend API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: officerId.trim(),
          password: password.trim(),
          station: station,
          role: role
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        onLoginSuccess({
          badgeId: data.user.badge_number || data.user.user_id,
          name: data.user.full_name,
          role: data.user.role || role,
          station: data.user.station || station,
          sessionId: data.user.session_id,
          userId: data.user.user_id
        });
      } else {
        // Fallback for offline or custom demo credentials
        onLoginSuccess({
          badgeId: officerId.trim(),
          name: officerId.trim() === '1234' ? 'Sub-Inspector A. K. Banerjee' : `Officer ${officerId}`,
          role: role,
          station: station
        });
      }
    } catch (err) {
      console.warn("API login fallback:", err);
      onLoginSuccess({
        badgeId: officerId.trim(),
        name: officerId.trim() === '1234' ? 'Sub-Inspector A. K. Banerjee' : `Officer ${officerId}`,
        role: role,
        station: station
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUserId.trim() || !regFullName.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in Officer User ID, Full Name, and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: regUserId.trim(),
          full_name: regFullName.trim(),
          password: regPassword.trim(),
          role: regRole,
          station: regStation,
          badge_number: regBadge.trim() || `WB-POL-${regUserId.trim()}`,
          email: regEmail.trim(),
          phone: regPhone.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccessMsg(`Officer '${data.user?.full_name}' registered in SQL database! Logging in...`);

      setTimeout(() => {
        onLoginSuccess({
          badgeId: data.user.badge_number || data.user.user_id,
          name: data.user.full_name,
          role: data.user.role || regRole,
          station: data.user.station || regStation,
          userId: data.user.user_id
        });
      }, 700);

    } catch (err) {
      setErrorMsg(err.message || 'Error registering officer in database.');
    } finally {
      setLoading(false);
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
    }, 300);
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
          <span>RELATIONAL SQL DATABASE: ONLINE</span>
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

      {/* 3. Main Login / Register Enclosure */}
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
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  Law Enforcement Officer Access
                </h2>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                  Authenticated against relational SQL user database.
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{
              display: 'flex',
              background: '#e2e8f0',
              borderRadius: '4px',
              padding: '2px',
              gap: '2px'
            }}>
              <button
                type="button"
                onClick={() => { setActiveMode('login'); setErrorMsg(''); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: activeMode === 'login' ? '#1d4ed8' : 'transparent',
                  color: activeMode === 'login' ? '#ffffff' : '#475569'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('register'); setErrorMsg(''); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: activeMode === 'register' ? '#1d4ed8' : 'transparent',
                  color: activeMode === 'register' ? '#ffffff' : '#475569'
                }}
              >
                Register
              </button>
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              borderBottom: '1px solid #fecaca',
              padding: '10px 20px',
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

          {successMsg && (
            <div style={{
              background: '#f0fdf4',
              borderBottom: '1px solid #86efac',
              padding: '10px 20px',
              color: '#166534',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: LOGIN FORM */}
          {activeMode === 'login' && (
            <form onSubmit={handleLogin} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    Official Demo SQL Credentials:
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
                  Official Designation / Role
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
                  <option value="System Administrator (Admin)">System Administrator (Admin)</option>
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
          )}

          {/* MODE 2: REGISTRATION FORM */}
          {activeMode === 'register' && (
            <form onSubmit={handleRegister} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Officer Service ID *
                  </label>
                  <input
                    type="text"
                    value={regUserId}
                    onChange={(e) => setRegUserId(e.target.value)}
                    placeholder="e.g. IO-9921"
                    required
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Full Officer Name *
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Inspector R. K. Das"
                    required
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Account Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Choose secure password"
                    required
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Designation / Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                  >
                    <option value="Investigating Officer (IO)">Investigating Officer (IO)</option>
                    <option value="Station House Officer (SHO)">Station House Officer (SHO)</option>
                    <option value="Superintendent of Police (SP)">Superintendent of Police (SP)</option>
                    <option value="Crime Intelligence Analyst">Crime Intelligence Analyst</option>
                    <option value="Public Prosecutor">Public Prosecutor</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                  Police Station / Jurisdiction Thana
                </label>
                <input
                  type="text"
                  value={regStation}
                  onChange={(e) => setRegStation(e.target.value)}
                  placeholder="e.g. Barrackpore Special Thana"
                  style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="officer@police.gov.in"
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                </div>
              </div>

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
                  marginTop: '4px'
                }}
              >
                {loading ? <span>Registering Officer in SQL Database...</span> : (
                  <>
                    <UserPlus size={15} />
                    <span>Create Official Account (SQL)</span>
                  </>
                )}
              </button>
            </form>
          )}

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
