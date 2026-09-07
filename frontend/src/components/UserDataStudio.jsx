import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  Activity, 
  FileText, 
  Radio, 
  Terminal, 
  Plus, 
  Search, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Tag, 
  Trash2, 
  Play, 
  RefreshCw, 
  ChevronRight, 
  UserCheck, 
  Lock, 
  Send,
  Eye,
  Key,
  HardDrive,
  Table,
  Check,
  Building,
  BadgeAlert,
  KeyRound,
  Smartphone,
  Zap,
  ShieldAlert
} from 'lucide-react';

export default function UserDataStudio({ officerUser, currentRole }) {
  const [activeSubTab, setActiveSubTab] = useState('officers');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Officers Data
  const [officers, setOfficers] = useState([]);
  const [officerSearch, setOfficerSearch] = useState('');
  const [officerRoleFilter, setOfficerRoleFilter] = useState('');
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false);
  const [newOfficerForm, setNewOfficerForm] = useState({
    user_id: '',
    full_name: '',
    password: '',
    role: 'Investigating Officer (IO)',
    station: 'Barrackpore Special Thana (North 24 Parganas)',
    badge_number: '',
    email: '',
    phone: '',
    department: 'Organized Crime & Firearms Investigation Wing'
  });

  // 2. Activity Logs
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityFilter, setActivityFilter] = useState('');

  // 3. Case Notes Data
  const [caseNotes, setCaseNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({
    title: '',
    note_content: '',
    suspect_id: '',
    priority: 'HIGH',
    tags: 'Surveillance, Arms, Transit'
  });
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  // 4. Field Reports Data
  const [fieldReports, setFieldReports] = useState([]);
  const [reportForm, setReportForm] = useState({
    subject: '',
    description: '',
    report_type: 'FIELD_INTELLIGENCE',
    reporter_name: officerUser?.name || 'Field Operative',
    location: 'Barrackpore Tactical Corridor',
    evidence_refs: 'CCTV-CAM-04 / Intercept 9831'
  });
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);

  // 5. SQL Console & Database Stats
  const [dbStats, setDbStats] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('SELECT user_id, full_name, role, station, created_at FROM users;');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlExecuting, setSqlExecuting] = useState(false);
  const [selectedTable, setSelectedTable] = useState('users');

  // 6. 2FA & OTP Security Telemetry Data
  const [otpLogs, setOtpLogs] = useState([]);
  const [otpStats, setOtpStats] = useState(null);
  const [testOtpTarget, setTestOtpTarget] = useState('+91 98301 23456');
  const [testOtpUserId, setTestOtpUserId] = useState('1234');
  const [testOtpPurpose, setTestOtpPurpose] = useState('LOGIN_2FA');
  const [testOtpChannel, setTestOtpChannel] = useState('SMS_SANDES');
  const [testOtpResult, setTestOtpResult] = useState(null);
  const [testVerifyCode, setTestVerifyCode] = useState('');
  const [testVerifyResult, setTestVerifyResult] = useState(null);
  const [testOtpSending, setTestOtpSending] = useState(false);

  useEffect(() => {
    fetchDataForTab(activeSubTab);
  }, [activeSubTab]);

  const showFeedback = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const fetchDataForTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'officers') {
        const res = await fetch('/api/users').then(r => r.json());
        setOfficers(res.users || []);
      } else if (tab === 'activity') {
        const res = await fetch('/api/users/activity').then(r => r.json());
        setActivityLogs(res.logs || []);
      } else if (tab === 'notes') {
        const res = await fetch('/api/users/notes').then(r => r.json());
        setCaseNotes(res.notes || []);
      } else if (tab === 'reports') {
        const res = await fetch('/api/users/reports').then(r => r.json());
        setFieldReports(res.reports || []);
      } else if (tab === 'sql') {
        const stats = await fetch('/api/database/stats').then(r => r.json());
        setDbStats(stats);
      } else if (tab === 'otp') {
        const [logsRes, statsRes] = await Promise.all([
          fetch('/api/auth/otp/logs').then(r => r.json()),
          fetch('/api/auth/otp/stats').then(r => r.json())
        ]);
        setOtpLogs(logsRes.logs || []);
        setOtpStats(statsRes);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Register New Officer
  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!newOfficerForm.user_id || !newOfficerForm.full_name || !newOfficerForm.password) {
      showFeedback("Please fill in User ID, Full Name, and Password.", true);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOfficerForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      showFeedback(`Officer '${data.user?.full_name}' successfully added to SQL database.`);
      setIsAddOfficerOpen(false);
      setNewOfficerForm({
        user_id: '',
        full_name: '',
        password: '',
        role: 'Investigating Officer (IO)',
        station: 'Barrackpore Special Thana (North 24 Parganas)',
        badge_number: '',
        email: '',
        phone: '',
        department: 'Organized Crime & Firearms Investigation Wing'
      });
      fetchDataForTab('officers');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Handler: Add Case Note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.note_content) {
      showFeedback("Please provide a Title and Note Content.", true);
      return;
    }
    try {
      const payload = {
        user_id: officerUser?.badgeId || '1234',
        officer_name: officerUser?.name || 'Sub-Inspector A. K. Banerjee',
        title: noteForm.title,
        note_content: noteForm.note_content,
        suspect_id: noteForm.suspect_id || null,
        priority: noteForm.priority,
        tags: noteForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const res = await fetch('/api/users/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to save note");
      showFeedback("Case note recorded in SQL database.");
      setIsAddNoteOpen(false);
      setNoteForm({
        title: '',
        note_content: '',
        suspect_id: '',
        priority: 'HIGH',
        tags: 'Surveillance, Arms, Transit'
      });
      fetchDataForTab('notes');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Handler: Delete Case Note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm(`Are you sure you want to delete Case Note #${noteId}?`)) return;
    try {
      const res = await fetch(`/api/users/notes/${noteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Delete failed");
      showFeedback(`Note #${noteId} deleted from SQL.`);
      fetchDataForTab('notes');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Handler: Submit Field Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportForm.subject || !reportForm.description) {
      showFeedback("Please provide a Subject and Description.", true);
      return;
    }
    try {
      const payload = {
        ...reportForm,
        user_id: officerUser?.badgeId || '1234'
      };
      const res = await fetch('/api/users/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed");
      showFeedback("Field intelligence report recorded in SQL database.");
      setIsAddReportOpen(false);
      setReportForm({
        subject: '',
        description: '',
        report_type: 'FIELD_INTELLIGENCE',
        reporter_name: officerUser?.name || 'Field Operative',
        location: 'Barrackpore Tactical Corridor',
        evidence_refs: ''
      });
      fetchDataForTab('reports');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Handler: Update Report Status
  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const res = await fetch(`/api/users/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Status update failed");
      showFeedback(`Report #${reportId} updated to ${newStatus}.`);
      fetchDataForTab('reports');
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Handler: Run SQL Query
  const handleExecuteSql = async (customQuery = null) => {
    const queryToRun = customQuery || sqlQuery;
    if (!queryToRun.trim()) return;
    setSqlExecuting(true);
    setSqlResult(null);
    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql_query: queryToRun })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "SQL execution error");
      setSqlResult(data.result);
      // Refresh stats
      const stats = await fetch('/api/database/stats').then(r => r.json());
      setDbStats(stats);
    } catch (err) {
      setSqlResult({ error: err.message });
    } finally {
      setSqlExecuting(false);
    }
  };

  // Handler: Dispatch Test OTP via Simulator
  const handleDispatchTestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!testOtpTarget.trim()) {
      showFeedback("Please enter a target phone number or email.", true);
      return;
    }
    setTestOtpSending(true);
    setTestOtpResult(null);
    setTestVerifyResult(null);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: testOtpTarget.trim(),
          user_id: testOtpUserId.trim() || undefined,
          purpose: testOtpPurpose,
          channel: testOtpChannel
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to dispatch OTP");
      setTestOtpResult(data.dispatch);
      setTestVerifyCode(data.dispatch?.demo_otp_code || '');
      showFeedback(`Test OTP token dispatched for ${data.dispatch.masked_target}`);
      fetchDataForTab('otp');
    } catch (err) {
      showFeedback(err.message, true);
    } finally {
      setTestOtpSending(false);
    }
  };

  // Handler: Verify Test OTP
  const handleVerifyTestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!testVerifyCode.trim()) {
      showFeedback("Please enter the 6-digit OTP code to verify.", true);
      return;
    }
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_target: testOtpTarget.trim(),
          otp_code: testVerifyCode.trim(),
          purpose: testOtpPurpose
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verification failed");
      setTestVerifyResult({ success: true, message: data.message });
      showFeedback("✓ Test OTP code validated successfully against SQL records!");
      fetchDataForTab('otp');
    } catch (err) {
      setTestVerifyResult({ success: false, error: err.message });
      showFeedback(err.message, true);
    }
  };

  // Filtered lists
  const filteredOfficers = officers.filter(off => {
    const matchesSearch = !officerSearch || 
      off.full_name?.toLowerCase().includes(officerSearch.toLowerCase()) ||
      off.user_id?.toLowerCase().includes(officerSearch.toLowerCase()) ||
      off.station?.toLowerCase().includes(officerSearch.toLowerCase());
    const matchesRole = !officerRoleFilter || off.role === officerRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredActivities = activityLogs.filter(act => {
    if (!activityFilter) return true;
    return act.action_type?.toLowerCase().includes(activityFilter.toLowerCase()) ||
           act.officer_name?.toLowerCase().includes(activityFilter.toLowerCase()) ||
           act.user_id?.toLowerCase().includes(activityFilter.toLowerCase());
  });

  const sqlPresets = [
    { label: 'All Registered Officers', query: 'SELECT user_id, full_name, role, station, created_at FROM users;' },
    { label: 'Recent 15 Activity Logs', query: 'SELECT id, user_id, officer_name, action_type, target_resource, timestamp FROM user_activity_logs ORDER BY id DESC LIMIT 15;' },
    { label: 'High Priority Case Notes', query: 'SELECT id, user_id, title, priority, suspect_id, created_at FROM user_case_notes WHERE priority IN ("CRITICAL", "HIGH") ORDER BY id DESC;' },
    { label: 'Active User Sessions', query: 'SELECT session_id, user_id, role, station, login_time, is_active FROM user_sessions ORDER BY login_time DESC LIMIT 10;' },
    { label: 'Field Tip-Off Submissions', query: 'SELECT id, reporter_name, report_type, subject, status, created_at FROM user_field_reports ORDER BY id DESC;' },
    { label: 'Officers Grouped By Role', query: 'SELECT role, COUNT(*) as officer_count FROM users GROUP BY role;' }
  ];

  return (
    <div style={{ padding: '20px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '6px',
            background: '#1e3a8a',
            border: '1px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              RELATIONAL SQL DATA COLLECTION & USER MANAGEMENT ENGINE
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              Officer Directory, Case Annotations & SQL Database Studio
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <HardDrive size={13} />
            <span>SQL WAL CONCURRENCY ACTIVE</span>
          </div>
          <button
            type="button"
            onClick={() => fetchDataForTab(activeSubTab)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
            title="Refresh current tab"
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '4px',
          padding: '10px 14px',
          color: '#166534',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          padding: '10px 14px',
          color: '#991b1b',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Top Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'officers', label: 'Officer Directory & Accounts', icon: Users, count: officers.length },
          { id: 'activity', label: 'User Activity & Audit Stream', icon: Activity, count: activityLogs.length },
          { id: 'notes', label: 'Case Notes & Annotations', icon: FileText, count: caseNotes.length },
          { id: 'reports', label: 'Field Tip-Offs & Reports', icon: Radio, count: fieldReports.length },
          { id: 'otp', label: '2FA & OTP Security Telemetry', icon: KeyRound, count: otpLogs.length, badge: 'NIC 2FA' },
          { id: 'sql', label: 'SQL Console & Schema Inspector', icon: Terminal, badge: 'Direct SQL' }
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                background: isActive ? '#1d4ed8' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                border: isActive ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                borderBottom: isActive ? '3px solid #ff9933' : '1px solid #cbd5e1',
                borderRadius: '4px 4px 0 0',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#334155',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span style={{
                  fontSize: '9px',
                  background: isActive ? '#ff9933' : '#dbeafe',
                  color: isActive ? '#ffffff' : '#1e40af',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 800
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OFFICER DIRECTORY & ACCOUNTS */}
      {/* ========================================================================= */}
      {activeSubTab === 'officers' && (
        <div>
          {/* Controls Bar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
                <input
                  type="text"
                  value={officerSearch}
                  onChange={(e) => setOfficerSearch(e.target.value)}
                  placeholder="Search officers by name, badge ID, station..."
                  style={{
                    width: '100%',
                    padding: '7px 10px 7px 32px',
                    fontSize: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    outline: 'none'
                  }}
                />
              </div>

              <select
                value={officerRoleFilter}
                onChange={(e) => setOfficerRoleFilter(e.target.value)}
                style={{
                  padding: '7px 10px',
                  fontSize: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  outline: 'none',
                  background: '#ffffff'
                }}
              >
                <option value="">All Roles</option>
                <option value="Investigating Officer (IO)">Investigating Officer (IO)</option>
                <option value="Station House Officer (SHO)">Station House Officer (SHO)</option>
                <option value="Superintendent of Police (SP)">Superintendent of Police (SP)</option>
                <option value="Crime Intelligence Analyst">Crime Intelligence Analyst</option>
                <option value="System Administrator (Admin)">System Administrator (Admin)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsAddOfficerOpen(true)}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '7px 14px', fontWeight: 700 }}
            >
              <Plus size={14} />
              <span>+ Register New Officer</span>
            </button>
          </div>

          {/* Officers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '16px'
          }}>
            {filteredOfficers.map((off) => (
              <div
                key={off.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#1e3a8a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px'
                    }}>
                      {off.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'OF'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {off.full_name}
                      </h3>
                      <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>
                        Badge: {off.badge_number || off.user_id}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '10px',
                    background: off.is_admin ? '#fef3c7' : '#e0f2fe',
                    color: off.is_admin ? '#92400e' : '#0369a1',
                    border: `1px solid ${off.is_admin ? '#fde68a' : '#bae6fd'}`,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {off.role}
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '11px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  color: '#475569'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={12} color="#64748b" />
                    <span><strong>Thana:</strong> {off.station || 'General Jurisdiction'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={12} color="#64748b" />
                    <span><strong>Dept:</strong> {off.department || 'Operations'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} color="#64748b" />
                    <span><strong>Last Active:</strong> {off.last_login ? new Date(off.last_login).toLocaleString() : 'Never'}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '11px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                    <span>Actions Logged: <strong style={{ color: '#0f172a' }}>{off.total_actions_logged || 0}</strong></span>
                    <span>Notes: <strong style={{ color: '#0f172a' }}>{off.total_notes_written || 0}</strong></span>
                  </div>
                  <span style={{
                    color: off.is_active ? '#15803d' : '#991b1b',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: off.is_active ? '#22c55e' : '#ef4444' }} />
                    {off.is_active ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal: Register Officer */}
          {isAddOfficerOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '540px',
                background: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#0f2942',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '3px solid #ff9933'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Register New Officer (SQL Database)</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddOfficerOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '18px' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateOfficer} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Officer User ID / Badge ID *</label>
                      <input
                        type="text"
                        value={newOfficerForm.user_id}
                        onChange={(e) => setNewOfficerForm({ ...newOfficerForm, user_id: e.target.value })}
                        placeholder="e.g. IO-9912 or 5678"
                        required
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Full Name *</label>
                      <input
                        type="text"
                        value={newOfficerForm.full_name}
                        onChange={(e) => setNewOfficerForm({ ...newOfficerForm, full_name: e.target.value })}
                        placeholder="e.g. Sub-Inspector S. Sen"
                        required
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Initial Password *</label>
                      <input
                        type="password"
                        value={newOfficerForm.password}
                        onChange={(e) => setNewOfficerForm({ ...newOfficerForm, password: e.target.value })}
                        placeholder="Enter secure password"
                        required
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Official Designation</label>
                      <select
                        value={newOfficerForm.role}
                        onChange={(e) => setNewOfficerForm({ ...newOfficerForm, role: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Police Station Jurisdiction</label>
                    <input
                      type="text"
                      value={newOfficerForm.station}
                      onChange={(e) => setNewOfficerForm({ ...newOfficerForm, station: e.target.value })}
                      placeholder="e.g. Barrackpore Special Thana (North 24 Parganas)"
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddOfficerOpen(false)}
                      className="btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700 }}
                    >
                      Register Officer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER ACTIVITY & AUDIT STREAM */}
      {/* ========================================================================= */}
      {activeSubTab === 'activity' && (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            padding: '12px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Live User Activity & Investigative Telemetry Stream
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                All officer actions, searches, suspect modifications, and GraphRAG inquiries recorded in SQL.
              </p>
            </div>

            <input
              type="text"
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              placeholder="Filter by action or officer..."
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                width: '240px'
              }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ background: '#0f2942', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Log ID</th>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>Officer</th>
                  <th style={{ padding: '10px 14px' }}>Action Type</th>
                  <th style={{ padding: '10px 14px' }}>Target Resource / Query</th>
                  <th style={{ padding: '10px 14px' }}>IP / Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No activity logs match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
                    <tr key={act.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e40af' }}>
                        #{act.id}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(act.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                        {act.officer_name || act.user_id}
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Badge: {act.user_id}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: '10px',
                          background: act.action_type?.includes('LOGIN') ? '#dcfce7' : act.action_type?.includes('SUSPECT') ? '#fee2e2' : '#eff6ff',
                          color: act.action_type?.includes('LOGIN') ? '#166534' : act.action_type?.includes('SUSPECT') ? '#991b1b' : '#1e40af',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontWeight: 700
                        }}>
                          {act.action_type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#334155', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {act.target_resource || '—'}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>
                        {act.ip_address || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CASE NOTES & ANNOTATIONS */}
      {/* ========================================================================= */}
      {activeSubTab === 'notes' && (
        <div>
          {/* Header Controls */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Investigator Case Notes & Lead Hypotheses
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                Create, link, and preserve confidential case notes stored in the SQL database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddNoteOpen(true)}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '7px 14px', fontWeight: 700 }}
            >
              <Plus size={14} />
              <span>+ Add Case Note</span>
            </button>
          </div>

          {/* Notes Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '16px'
          }}>
            {caseNotes.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <FileText size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>No Case Notes Found</div>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Click "+ Add Case Note" to record your first intelligence observation.</p>
              </div>
            ) : (
              caseNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {note.title}
                    </h4>
                    <span style={{
                      fontSize: '10px',
                      background: note.priority === 'CRITICAL' ? '#fee2e2' : note.priority === 'HIGH' ? '#ffedd5' : '#eff6ff',
                      color: note.priority === 'CRITICAL' ? '#991b1b' : note.priority === 'HIGH' ? '#9a3412' : '#1e40af',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 800
                    }}>
                      {note.priority} PRIORITY
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#334155', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {note.note_content}
                  </p>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {note.tags.map((tg, idx) => (
                        <span key={idx} style={{
                          fontSize: '10px',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Tag size={10} />
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: '#64748b'
                  }}>
                    <div>
                      By <strong style={{ color: '#0f172a' }}>{note.officer_name || note.user_id}</strong> • {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px'
                      }}
                      title="Delete Note"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal: Add Case Note */}
          {isAddNoteOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '520px',
                background: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#0f2942',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '3px solid #ff9933'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Record Confidential Case Note (SQL)</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddNoteOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '18px' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNote} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Note Title / Intelligence Lead *</label>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      placeholder="e.g. Surveillance observation at Ichhapur arms cache"
                      required
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Priority Level</label>
                      <select
                        value={noteForm.priority}
                        onChange={(e) => setNoteForm({ ...noteForm, priority: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Linked Suspect ID (Optional)</label>
                      <input
                        type="text"
                        value={noteForm.suspect_id}
                        onChange={(e) => setNoteForm({ ...noteForm, suspect_id: e.target.value })}
                        placeholder="e.g. PERSON_001"
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={noteForm.tags}
                      onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                      placeholder="e.g. Hawala, Border, Firearms"
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Detailed Intelligence Narrative *</label>
                    <textarea
                      rows="4"
                      value={noteForm.note_content}
                      onChange={(e) => setNoteForm({ ...noteForm, note_content: e.target.value })}
                      placeholder="Enter detailed facts, intercepted convoy timings, informant reports, or case strategy..."
                      required
                      style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddNoteOpen(false)}
                      className="btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700 }}
                    >
                      Save Case Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FIELD REPORTS & TIP-OFFS */}
      {/* ========================================================================= */}
      {activeSubTab === 'reports' && (
        <div>
          {/* Header Bar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Field Intelligence Submissions & Citizen Tip-Offs
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                Collect, review, and verify field intelligence streams gathered from ground operatives.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddReportOpen(true)}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '7px 14px', fontWeight: 700 }}
            >
              <Send size={14} />
              <span>+ Ingest Field Tip-Off</span>
            </button>
          </div>

          {/* Reports Table */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#0f2942', color: '#ffffff', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>ID</th>
                    <th style={{ padding: '10px 14px' }}>Subject & Details</th>
                    <th style={{ padding: '10px 14px' }}>Type</th>
                    <th style={{ padding: '10px 14px' }}>Reporter / Locus</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Review Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                        No field reports currently recorded in database.
                      </td>
                    </tr>
                  ) : (
                    fieldReports.map((rep) => (
                      <tr key={rep.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e40af' }}>
                          #{rep.id}
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '380px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '12px' }}>{rep.subject}</div>
                          <div style={{ color: '#475569', marginTop: '3px', lineHeight: '1.4' }}>{rep.description}</div>
                          {rep.evidence_refs && (
                            <div style={{ color: '#1d4ed8', fontSize: '10px', marginTop: '3px' }}>
                              Ref: {rep.evidence_refs}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '10px',
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: 700
                          }}>
                            {rep.report_type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{rep.reporter_name}</div>
                          <div style={{ color: '#64748b', fontSize: '10px' }}>{rep.location}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '10px',
                            background: rep.status === 'VERIFIED' ? '#dcfce7' : rep.status === 'RESOLVED' ? '#e0e7ff' : '#fef3c7',
                            color: rep.status === 'VERIFIED' ? '#166534' : rep.status === 'RESOLVED' ? '#3730a3' : '#92400e',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontWeight: 800
                          }}>
                            {rep.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select
                            value={rep.status}
                            onChange={(e) => handleUpdateReportStatus(rep.id, e.target.value)}
                            style={{
                              fontSize: '11px',
                              padding: '3px 6px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '3px',
                              background: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal: Submit Tip-Off */}
          {isAddReportOpen && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '520px',
                background: '#ffffff',
                borderRadius: '6px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#0f2942',
                  color: '#ffffff',
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '3px solid #ff9933'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Ingest Field Tip-Off (SQL Ledger)</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddReportOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '18px' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitReport} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Subject / Incident Title *</label>
                    <input
                      type="text"
                      value={reportForm.subject}
                      onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
                      placeholder="e.g. Unregistered vehicle loading crates at Barrackpore siding"
                      required
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Report Type</label>
                      <select
                        value={reportForm.report_type}
                        onChange={(e) => setReportForm({ ...reportForm, report_type: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                      >
                        <option value="FIELD_INTELLIGENCE">Field Intelligence</option>
                        <option value="COMMUNITY_TIPOFF">Citizen / Community Tip-Off</option>
                        <option value="SURVEILLANCE_INTERCEPT">Surveillance Intercept</option>
                        <option value="FORENSIC_LEAD">Forensic Lead</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Reporter / Informant Alias</label>
                      <input
                        type="text"
                        value={reportForm.reporter_name}
                        onChange={(e) => setReportForm({ ...reportForm, reporter_name: e.target.value })}
                        placeholder="e.g. Informant Kilo"
                        style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Location / Spot Locus</label>
                    <input
                      type="text"
                      value={reportForm.location}
                      onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                      placeholder="e.g. Ichhapur Ferry Ghat, North 24 Parganas"
                      style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '3px' }}>Description of Tip-Off / Observation *</label>
                    <textarea
                      rows="3"
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Enter details of vehicle, observed persons, timings, seized or suspicious materials..."
                      required
                      style={{ width: '100%', padding: '8px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddReportOpen(false)}
                      className="btn-secondary"
                      style={{ padding: '7px 14px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700 }}
                    >
                      Submit to SQL Ledger
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SQL CONSOLE & SCHEMA INSPECTOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'sql' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Database Health Cards */}
          {dbStats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
              {[
                { label: 'Total Users (SQL)', value: dbStats.metrics?.total_users || 0, icon: Users, color: '#1e40af' },
                { label: 'Active Sessions', value: dbStats.metrics?.total_active_sessions || 0, icon: UserCheck, color: '#047857' },
                { label: 'Activity Logs', value: dbStats.metrics?.total_activity_logs || 0, icon: Activity, color: '#b45309' },
                { label: 'Case Notes', value: dbStats.metrics?.total_case_notes || 0, icon: FileText, color: '#6d28d9' },
                { label: 'Field Reports', value: dbStats.metrics?.total_field_reports || 0, icon: Radio, color: '#be185d' },
                { label: 'Database Size', value: dbStats.file_size_formatted || '0 KB', icon: HardDrive, color: '#0f766e' }
              ].map((m, idx) => {
                const IconComp = m.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: m.color
                    }}>
                      <IconComp size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        {m.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive SQL Query Terminal */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              background: '#0f2942',
              color: '#ffffff',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #ff9933'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="#fbbf24" />
                <span style={{ fontSize: '13px', fontWeight: 800 }}>Administrative SQL Query Console</span>
              </div>
              <span style={{ fontSize: '11px', color: '#93c5fd' }}>Engine: SQLite 3 with WAL Concurrency</span>
            </div>

            {/* Presets Bar */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700 }}>Quick SQL Presets:</span>
              {sqlPresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => {
                    setSqlQuery(preset.query);
                    handleExecuteSql(preset.query);
                  }}
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* SQL Text Area & Run Button */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  rows="3"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="Enter SQL statement (e.g. SELECT * FROM users;)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    background: '#0b1320',
                    color: '#38bdf8',
                    border: '1px solid #1e293b',
                    borderRadius: '4px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Supports all standard SQL syntax: <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>JOIN</code>, <code>GROUP BY</code>.
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteSql()}
                  disabled={sqlExecuting}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 700 }}
                >
                  <Play size={13} />
                  <span>{sqlExecuting ? 'Executing SQL...' : 'Run SQL Query'}</span>
                </button>
              </div>
            </div>

            {/* SQL Results View */}
            {sqlResult && (
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '16px', background: '#f8fafc' }}>
                {sqlResult.error ? (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    <strong>SQL Error:</strong> {sqlResult.error}
                  </div>
                ) : (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                      fontSize: '12px'
                    }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        Result: <span style={{ color: '#166534' }}>{sqlResult.row_count} rows returned</span>
                      </span>
                    </div>

                    {sqlResult.columns && sqlResult.columns.length > 0 ? (
                      <div style={{ overflowX: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace' }}>
                          <thead>
                            <tr style={{ background: '#1e293b', color: '#f8fafc', textAlign: 'left' }}>
                              {sqlResult.columns.map((col, cIdx) => (
                                <th key={cIdx} style={{ padding: '8px 12px', borderRight: '1px solid #334155' }}>
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sqlResult.rows.map((row, rIdx) => (
                              <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0', background: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                {sqlResult.columns.map((col, cIdx) => (
                                  <td key={cIdx} style={{ padding: '8px 12px', borderRight: '1px solid #f1f5f9', color: '#0f172a' }}>
                                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : <em style={{ color: '#94a3b8' }}>NULL</em>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                        {sqlResult.message || 'Command executed successfully.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table Schemas Inspector */}
          {dbStats?.table_schemas && (
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Table size={16} color="#1d4ed8" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Relational SQL Tables Schema Inspector
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {Object.keys(dbStats.table_schemas).map((tbl) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => setSelectedTable(tbl)}
                    style={{
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: selectedTable === tbl ? 700 : 500,
                      background: selectedTable === tbl ? '#1d4ed8' : '#f1f5f9',
                      color: selectedTable === tbl ? '#ffffff' : '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {tbl}
                  </button>
                ))}
              </div>

              {selectedTable && dbStats.table_schemas[selectedTable] && (
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px' }}>CID</th>
                        <th style={{ padding: '8px 12px' }}>Column Name</th>
                        <th style={{ padding: '8px 12px' }}>Data Type</th>
                        <th style={{ padding: '8px 12px' }}>Primary Key</th>
                        <th style={{ padding: '8px 12px' }}>NOT NULL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbStats.table_schemas[selectedTable].map((col) => (
                        <tr key={col.cid} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px', color: '#64748b' }}>{col.cid}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                            {col.name}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#1d4ed8', fontFamily: 'monospace' }}>
                            {col.type}
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            {col.pk ? (
                              <span style={{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '2px', fontWeight: 800 }}>
                                PK
                              </span>
                            ) : '—'}
                          </td>
                          <td style={{ padding: '8px 12px', color: col.notnull ? '#15803d' : '#64748b' }}>
                            {col.notnull ? 'YES' : 'NO'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 6: 2FA & OTP SECURITY TELEMETRY & SIMULATOR */}
      {/* ======================================================== */}
      {activeSubTab === 'otp' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Gateway Security KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total OTPs Dispatched</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                {otpStats?.total_dispatched || otpLogs.length}
              </div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                Via NIC Sandes & Police SMS Grid
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Verification Success Rate</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                {otpStats?.success_rate_pct ?? 100}%
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Zero-knowledge HMAC validation
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Gateway Status</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803d', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span>OPERATIONAL (ALL ENCLAVES)</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Active channels: SMS Sandes, Gov Email, Voice
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px 16px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Statutory Standard</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                BSA 2024 Sec 63 Certified
              </div>
              <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600, marginTop: '4px' }}>
                Tamper-evident audit chain active
              </div>
            </div>
          </div>

          {/* 2. Interactive Police OTP Dispatch Simulator */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1d4ed8'
                }}>
                  <Zap size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Live Police OTP Gateway Simulator & Token Dispatcher
                  </h3>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                    Simulate real-time OTP dispatch to any officer or mobile number and verify cryptographic validity.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDispatchTestOtp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Target Phone / Email / Badge ID *
                </label>
                <input
                  type="text"
                  value={testOtpTarget}
                  onChange={(e) => setTestOtpTarget(e.target.value)}
                  placeholder="+91 98301 23456 or 1234"
                  required
                  style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Officer User ID (Optional)
                </label>
                <input
                  type="text"
                  value={testOtpUserId}
                  onChange={(e) => setTestOtpUserId(e.target.value)}
                  placeholder="e.g. 1234"
                  style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Verification Purpose
                </label>
                <select
                  value={testOtpPurpose}
                  onChange={(e) => setTestOtpPurpose(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                >
                  <option value="LOGIN_2FA">LOGIN_2FA (Two-Factor Login)</option>
                  <option value="MOBILE_LOGIN">MOBILE_LOGIN (Direct Mobile OTP)</option>
                  <option value="REGISTRATION">REGISTRATION (Onboarding)</option>
                  <option value="PASSWORD_RESET">PASSWORD_RESET (Credential Recovery)</option>
                  <option value="STEPUP_AUTH">STEPUP_AUTH (Sensitive Operation)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Dispatch Channel
                </label>
                <select
                  value={testOtpChannel}
                  onChange={(e) => setTestOtpChannel(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff' }}
                >
                  <option value="SMS_SANDES">SMS_SANDES (NIC / State SMS Grid)</option>
                  <option value="POLICE_EMAIL">POLICE_EMAIL (Secure Police Webmail)</option>
                  <option value="VOICE_IVR">VOICE_IVR (Voice Call Backup)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={testOtpSending}
                  className="btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px', justifyContent: 'center' }}
                >
                  {testOtpSending ? <span>Dispatching...</span> : (
                    <>
                      <Send size={14} />
                      <span>Dispatch Test OTP</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Test OTP Result Box & Inline Verifier */}
            {testOtpResult && (
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                    📨 Dispatched SMS / Sandes Payload:
                  </div>
                  <div style={{ fontSize: '12px', color: '#1e293b', marginTop: '4px', fontStyle: 'italic', background: '#ffffff', padding: '8px 10px', borderRadius: '4px', border: '1px solid #dbeafe' }}>
                    "{testOtpResult.dispatch_message}"
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', display: 'flex', gap: '12px' }}>
                    <span>Token: <strong>{testOtpResult.token_id}</strong></span>
                    <span>TTL: <strong>{testOtpResult.ttl_seconds}s</strong></span>
                    <span>Code: <strong style={{ color: '#1d4ed8', fontFamily: 'monospace', fontSize: '13px' }}>{testOtpResult.demo_otp_code}</strong></span>
                  </div>
                </div>

                {/* Inline Validator Box */}
                <form onSubmit={handleVerifyTestOtp} style={{ background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Validate Code Against Database:
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={testVerifyCode}
                      onChange={(e) => setTestVerifyCode(e.target.value)}
                      placeholder="6-digit code"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '14px', fontWeight: 800, textAlign: 'center', letterSpacing: '2px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                    >
                      Verify Token
                    </button>
                  </div>
                  {testVerifyResult && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: testVerifyResult.success ? '#15803d' : '#b91c1c'
                    }}>
                      {testVerifyResult.success ? '✓ ' + testVerifyResult.message : '✗ ' + testVerifyResult.error}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* 3. Live OTP Telemetry Table */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={16} color="#1d4ed8" />
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Recent OTP Verification Audit Trail (SQL `otp_verifications`)
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Total Records: <strong>{otpLogs.length}</strong>
              </span>
            </div>

            {otpLogs.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                No OTP verifications recorded yet. Dispatch a test OTP using the simulator above or sign in using 2FA.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px 10px' }}>Token ID</th>
                      <th style={{ padding: '8px 10px' }}>Officer / Target</th>
                      <th style={{ padding: '8px 10px' }}>Purpose</th>
                      <th style={{ padding: '8px 10px' }}>Channel</th>
                      <th style={{ padding: '8px 10px' }}>Attempts</th>
                      <th style={{ padding: '8px 10px' }}>Status</th>
                      <th style={{ padding: '8px 10px' }}>Expires At</th>
                      <th style={{ padding: '8px 10px' }}>Dispatched At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otpLogs.map((log) => {
                      const isExpired = new Date().toISOString() > log.expires_at;
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}>
                            {log.otp_token_id}
                          </td>
                          <td style={{ padding: '8px 10px', color: '#0f172a' }}>
                            <div style={{ fontWeight: 600 }}>{log.user_id || 'ANONYMOUS'}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{log.contact_target}</div>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 700,
                              background: log.purpose === 'LOGIN_2FA' ? '#eff6ff' : log.purpose === 'STEPUP_AUTH' ? '#fef3c7' : '#f1f5f9',
                              color: log.purpose === 'LOGIN_2FA' ? '#1d4ed8' : log.purpose === 'STEPUP_AUTH' ? '#92400e' : '#475569'
                            }}>
                              {log.purpose}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#475569' }}>
                            {log.channel}
                          </td>
                          <td style={{ padding: '8px 10px', color: log.attempts > 0 ? '#b91c1c' : '#64748b' }}>
                            {log.attempts} / {log.max_attempts || 5}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            {log.is_verified ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                                VERIFIED
                              </span>
                            ) : isExpired ? (
                              <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                                EXPIRED
                              </span>
                            ) : (
                              <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
                                PENDING
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', color: '#64748b', fontSize: '10px' }}>
                            {log.expires_at ? new Date(log.expires_at).toLocaleTimeString() : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', color: '#64748b', fontSize: '10px' }}>
                            {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
