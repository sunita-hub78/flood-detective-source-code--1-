import React, { useState } from 'react';
import { X, Pin, FileText, Send } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: { text: string; tag: 'EVIDENCE' | 'HYPOTHESIS' | 'ALERT' | 'FIELD' }) => void;
  leadInvestigator: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  leadInvestigator,
}) => {
  const [noteText, setNoteText] = useState('');
  const [selectedTag, setSelectedTag] = useState<'EVIDENCE' | 'HYPOTHESIS' | 'ALERT' | 'FIELD'>('ALERT');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    soundEffects.playPinSound();
    onAddNote({
      text: noteText.trim(),
      tag: selectedTag,
    });
    setNoteText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#121722] border border-amber-500/50 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-amber-950/60 to-[#121722] px-6 py-3.5 border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Pin className="w-4 h-4 fill-amber-400" />
            <span className="font-mono-hud text-xs font-bold uppercase tracking-wider">
              PIN NEW INVESTIGATOR EXHIBIT / NOTE
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono-hud text-slate-300 mb-1.5">
              CLASSIFICATION TAG:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['ALERT', 'EVIDENCE', 'HYPOTHESIS', 'FIELD'] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`py-2 px-2 text-center rounded-lg text-xs font-mono-hud font-bold border transition-all ${
                    selectedTag === tag
                      ? tag === 'ALERT'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                        : tag === 'EVIDENCE'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : tag === 'HYPOTHESIS'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#18202e] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-hud text-slate-300 mb-1.5">
              FORENSIC OBSERVATION / FIELD REPORT:
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record observation regarding water depth, clogged storm grates, rainfall rate spike, or structural bridge concerns..."
              rows={4}
              required
              className="w-full p-3 rounded-xl bg-[#0d111a] border border-slate-700 text-slate-100 text-sm font-mono-hud placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
            />
          </div>

          <div className="text-[11px] font-mono-hud text-slate-500 flex items-center justify-between">
            <span>SIGNATURE: {leadInvestigator}</span>
            <span>TIME STAMP: AUTO-RECORDED</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono-hud text-slate-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 text-black font-bold font-mono-hud text-xs hover:bg-amber-400 flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <Pin className="w-3.5 h-3.5 fill-black" />
              PIN TO BOARD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
