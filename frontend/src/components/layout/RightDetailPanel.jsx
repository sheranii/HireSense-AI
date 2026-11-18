import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ChevronRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const RightDetailPanel = ({
  candidate,
  onClose,
  onUpdateStage,
  onScheduleInterview,
  onSendAssessment,
}) => {
  const [activeTab, setActiveTab] = useState('evaluation'); // 'evaluation' | 'details' | 'timeline' | 'notes'
  const [noteText, setNoteText] = useState('');
  const [notesList, setNotesList] = useState([
    { id: 1, author: 'Sarah Chen', time: 'Yesterday at 4:15 PM', text: 'Strong architectural answers during screen. Recommend advancing to technical round.' },
    { id: 2, author: 'HireSense AI', time: '2 days ago', text: 'Screened resume with 94% profile match. High alignment with React and Spring Boot.' },
  ]);

  if (!candidate) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNotesList([
      { id: Date.now(), author: 'You', time: 'Just now', text: noteText.trim() },
      ...notesList,
    ]);
    setNoteText('');
  };

  const stages = ['APPLIED', 'SCREENING', 'TECHNICAL', 'INTERVIEW', 'OFFER', 'REJECTED'];

  const getScoreVariant = (score) => {
    if (score >= 90) return 'emerald';
    if (score >= 75) return 'blue';
    if (score >= 60) return 'amber';
    return 'rose';
  };

  return (
    <aside className="w-96 border-l border-[#eaecf0] bg-white flex flex-col h-full flex-shrink-0 shadow-panel z-10">
      {/* Header */}
      <div className="h-12 px-4 border-b border-[#eaecf0] flex items-center justify-between bg-surface-50">
        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono uppercase tracking-wider text-charcoal-400 font-semibold">
            Candidate Inspector
          </span>
          <Badge size="xs" variant={candidate.currentStage === 'OFFER' ? 'emerald' : 'blue'}>
            {candidate.currentStage || 'APPLIED'}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded hover:bg-surface-200 transition-colors"
          title="Close inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Candidate Profile Summary */}
      <div className="p-4 border-b border-[#eaecf0]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-charcoal-900 tracking-tight">
              {candidate.fullName}
            </h2>
            <p className="text-xs text-charcoal-600 mt-0.5 flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3 h-3 text-charcoal-400" />
              {candidate.currentTitle || 'Applicant'}
            </p>
          </div>
          <div className="text-right">
            <Badge size="sm" variant={getScoreVariant(candidate.aiMatchScore || 85)} dot>
              {candidate.aiMatchScore || 85}% Match
            </Badge>
          </div>
        </div>

        {/* Contact info list */}
        <div className="mt-3 space-y-1.5 text-xs text-charcoal-600">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-charcoal-400" />
            <span className="font-mono text-2xs truncate">{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-charcoal-400" />
              <span className="font-mono text-2xs">{candidate.phone}</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
              <span className="text-2xs">{candidate.location}</span>
            </div>
          )}
        </div>

        {/* Stage quick change dropdown */}
        <div className="mt-3.5 pt-3 border-t border-[#f0f2f5] flex items-center justify-between">
          <span className="text-2xs text-charcoal-500 font-mono">Pipeline Stage</span>
          <select
            value={candidate.currentStage || 'APPLIED'}
            onChange={(e) => onUpdateStage && onUpdateStage(candidate.id, e.target.value)}
            className="text-xs font-mono font-medium border border-[#d1d5db] rounded px-2 py-1 bg-white hover:border-charcoal-400 transition-colors"
          >
            {stages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eaecf0] bg-surface-50 px-3 text-xs font-medium text-charcoal-500">
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`py-2 px-2.5 border-b-2 font-mono text-2xs transition-colors flex items-center gap-1.5 ${
            activeTab === 'evaluation'
              ? 'border-brand-500 text-charcoal-900 font-semibold'
              : 'border-transparent hover:text-charcoal-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-brand-500" />
          AI Evaluation
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2 px-2.5 border-b-2 font-mono text-2xs transition-colors ${
            activeTab === 'details'
              ? 'border-brand-500 text-charcoal-900 font-semibold'
              : 'border-transparent hover:text-charcoal-800'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2 px-2.5 border-b-2 font-mono text-2xs transition-colors ${
            activeTab === 'notes'
              ? 'border-brand-500 text-charcoal-900 font-semibold'
              : 'border-transparent hover:text-charcoal-800'
          }`}
        >
          Notes ({notesList.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeTab === 'evaluation' && (
          <div className="space-y-4">
            {/* AI Summary Card */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded p-3">
              <div className="flex items-center gap-1.5 text-charcoal-900 font-semibold font-mono text-2xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                SCREENING SUMMARY
              </div>
              <p className="text-charcoal-700 leading-relaxed text-xs">
                {candidate.summary || 'Strong candidate showing deep technical competencies across required modern web and backend stack.'}
              </p>
            </div>

            {/* Strengths */}
            <div>
              <div className="text-2xs font-mono uppercase text-emerald-700 font-semibold tracking-wider flex items-center gap-1 mb-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Key Strengths
              </div>
              <p className="text-charcoal-700 bg-emerald-50/50 border border-emerald-100 rounded p-2.5 leading-relaxed">
                {candidate.matchStrengths || 'Demonstrated architecture leadership; high code test coverage in previous repositories; clear technical communication.'}
              </p>
            </div>

            {/* Areas for probing */}
            <div>
              <div className="text-2xs font-mono uppercase text-amber-700 font-semibold tracking-wider flex items-center gap-1 mb-1.5">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Suggested Interview Topics
              </div>
              <p className="text-charcoal-700 bg-amber-50/50 border border-amber-100 rounded p-2.5 leading-relaxed">
                {candidate.matchConcerns || 'Probe distributed queue failover experience and concurrency locking models in PostgreSQL.'}
              </p>
            </div>

            {/* Skills chips */}
            <div>
              <div className="text-2xs font-mono uppercase text-charcoal-400 font-semibold tracking-wider mb-2">
                Identified Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(candidate.skills || 'React, TypeScript, Java 21, Spring Boot, PostgreSQL, Docker')
                  .split(',')
                  .map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 text-2xs font-mono bg-surface-100 border border-[#e5e7eb] rounded text-charcoal-700"
                    >
                      {sk.trim()}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-3">
            <div>
              <span className="text-2xs font-mono text-charcoal-400 block mb-0.5">Experience</span>
              <p className="font-semibold text-charcoal-900">{candidate.experienceYears || 5} Years Industry Experience</p>
            </div>
            <div>
              <span className="text-2xs font-mono text-charcoal-400 block mb-0.5">Applied Role</span>
              <p className="font-semibold text-charcoal-900">Senior Full-Stack Product Engineer</p>
            </div>
            <div>
              <span className="text-2xs font-mono text-charcoal-400 block mb-0.5">Application Date</span>
              <p className="font-mono text-charcoal-800">November 5, 2026</p>
            </div>
            <div>
              <span className="text-2xs font-mono text-charcoal-400 block mb-0.5">Resume</span>
              <a
                href="#resume"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium font-mono text-2xs underline"
              >
                <FileText className="w-3.5 h-3.5" />
                resume_alex_rivera_2026.pdf
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add private evaluation notes..."
                rows={2}
                className="w-full border border-[#d1d5db] rounded p-2 text-xs text-charcoal-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
              />
              <div className="flex justify-end">
                <Button size="xs" variant="primary" icon={Send} type="submit">
                  Save Note
                </Button>
              </div>
            </form>

            <div className="space-y-2 pt-2 border-t border-[#f0f2f5]">
              {notesList.map((n) => (
                <div key={n.id} className="bg-surface-50 border border-[#eaecf0] rounded p-2.5">
                  <div className="flex items-center justify-between text-2xs mb-1">
                    <span className="font-semibold text-charcoal-800">{n.author}</span>
                    <span className="text-charcoal-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-charcoal-700 text-xs">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#eaecf0] bg-surface-50 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onSendAssessment && onSendAssessment(candidate)}
        >
          Send Assessment
        </Button>
        <Button
          variant="brand"
          size="sm"
          className="flex-1"
          onClick={() => onScheduleInterview && onScheduleInterview(candidate)}
        >
          Schedule Interview
        </Button>
      </div>
    </aside>
  );
};

