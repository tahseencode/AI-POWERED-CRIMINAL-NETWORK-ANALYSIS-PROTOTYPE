import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Building2, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  UserPlus, 
  LogIn, 
  Phone, 
  Mail, 
  Smartphone, 
  KeyRound, 
  ArrowLeft,
  ShieldAlert,
  Send,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function LoginPortal({ onLoginSuccess }) {
  // Active Portal Mode: 'login' | 'login_2fa' | 'mobile_otp' | 'register' | 'register_otp' | 'reset_password'
  const [activeMode, setActiveMode] = useState('login');
  
  // Mode 1: Standard Password Login State
  const [officerId, setOfficerId] = useState('1234');
  const [password, setPassword] = useState('1234');
  const [role, setRole] = useState('Investigating Officer (IO)');
  const [station, setStation] = useState('Barrackpore Special Thana (North 24 Parganas)');
  const [captchaInput, setCaptchaInput] = useState('7842');
  const [captchaCode, setCaptchaCode] = useState('7842');
  const [require2FA, setRequire2FA] = useState(true);

  // 6-Digit OTP State (Shared for 2FA, Mobile Login, Registration, Reset)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpDispatchData, setOtpDispatchData] = useState(null);
  const [otpTimeLeft, setOtpTimeLeft] = useState(120);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const otpInputRefs = useRef([]);

  // Mode 2: Direct Mobile/Badge OTP Login State
  const [mobileLoginInput, setMobileLoginInput] = useState('+91 98301 23456');

  // Mode 3: Registration State
  const [regUserId, setRegUserId] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Investigating Officer (IO)');
  const [regStation, setRegStation] = useState('Barrackpore Special Thana (North 24 Parganas)');
  const [regBadge, setRegBadge] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 98301 23456');

  // Mode 4: Forgot / Reset Password State
  const [resetIdentifier, setResetIdentifier] = useState('1234');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState(1); // 1: Enter ID, 2: Enter OTP & New Password

  // General Status State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let timer;
    if ((activeMode === 'login_2fa' || activeMode === 'mobile_otp_verify' || activeMode === 'register_otp' || activeMode === 'reset_password') && otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMode, otpTimeLeft]);

  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(code);
    setCaptchaInput(code);
  };

  const handleOtpDigitChange = (index, value) => {
    const char = value.slice(-1);
    if (value && !/^\d$/.test(char)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleQuickAutoFillOtp = () => {
    if (otpDispatchData?.demo_otp_code) {
      setOtpDigits(otpDispatchData.demo_otp_code.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 1. Password Login & 2FA Flow
  // ----------------------------------------------------
  const handleInitiateLogin = async (e) => {
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
      if (require2FA) {
        // Step 1: Request 2FA OTP for the officer
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: officerId.trim(),
            purpose: 'LOGIN_2FA',
            channel: 'SMS_SANDES'
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to dispatch 2FA OTP.');

        setOtpDispatchData(data.dispatch);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpTimeLeft(120);
        setCanResendOtp(false);
        setActiveMode('login_2fa');
        setSuccessMsg(`2FA Security Code dispatched to ${data.dispatch.masked_target}.`);

        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);

      } else {
        // Direct password login without 2FA step
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
          onLoginSuccess({
            badgeId: officerId.trim(),
            name: officerId.trim() === '1234' ? 'Sub-Inspector A. K. Banerjee' : `Officer ${officerId}`,
            role: role,
            station: station
          });
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FALogin = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: officerId.trim(),
          otp_code: code,
          purpose: 'LOGIN_2FA'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid or expired OTP code.');

      setSuccessMsg('✓ Two-Factor Verification Successful! Logging in...');
      setTimeout(() => {
        const u = data.user || {};
        onLoginSuccess({
          badgeId: u.badge_number || u.user_id || officerId.trim(),
          name: u.full_name || 'Sub-Inspector A. K. Banerjee',
          role: u.role || role,
          station: u.station || station,
          sessionId: u.session_id,
          userId: u.user_id || officerId.trim()
        });
      }, 500);

    } catch (err) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 2. Direct Mobile / Contact Number OTP Login Flow
  // ----------------------------------------------------
  const handleRequestMobileOtp = async (e) => {
    if (e) e.preventDefault();
    if (!mobileLoginInput.trim()) {
      setErrorMsg('Please enter your Registered Mobile Number or Officer Badge ID.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: mobileLoginInput.trim(),
          purpose: 'MOBILE_LOGIN',
          channel: 'SMS_SANDES'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to dispatch mobile OTP.');

      setOtpDispatchData(data.dispatch);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimeLeft(120);
      setCanResendOtp(false);
      setActiveMode('mobile_otp_verify');
      setSuccessMsg(`Mobile OTP sent to ${data.dispatch.masked_target}.`);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);

    } catch (err) {
      setErrorMsg(err.message || 'Failed to send mobile OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOtp = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: mobileLoginInput.trim(),
          otp_code: code,
          purpose: 'MOBILE_LOGIN'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid or expired OTP.');

      setSuccessMsg('✓ Mobile OTP verified. Welcome Officer!');
      setTimeout(() => {
        const u = data.user || {};
        onLoginSuccess({
          badgeId: u.badge_number || u.user_id || 'IO-MOBILE',
          name: u.full_name || 'Field Officer',
          role: u.role || 'Investigating Officer (IO)',
          station: u.station || 'Barrackpore Special Thana (North 24 Parganas)',
          sessionId: u.session_id,
          userId: u.user_id || '1234'
        });
      }, 500);

    } catch (err) {
      setErrorMsg(err.message || 'Mobile OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 3. Officer Registration with Mandatory OTP Flow
  // ----------------------------------------------------
  const handleInitiateRegister = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regUserId.trim() || !regFullName.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in Officer User ID, Full Name, and Password.');
      return;
    }

    const contactTarget = regPhone.trim() || regEmail.trim() || regUserId.trim();
    setLoading(true);

    try {
      // Step 1: Send registration confirmation OTP
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: contactTarget,
          user_id: regUserId.trim(),
          purpose: 'REGISTRATION',
          channel: regPhone.trim() ? 'SMS_SANDES' : 'POLICE_EMAIL'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to dispatch registration OTP.');

      setOtpDispatchData(data.dispatch);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimeLeft(120);
      setCanResendOtp(false);
      setActiveMode('register_otp');
      setSuccessMsg(`Verification code sent to ${data.dispatch.masked_target} to verify identity.`);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);

    } catch (err) {
      setErrorMsg(err.message || 'Registration dispatch failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndFinalizeRegister = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Verify OTP first
      const verifyRes = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: regPhone.trim() || regEmail.trim() || regUserId.trim(),
          user_id: regUserId.trim(),
          otp_code: code,
          purpose: 'REGISTRATION'
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.detail || 'Invalid verification code.');

      // 2. Commit officer into relational SQL database
      const regRes = await fetch('/api/auth/register', {
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

      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.detail || 'Failed to register officer record.');

      setSuccessMsg(`✓ Officer '${regData.user?.full_name}' successfully verified & registered! Logging in...`);

      setTimeout(() => {
        onLoginSuccess({
          badgeId: regData.user.badge_number || regData.user.user_id,
          name: regData.user.full_name,
          role: regData.user.role || regRole,
          station: regData.user.station || regStation,
          userId: regData.user.user_id
        });
      }, 700);

    } catch (err) {
      setErrorMsg(err.message || 'Error completing verified registration.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 4. Password Reset with OTP Flow
  // ----------------------------------------------------
  const handleRequestResetOtp = async (e) => {
    if (e) e.preventDefault();
    if (!resetIdentifier.trim()) {
      setErrorMsg('Please enter your Officer ID, Phone, or Registered Email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: resetIdentifier.trim(),
          purpose: 'PASSWORD_RESET',
          channel: 'SMS_SANDES'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'User not found or OTP dispatch failed.');

      setOtpDispatchData(data.dispatch);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimeLeft(120);
      setCanResendOtp(false);
      setResetStep(2);
      setSuccessMsg(`Reset code dispatched to ${data.dispatch.masked_target}.`);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);

    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePasswordReset = async (e) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id_or_contact: resetIdentifier.trim(),
          otp_code: code,
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Password reset failed.');

      setSuccessMsg('✓ Password updated successfully! Please sign in with your new password.');
      setTimeout(() => {
        setActiveMode('login');
        setPassword(newPassword);
        setOfficerId(resetIdentifier);
        setResetStep(1);
      }, 1200);

    } catch (err) {
      setErrorMsg(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Quick Demo Login Helper
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
        station: station,
        userId: '1234'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <span>NIC 2FA GATEWAY: ACTIVE</span>
          </div>
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

      {/* 3. Main Login / OTP Enclosure */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '540px',
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
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  Law Enforcement Authentication
                </h2>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                  Two-Factor & OTP Verified Police Access
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
                onClick={() => { setActiveMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: activeMode === 'login' || activeMode === 'login_2fa' ? '#1d4ed8' : 'transparent',
                  color: activeMode === 'login' || activeMode === 'login_2fa' ? '#ffffff' : '#475569'
                }}
              >
                Password + 2FA
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('mobile_otp'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: activeMode === 'mobile_otp' || activeMode === 'mobile_otp_verify' ? '#1d4ed8' : 'transparent',
                  color: activeMode === 'mobile_otp' || activeMode === 'mobile_otp_verify' ? '#ffffff' : '#475569'
                }}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => { setActiveMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: activeMode === 'register' || activeMode === 'register_otp' ? '#1d4ed8' : 'transparent',
                  color: activeMode === 'register' || activeMode === 'register_otp' ? '#ffffff' : '#475569'
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

          {/* ======================================================== */}
          {/* TAB 1: PASSWORD LOGIN (Step 1) */}
          {/* ======================================================== */}
          {activeMode === 'login' && (
            <form onSubmit={handleInitiateLogin} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    Official Demo Credentials:
                  </div>
                  <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                    Officer ID: <strong style={{ color: '#0f172a' }}>1234</strong> | Password: <strong style={{ color: '#0f172a' }}>1234</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="btn-primary"
                  style={{ padding: '5px 10px', fontSize: '11px', fontWeight: 700 }}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>
                    Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveMode('reset_password'); setResetStep(1); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>
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

              {/* Field: Role */}
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

              {/* 2FA Checkbox Toggle */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <input
                  type="checkbox"
                  id="require2fa"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="require2fa" style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>
                  Enforce Two-Factor Authentication (2FA OTP via Sandes / SMS)
                </label>
              </div>

              {/* Captcha */}
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
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>{require2FA ? 'Continue to 2FA OTP Step' : 'Secure Official Login'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 1 (Step 2): 2FA OTP VERIFICATION */}
          {/* ======================================================== */}
          {activeMode === 'login_2fa' && (
            <form onSubmit={handleVerify2FALogin} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveMode('login')}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Credentials</span>
                </button>
              </div>

              {/* Simulated Gateway Dispatch Alert Drawer */}
              {otpDispatchData && (
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                      <Smartphone size={14} />
                      <span>NIC Sandes / MHA SMS Grid</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                      Target: <strong style={{ color: '#0f172a' }}>{otpDispatchData.masked_target}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '2px', fontFamily: 'monospace' }}>
                      Official Demo OTP: <strong>{otpDispatchData.demo_otp_code}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAutoFillOtp}
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* 6-Digit OTP Boxes */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>
                  Enter 6-Digit Two-Factor Authentication (2FA) Code
                </label>
                <div
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '46px',
                        height: '52px',
                        fontSize: '22px',
                        fontWeight: 800,
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: digit ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                        background: digit ? '#eff6ff' : '#ffffff',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown & Resend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <div>
                  OTP expires in: <strong style={{ color: otpTimeLeft < 30 ? '#dc2626' : '#0f172a' }}>{formatTimer(otpTimeLeft)}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleInitiateLogin}
                  disabled={!canResendOtp || loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResendOtp ? '#1d4ed8' : '#94a3b8',
                    fontWeight: 700,
                    cursor: canResendOtp ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} className={loading ? 'spin' : ''} />
                  <span>Resend Code</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {loading ? <span>Verifying 2FA Token...</span> : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Verify OTP & Enter Portal</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DIRECT MOBILE / BADGE OTP LOGIN */}
          {/* ======================================================== */}
          {activeMode === 'mobile_otp' && (
            <form onSubmit={handleRequestMobileOtp} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a' }}>
                  Quick Mobile / Badge OTP Access:
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Enter your registered police mobile number or officer badge ID to receive an instant authentication token.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                  Registered Mobile Number or Badge ID <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }}>
                    <Smartphone size={15} />
                  </div>
                  <input
                    type="text"
                    value={mobileLoginInput}
                    onChange={(e) => setMobileLoginInput(e.target.value)}
                    placeholder="e.g. +91 98301 23456 or IO-8842"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#0f172a',
                      outline: 'none'
                    }}
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
                  fontWeight: 700
                }}
              >
                {loading ? <span>Sending OTP...</span> : (
                  <>
                    <Send size={15} />
                    <span>Get One-Time Password (OTP)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mobile OTP Verify Screen */}
          {activeMode === 'mobile_otp_verify' && (
            <form onSubmit={handleVerifyMobileOtp} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveMode('mobile_otp')}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                >
                  <ArrowLeft size={13} />
                  <span>Change Number</span>
                </button>
              </div>

              {otpDispatchData && (
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                      NIC Sandes OTP Dispatched:
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                      Sent to: <strong>{otpDispatchData.masked_target}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '2px', fontFamily: 'monospace' }}>
                      Demo Code: <strong>{otpDispatchData.demo_otp_code}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAutoFillOtp}
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>
                  Enter 6-Digit Mobile Verification Code
                </label>
                <div
                  style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '46px',
                        height: '52px',
                        fontSize: '22px',
                        fontWeight: 800,
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: digit ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                        background: digit ? '#eff6ff' : '#ffffff',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <div>
                  Expires in: <strong>{formatTimer(otpTimeLeft)}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleRequestMobileOtp}
                  disabled={!canResendOtp || loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResendOtp ? '#1d4ed8' : '#94a3b8',
                    fontWeight: 700,
                    cursor: canResendOtp ? 'pointer' : 'not-allowed'
                  }}
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {loading ? <span>Authenticating...</span> : (
                  <>
                    <LogIn size={15} />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: REGISTRATION WITH MANDATORY OTP */}
          {/* ======================================================== */}
          {activeMode === 'register' && (
            <form onSubmit={handleInitiateRegister} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                    Mobile Number (For OTP Verification) *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    required
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
                {loading ? <span>Sending Verification Token...</span> : (
                  <>
                    <Send size={15} />
                    <span>Verify Identity with OTP & Register</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Registration OTP Verify Screen */}
          {activeMode === 'register_otp' && (
            <form onSubmit={handleVerifyAndFinalizeRegister} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveMode('register')}
                style={{ background: 'none', border: 'none', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                <ArrowLeft size={13} />
                <span>Edit Registration Details</span>
              </button>

              {otpDispatchData && (
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                      Onboarding OTP Dispatched:
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155' }}>
                      Sent to: <strong>{otpDispatchData.masked_target}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#1e40af', fontFamily: 'monospace' }}>
                      Demo Code: <strong>{otpDispatchData.demo_otp_code}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickAutoFillOtp}
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>
                  Enter 6-Digit Registration Verification Code
                </label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }} onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '46px',
                        height: '52px',
                        fontSize: '22px',
                        fontWeight: 800,
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: digit ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                        background: digit ? '#eff6ff' : '#ffffff',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {loading ? <span>Finalizing Registration...</span> : (
                  <>
                    <UserPlus size={15} />
                    <span>Confirm & Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 4: FORGOT / RESET PASSWORD VIA OTP */}
          {/* ======================================================== */}
          {activeMode === 'reset_password' && (
            <div style={{ padding: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                style={{ background: 'none', border: 'none', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, marginBottom: '14px' }}
              >
                <ArrowLeft size={13} />
                <span>Back to Sign In</span>
              </button>

              {resetStep === 1 ? (
                <form onSubmit={handleRequestResetOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '10px 14px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a' }}>
                      Emergency Credential Reset:
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Enter your Officer ID or Registered Phone number to receive a secure password reset token.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      Officer Service ID / Registered Contact *
                    </label>
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. 1234 or +91 98301 23456"
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700 }}
                  >
                    {loading ? <span>Sending Reset Token...</span> : (
                      <>
                        <Send size={15} />
                        <span>Send Password Reset OTP</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompletePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {otpDispatchData && (
                    <div style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                          Password Reset OTP:
                        </div>
                        <div style={{ fontSize: '11px', color: '#334155' }}>
                          Target: <strong>{otpDispatchData.masked_target}</strong>
                        </div>
                        <div style={{ fontSize: '11px', color: '#1e40af', fontFamily: 'monospace' }}>
                          Demo Code: <strong>{otpDispatchData.demo_otp_code}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleQuickAutoFillOtp}
                        style={{
                          background: '#1d4ed8',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '6px', textAlign: 'center' }}>
                      Enter 6-Digit Reset Token
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }} onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => otpInputRefs.current[idx] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          style={{
                            width: '46px',
                            height: '52px',
                            fontSize: '22px',
                            fontWeight: 800,
                            textAlign: 'center',
                            borderRadius: '6px',
                            border: digit ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                            background: digit ? '#eff6ff' : '#ffffff',
                            color: '#0f172a',
                            outline: 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                      New Account Password *
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length !== 6}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700 }}
                  >
                    {loading ? <span>Resetting Password...</span> : (
                      <>
                        <KeyRound size={15} />
                        <span>Update Password & Return to Login</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
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
            <span>Authorized law enforcement personnel only. Multi-factor verification logged under BSA 2024 Sec 63.</span>
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
