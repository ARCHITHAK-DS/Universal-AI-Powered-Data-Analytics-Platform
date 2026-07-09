import React, { useState } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  BellRing, 
  Lock, 
  Save, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck 
} from 'lucide-react';

interface SystemSettingsProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  language: 'en' | 'es' | 'fr' | 'de';
  setLanguage: (l: 'en' | 'es' | 'fr' | 'de') => void;
  notifyDataset: boolean;
  setNotifyDataset: (v: boolean) => void;
  notifyReport: boolean;
  setNotifyReport: (v: boolean) => void;
  notifyCollab: boolean;
  setNotifyCollab: (v: boolean) => void;
  privacyPrivate: boolean;
  setPrivacyPrivate: (v: boolean) => void;
}

export default function SystemSettings({
  theme,
  setTheme,
  language,
  setLanguage,
  notifyDataset,
  setNotifyDataset,
  notifyReport,
  setNotifyReport,
  notifyCollab,
  setNotifyCollab,
  privacyPrivate,
  setPrivacyPrivate
}: SystemSettingsProps) {
  const [successMsg, setSuccessMsg] = useState('');

  const translations = {
    en: {
      title: 'Global Settings Terminal',
      description: 'Manage browser presentation layers, local language, and secure communication channels.',
      theme: 'Workspace Theme Mode',
      lang: 'Platform Language Ingress',
      notify: 'Notification Dispatcher Presets',
      privacy: 'Platform Cryptographic Controls',
      notifyD: 'Alert me on Dataset Ingestion uploads',
      notifyR: 'Alert me on Compliance PDF Briefing outputs',
      notifyC: 'Alert me on Workspace snapshots modification',
      privacyK: 'Run automated relational validations',
      save: 'Sync System Profile',
      success: 'All local preferences have been updated and synchronized in the session memory loop.'
    },
    es: {
      title: 'Terminal de Configuración Global',
      description: 'Gestione las capas de presentación del navegador, el idioma local y los canales seguros.',
      theme: 'Modo de Tema del Espacio',
      lang: 'Idioma Ingress de Plataforma',
      notify: 'Ajustes del Despachador de Alertas',
      privacy: 'Controles Criptográficos de Plataforma',
      notifyD: 'Alertarme sobre cargas de datasets',
      notifyR: 'Alertarme sobre informes PDF de cumplimiento',
      notifyC: 'Alertarme sobre cambios en colaboradores',
      privacyK: 'Ejecutar validaciones relacionales automáticas',
      save: 'Sincronizar Panel',
      success: 'Todas las preferencias locales se han actualizado y sincronizado en la memoria.'
    },
    fr: {
      title: 'Terminal de Paramètres Globaux',
      description: 'Gérez la présentation du navigateur, la langue locale et les canaux de communication sécurisés.',
      theme: 'Mode Thème du Workspace',
      lang: 'Langue de la Plateforme',
      notify: 'Canaux de Transmission des Notifications',
      privacy: 'Contrôles Cryptographiques de Sécurité',
      notifyD: 'M\'alerter lors des téléchargements de fichiers',
      notifyR: 'M\'alerter lors des analyses de conformité PDF',
      notifyC: 'M\'alerter lors des invitations de collaborateurs',
      privacyK: 'Activer la validation relationnelle automatique',
      save: 'Sincroniser Profil',
      success: 'Toutes les préférences ont été mises à jour avec succès dans la session.'
    },
    de: {
      title: 'Globale Einstellungen-Konsole',
      description: 'Verwalten Sie Browser-Präsentationslayer, lokale Sprache und sichere Kommunikationskanäle.',
      theme: 'Arbeitsbereich Design-Modus',
      lang: 'System-Sprache Ingress',
      notify: 'Benachrichtigungs-Verteiler Kanäle',
      privacy: 'Plattform Sicherheitskontrollen',
      notifyD: 'Benachrichtigen Sie mich über Datei-Uploads',
      notifyR: 'Benachrichtigen Sie mich über PDF-Sicherheitsberichte',
      notifyC: 'Benachrichtigen Sie mich über Mitarbeiter-Änderungen',
      privacyK: 'Automatisierte relationale Validierung aktivieren',
      save: 'System synchronisieren',
      success: 'Globale Präferenzdaten wurden erfolgreich im Sitzungsspeicher abgelegt.'
    }
  };

  const t = translations[language] || translations.en;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(t.success);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div id="settings-page" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 text-left max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
        <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
          <Settings className="h-5.5 w-5.5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-850 flex items-center gap-1.5 leading-none">
            {t.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">{t.description}</p>
        </div>
      </div>

      {successMsg && (
        <div className="mt-4 bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-bounce shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 mt-6">
        {/* Theme Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-amber-500" />
              {t.theme}
            </h4>
            <p className="text-[11px] text-slate-400">Choose the global skin layout that fits your screen brightness comfort profile.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                document.documentElement.classList.remove('dark');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sun className="h-4 w-4" />
              Bright Light Mode
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                document.documentElement.classList.add('dark');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-indigo-500 text-slate-100 shadow-inner'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              Dark Minimal Mode
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-indigo-500" />
              {t.lang}
            </h4>
            <p className="text-[11px] text-slate-400">Configure global layout titles and briefing document localization metrics.</p>
          </div>
          <div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold rounded-xl focus:outline-hidden focus:border-indigo-550 cursor-pointer"
            >
              <option value="en">English (US Standard)</option>
              <option value="es">Español (Castellano)</option>
              <option value="fr">Français (France)</option>
              <option value="de">Deutsch (Deutschland)</option>
            </select>
          </div>
        </div>

        {/* Notifications Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <BellRing className="h-4 w-4 text-emerald-500" />
              {t.notify}
            </h4>
            <p className="text-[11px] text-slate-400">Toggle active communications channels writing event alerts to the database.</p>
          </div>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyDataset}
                onChange={(e) => setNotifyDataset(e.target.checked)}
                className="mt-0.5 rounded text-indigo-650 h-3.5 w-3.5"
              />
              <span className="text-xs font-semibold text-slate-700">{t.notifyD}</span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyReport}
                onChange={(e) => setNotifyReport(e.target.checked)}
                className="mt-0.5 rounded text-indigo-650 h-3.5 w-3.5"
              />
              <span className="text-xs font-semibold text-slate-700">{t.notifyR}</span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyCollab}
                onChange={(e) => setNotifyCollab(e.target.checked)}
                className="mt-0.5 rounded text-indigo-650 h-3.5 w-3.5"
              />
              <span className="text-xs font-semibold text-slate-700">{t.notifyC}</span>
            </label>
          </div>
        </div>

        {/* Privacy & Cryptography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-500" />
              {t.privacy}
            </h4>
            <p className="text-[11px] text-slate-400">Enforce enterprise hashing parameters, emulating isolated local environments.</p>
          </div>
          <div>
            <label className="flex items-start gap-3 p-3.5 bg-indigo-50/40 border border-indigo-100/70 rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyPrivate}
                onChange={(e) => setPrivacyPrivate(e.target.checked)}
                className="mt-0.5 rounded text-indigo-650 h-3.5 w-3.5"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-855 text-indigo-900 block">{t.privacyK}</span>
                <span className="text-[10px] text-slate-400 block font-medium">Verify login history matching useragent keys dynamically.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-3 text-right">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-all shadow-sm tracking-wider uppercase cursor-pointer"
          >
            <Save className="h-4 w-4 animate-pulse" />
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}
