import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, AlertCircle, RefreshCw, CheckCircle2, X, Send, KeyRound, Smartphone, Mail, ShieldAlert } from 'lucide-react';

export default function OtpVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = "High-Assurance Police Operation",
  actionDescription = "This action requires two-factor statutory authorization under Bharatiya Sakshya Adhiniyam (BSA) 2024 Sec 63.",
  userId = "1234",
  officerBadge = "WB-POL-8842",
  defaultChannel = "SMS_SANDES"
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dispatchData, setDispatchData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 mins countdown
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
      setSuccessMsg('');
      setTimeLeft(120);
      setCanResend(false);
      requestOtp();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const requestOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || officerBadge || '1234',
          purpose: 'STEPUP_AUTH',
          action_name: actionTitle,
          channel: defaultChannel
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to dispatch OTP");
      setDispatchData(data.dispatch);
      setTimeLeft(120);
      setCanResend(false);

      // Auto-focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with police OTP gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index, value) => {
    // Only accept numeric character
    const char = value.slice(-1);
    if (value && !/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('');
      setDigits(arr);
      inputRefs.current[5]?.focus();
    }
  };

  const handleQuickAutoFill = () => {
    if (dispatchData?.demo_otp_code) {
      const codeArr = dispatchData.demo_otp_code.split('');
      setDigits(codeArr);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const enteredCode = digits.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp/stepup-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || '1234',
          otp_code: enteredCode,
          action_name: actionTitle,
          officer_badge: officerBadge
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed");

      setSuccessMsg(`✓ 2FA Authorization Verified for: ${actionTitle}`);
      setTimeout(() => {
        onSuccess && onSuccess(data);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '480px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#0f2942',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid #ff9933'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: '#1e3a8a',
              border: '1px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <KeyRound size={16} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                MHA BSA 2024 SEC 63 STEP-UP 2FA
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Two-Factor Security Authorization
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '20px' }}>
          {/* Action Context Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase' }}>
              Action to Authorize:
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              {actionTitle}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
              {actionDescription}
            </div>
          </div>

          {/* Simulated Gateway Dispatch Toast */}
          {dispatchData && (
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#1d4ed8' }}>
                  <Smartphone size={13} />
                  <span>NIC Sandes / MHA SMS Grid</span>
                </div>
                <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>
                  Sent to: <strong style={{ color: '#0f172a' }}>{dispatchData.masked_target}</strong>
                </div>
                <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '2px', fontFamily: 'monospace' }}>
                  Demo Token: <strong>{dispatchData.demo_otp_code}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickAutoFill}
                style={{
                  background: '#1d4ed8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Auto-Fill Code
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              padding: '8px 12px',
              color: '#991b1b',
              fontSize: '12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '4px',
              padding: '8px 12px',
              color: '#166534',
              fontSize: '12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 6 Digit Split Input Container */}
          <form onSubmit={handleVerify}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '8px', textAlign: 'center' }}>
              Enter 6-Digit One-Time Password (OTP)
            </label>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px'
            }} onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
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
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>

            {/* Timer & Resend Option */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              fontSize: '11px',
              color: '#64748b'
            }}>
              <div>
                Code expires in: <strong style={{ color: timeLeft < 30 ? '#dc2626' : '#0f172a' }}>{formatTimer(timeLeft)}</strong>
              </div>
              <button
                type="button"
                onClick={requestOtp}
                disabled={!canResend || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: canResend ? '#1d4ed8' : '#94a3b8',
                  fontWeight: 700,
                  cursor: canResend ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} className={loading ? 'spin' : ''} />
                <span>Resend OTP</span>
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || digits.join('').length !== 6}
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '10px',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                {loading ? <span>Verifying OTP...</span> : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Authorize & Proceed</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Disclaimer */}
        <div style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          padding: '10px 16px',
          fontSize: '10px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ShieldAlert size={14} color="#1e40af" />
          <span>Statutory authorization cryptographically recorded in tamper-evident BSA audit trail.</span>
        </div>
      </div>
    </div>
  );
}
