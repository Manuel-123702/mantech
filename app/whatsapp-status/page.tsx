'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

// ─── Type ─────────────────────────────────────────────────────────────────────
interface StatusResult {
  candidateName: string;
  opportunityTitle: string;
  companyName: string;
  status: string;
  updatedAt: string;
  applicationId: string;
  hasInterview: boolean;
  interviewDate?: string | null;
  interviewLink?: string | null;
}

const STATUS_META: Record<string, { color: string; icon: string; label: string }> = {
  SUBMITTED:        { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',    icon: '📤', label: 'Submitted' },
  UNDER_REVIEW:     { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: '🔍', label: 'Under Review' },
  SHORTLISTED:      { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '🌟', label: 'Shortlisted' },
  INTERVIEW:        { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: '📅', label: 'Interview' },
  SELECTED:         { color: 'bg-green-500/20 text-green-300 border-green-500/30',  icon: '🎉', label: 'Selected' },
  PLACEMENT_PENDING:{ color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: '⏳', label: 'Placement Pending' },
  PLACED:           { color: 'bg-green-600/20 text-green-200 border-green-600/30',  icon: '✅', label: 'Placed' },
  INTERNSHIP_ACTIVE:{ color: 'bg-teal-500/20 text-teal-300 border-teal-500/30',    icon: '🚀', label: 'Internship Active' },
  COMPLETED:        { color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: '🏆', label: 'Completed' },
  REJECTED:         { color: 'bg-red-500/20 text-red-300 border-red-500/30',       icon: '❌', label: 'Rejected' },
  WITHDRAWN:        { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',    icon: '↩️', label: 'Withdrawn' },
};

export default function WhatsAppStatusPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams();
      const isPhone = /^\+?\d[\d\s]{7,}$/.test(query.trim());
      if (isPhone) {
        params.set('phone', query.trim());
      } else {
        params.set('ref', query.trim().toUpperCase());
      }

      const res = await fetch(`/api/whatsapp/status-check?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Application not found. Check your reference ID or phone number.');
        return;
      }
      setResult(data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusMeta = result ? (STATUS_META[result.status] ?? {
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    icon: '🔔',
    label: result.status.replace(/_/g, ' '),
  }) : null;

  const waShareLink = result
    ? `https://wa.me/?text=${encodeURIComponent(
        `🎓 MANTECH Nexus — My Application Status\n\n` +
        `📌 Position: ${result.opportunityTitle}\n` +
        `🏢 Company: ${result.companyName}\n` +
        `📊 Status: ${result.status.replace(/_/g, ' ')}\n` +
        `🆔 Ref: ${result.applicationId.slice(0, 8).toUpperCase()}\n\n` +
        `🔗 Check yours: ${APP_CONFIG.url}/whatsapp-status`,
      )}`
    : '#';

  return (
    <main className="wa-status-page">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="wa-bg" aria-hidden="true">
        <div className="wa-orb wa-orb-1" />
        <div className="wa-orb wa-orb-2" />
        <div className="wa-grid" />
      </div>

      <div className="wa-container">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="wa-header">
          <Link href="/" className="wa-logo">
            <span className="wa-logo-icon">🎓</span>
            <span>MANTECH Nexus</span>
          </Link>

          <div className="wa-badge">
            <span className="wa-badge-dot" />
            WhatsApp Status Tracker
          </div>

          <h1 className="wa-title">
            Check Your <span className="wa-title-accent">Application Status</span>
          </h1>
          <p className="wa-subtitle">
            Enter your Application Reference ID or WhatsApp phone number<br />
            to get an instant update on your internship application.
          </p>
        </header>

        {/* ── Search Card ──────────────────────────────────────────────────── */}
        <section className="wa-card" aria-label="Status lookup">
          <form onSubmit={handleCheck} className="wa-form">
            <label htmlFor="wa-query" className="wa-label">
              Reference ID <span className="wa-label-or">or</span> WhatsApp Number
            </label>

            <div className="wa-input-row">
              <input
                id="wa-query"
                type="text"
                className="wa-input"
                placeholder="e.g. AB12CD34 or +237 650 921 917"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="wa-btn"
                disabled={loading || !query.trim()}
                aria-label="Check status"
              >
                {loading ? (
                  <span className="wa-spinner" role="status" aria-label="Loading" />
                ) : (
                  '🔍 Check'
                )}
              </button>
            </div>

            {error && (
              <div className="wa-error" role="alert">
                ⚠️ {error}
              </div>
            )}
          </form>

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="wa-divider">
            <span>OR</span>
          </div>

          {/* ── WhatsApp Concierge ───────────────────────────────────────── */}
          <div className="wa-concierge">
            <p className="wa-concierge-title">📱 Prefer WhatsApp?</p>
            <p className="wa-concierge-text">
              Send your Reference ID directly to our WhatsApp Concierge and get an
              instant real-time reply — no data costs!
            </p>
            <a
              href={`${APP_CONFIG.contacts.whatsappLink}?text=${encodeURIComponent('STATUS')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-concierge-link"
              aria-label="Open WhatsApp concierge"
            >
              <span className="wa-whatsapp-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </span>
              Message Our Concierge on WhatsApp
            </a>
          </div>
        </section>

        {/* ── Result Card ──────────────────────────────────────────────────── */}
        {result && statusMeta && (
          <section className="wa-result" aria-live="polite" aria-label="Application status result">
            <div className="wa-result-header">
              <span className="wa-result-icon" aria-hidden="true">{statusMeta.icon}</span>
              <div>
                <p className="wa-result-label">Status</p>
                <span className={`wa-status-badge ${statusMeta.color}`}>
                  {statusMeta.label}
                </span>
              </div>
            </div>

            <dl className="wa-result-grid">
              <div className="wa-result-item">
                <dt>👤 Candidate</dt>
                <dd>{result.candidateName}</dd>
              </div>
              <div className="wa-result-item">
                <dt>📌 Position</dt>
                <dd>{result.opportunityTitle}</dd>
              </div>
              <div className="wa-result-item">
                <dt>🏢 Company</dt>
                <dd>{result.companyName}</dd>
              </div>
              <div className="wa-result-item">
                <dt>🆔 Reference</dt>
                <dd className="wa-mono">{result.applicationId.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div className="wa-result-item">
                <dt>📅 Last Updated</dt>
                <dd>{new Date(result.updatedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}</dd>
              </div>
            </dl>

            {result.hasInterview && result.interviewDate && (
              <div className="wa-interview-alert">
                <span className="wa-interview-icon">📅</span>
                <div>
                  <p className="wa-interview-title">Interview Scheduled</p>
                  <p className="wa-interview-date">
                    {new Date(result.interviewDate).toLocaleString('en-GB', {
                      weekday: 'short', day: 'numeric', month: 'short',
                      year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })} (WAT)
                  </p>
                  {result.interviewLink && (
                    <a
                      href={result.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wa-interview-link"
                    >
                      🔗 Join Meeting
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="wa-result-actions">
              <a
                href={waShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-share-btn"
                aria-label="Share status on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Share on WhatsApp
              </a>
              <Link href="/dashboard/intern" className="wa-portal-btn">
                Open Dashboard →
              </Link>
            </div>
          </section>
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="wa-footer">
          <p>
            <Link href="/">← Back to {APP_CONFIG.name}</Link>
            {' · '}
            <a href={APP_CONFIG.contacts.whatsappLink} target="_blank" rel="noopener noreferrer">
              Need help? Contact us on WhatsApp
            </a>
          </p>
          <p className="wa-footer-note">
            Your data is private. Only you can view your application details.
          </p>
        </footer>
      </div>

      {/* ── Styles ──────────────────────────────────────────────────────────── */}
      <style jsx>{`
        .wa-status-page {
          min-height: 100vh;
          background: #0a0e1a;
          color: #e2e8f0;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .wa-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
        }
        .wa-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.35;
          animation: orbFloat 8s ease-in-out infinite alternate;
        }
        .wa-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #25d366 0%, transparent 70%);
          top: -200px; left: -150px;
        }
        .wa-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #128c7e 0%, transparent 70%);
          bottom: -200px; right: -100px;
          animation-delay: -4s;
        }
        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.06); }
        }
        .wa-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(37,211,102,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,211,102,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .wa-container {
          position: relative; z-index: 1;
          max-width: 640px; margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
          display: flex; flex-direction: column; gap: 1.75rem;
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wa-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .wa-logo {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-weight: 700; font-size: 0.95rem; color: #25d366; text-decoration: none;
          transition: opacity 0.2s;
        }
        .wa-logo:hover { opacity: 0.8; }
        .wa-logo-icon { font-size: 1.4rem; }
        .wa-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.9rem; border-radius: 99px;
          background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.3);
          font-size: 0.78rem; font-weight: 600; color: #25d366; letter-spacing: 0.03em;
        }
        .wa-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #25d366;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        .wa-title {
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          font-weight: 800; line-height: 1.15; margin: 0; color: #f1f5f9;
        }
        .wa-title-accent {
          background: linear-gradient(135deg, #25d366, #128c7e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .wa-subtitle { margin: 0; font-size: 0.95rem; color: #94a3b8; line-height: 1.6; }
        .wa-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px; padding: 2rem;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }
        .wa-form { display: flex; flex-direction: column; gap: 0.75rem; }
        .wa-label {
          font-size: 0.85rem; font-weight: 600; color: #94a3b8;
          display: flex; gap: 0.35rem; align-items: center;
        }
        .wa-label-or { color: #64748b; font-weight: 400; }
        .wa-input-row { display: flex; gap: 0.6rem; }
        .wa-input {
          flex: 1; padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; color: #f1f5f9; font-size: 0.95rem; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .wa-input::placeholder { color: #475569; }
        .wa-input:focus {
          border-color: rgba(37,211,102,0.5);
          box-shadow: 0 0 0 3px rgba(37,211,102,0.12);
        }
        .wa-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .wa-btn {
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #25d366, #128c7e);
          border: none; border-radius: 12px;
          color: #fff; font-size: 0.9rem; font-weight: 700;
          cursor: pointer; white-space: nowrap;
          transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .wa-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .wa-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .wa-spinner {
          display: inline-block; width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .wa-error {
          padding: 0.65rem 1rem;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px; font-size: 0.85rem; color: #fca5a5;
        }
        .wa-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin: 1.5rem 0;
          color: #475569; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em;
        }
        .wa-divider::before, .wa-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
        }
        .wa-concierge { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
        .wa-concierge-title { margin: 0; font-weight: 700; font-size: 0.95rem; color: #e2e8f0; }
        .wa-concierge-text { margin: 0; font-size: 0.85rem; color: #64748b; max-width: 400px; line-height: 1.5; }
        .wa-concierge-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.4rem;
          background: rgba(37,211,102,0.12); border: 1px solid rgba(37,211,102,0.3);
          border-radius: 12px; color: #25d366; font-weight: 600; font-size: 0.9rem;
          text-decoration: none; transition: background 0.2s, transform 0.15s;
        }
        .wa-concierge-link:hover { background: rgba(37,211,102,0.2); transform: translateY(-1px); }
        .wa-whatsapp-icon { display: flex; align-items: center; }
        .wa-result {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(37,211,102,0.2);
          border-radius: 20px; padding: 1.75rem;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 40px rgba(37,211,102,0.06);
          animation: resultReveal 0.45s ease both;
        }
        @keyframes resultReveal {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .wa-result-header {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1.25rem; padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .wa-result-icon { font-size: 2.5rem; line-height: 1; }
        .wa-result-label { margin: 0 0 0.3rem; font-size: 0.78rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .wa-status-badge {
          display: inline-block; padding: 0.3rem 0.85rem; border-radius: 99px; border: 1px solid;
          font-size: 0.88rem; font-weight: 700;
        }
        .wa-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin: 0 0 1.25rem; }
        .wa-result-item dt { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
        .wa-result-item dd { margin: 0; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
        .wa-mono { font-family: 'Courier New', monospace; letter-spacing: 0.1em; }
        .wa-interview-alert {
          display: flex; gap: 0.85rem; align-items: flex-start;
          padding: 1rem 1.2rem;
          background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.25);
          border-radius: 12px; margin-bottom: 1.25rem;
        }
        .wa-interview-icon { font-size: 1.5rem; line-height: 1; flex-shrink: 0; }
        .wa-interview-title { margin: 0 0 0.25rem; font-weight: 700; font-size: 0.9rem; color: #d8b4fe; }
        .wa-interview-date { margin: 0 0 0.4rem; font-size: 0.85rem; color: #94a3b8; }
        .wa-interview-link { display: inline-block; font-size: 0.85rem; font-weight: 600; color: #a78bfa; text-decoration: none; }
        .wa-interview-link:hover { text-decoration: underline; }
        .wa-result-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .wa-share-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.2rem;
          background: linear-gradient(135deg, #25d366, #128c7e);
          border-radius: 10px; color: #fff; font-weight: 600; font-size: 0.88rem;
          text-decoration: none; transition: opacity 0.2s, transform 0.15s;
        }
        .wa-share-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .wa-portal-btn {
          display: inline-flex; align-items: center; padding: 0.65rem 1.2rem;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: #e2e8f0; font-weight: 600; font-size: 0.88rem;
          text-decoration: none; transition: background 0.2s;
        }
        .wa-portal-btn:hover { background: rgba(255,255,255,0.12); }
        .wa-footer { text-align: center; font-size: 0.8rem; color: #475569; display: flex; flex-direction: column; gap: 0.35rem; }
        .wa-footer a { color: #25d366; text-decoration: none; }
        .wa-footer a:hover { text-decoration: underline; }
        .wa-footer-note { color: #334155; }
        @media (max-width: 500px) {
          .wa-input-row { flex-direction: column; }
          .wa-result-grid { grid-template-columns: 1fr; }
          .wa-result-actions { flex-direction: column; }
          .wa-card, .wa-result { padding: 1.25rem; }
        }
      `}</style>
    </main>
  );
}
