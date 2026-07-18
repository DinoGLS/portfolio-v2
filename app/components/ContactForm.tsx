"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/providers/LanguageProvider";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "success" | "error";

const EMPTY: Fields = { firstName: "", lastName: "", email: "", phone: "", message: "" };

// Validations volontairement simples et tolérantes (UX > rigidité).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9 ().-]{6,20}$/;

export default function ContactForm() {
  const { t } = useLanguage();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  // Honeypot : champ invisible. Un humain ne le remplit jamais, un bot souvent.
  const [company, setCompany] = useState("");

  function update<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!fields.firstName.trim()) next.firstName = t("contact.errors.firstName");
    if (!fields.lastName.trim()) next.lastName = t("contact.errors.lastName");
    if (!EMAIL_RE.test(fields.email.trim())) next.email = t("contact.errors.email");
    if (fields.phone.trim() && !PHONE_RE.test(fields.phone.trim()))
      next.phone = t("contact.errors.phone");
    if (fields.message.trim().length < 10) next.message = t("contact.errors.message");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setStatus("sending");
    try {
      // 1. Triage IA serveur et récupération de la clé Web3Forms
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, company }),
      });
      if (!res.ok) {
        setStatus("error");
        setFormError(t("contact.errors.server"));
        return;
      }
      
      const data = await res.json();
      
      // Honeypot a marché, le serveur a renvoyé {ok: true} sans accessKey.
      if (!data.accessKey) {
        setStatus("success");
        setFields(EMPTY);
        return;
      }

      // 2. Envoi direct à Web3Forms depuis le client (évite le blocage IP serveur)
      const web3res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: data.accessKey,
          subject: data.subject,
          from_name: `${fields.firstName} ${fields.lastName}`,
          replyto: fields.email,
          Prénom: fields.firstName,
          Nom: fields.lastName,
          Email: fields.email,
          Téléphone: fields.phone || "—",
          Message: fields.message,
          "Triage IA": data.spam ? "spam probable" : "légitime",
        }),
      });

      if (!web3res.ok) {
        setStatus("error");
        setFormError(t("contact.errors.server"));
        return;
      }

      setStatus("success");
      setFields(EMPTY);
    } catch {
      setStatus("error");
      setFormError(t("contact.errors.network"));
    }
  }

  // Classes partagées des champs (clair + sombre).
  const inputBase =
    "w-full rounded-lg border bg-white/70 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors " +
    "placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 " +
    "dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500";
  const ok = "border-slate-300 dark:border-slate-700";
  const bad = "border-red-400 dark:border-red-500/70";

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur
                    dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircleIcon className="h-12 w-12 text-emerald-500 dark:text-emerald-400" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("contact.form.successTitle")}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              {t("contact.form.successBody")}
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium
                         text-slate-700 transition-colors hover:border-emerald-400 hover:text-emerald-600
                         dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
            >
              {t("contact.form.sendAnother")}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="firstName"
                label={t("contact.form.firstName")}
                value={fields.firstName}
                onChange={(v) => update("firstName", v)}
                error={errors.firstName}
                autoComplete="given-name"
                className={`${inputBase} ${errors.firstName ? bad : ok}`}
              />
              <Field
                id="lastName"
                label={t("contact.form.lastName")}
                value={fields.lastName}
                onChange={(v) => update("lastName", v)}
                error={errors.lastName}
                autoComplete="family-name"
                className={`${inputBase} ${errors.lastName ? bad : ok}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="email"
                type="email"
                label={t("contact.form.email")}
                value={fields.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
                autoComplete="email"
                className={`${inputBase} ${errors.email ? bad : ok}`}
              />
              <Field
                id="phone"
                type="tel"
                label={t("contact.form.phoneOptional")}
                value={fields.phone}
                onChange={(v) => update("phone", v)}
                error={errors.phone}
                autoComplete="tel"
                className={`${inputBase} ${errors.phone ? bad : ok}`}
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {t("contact.form.message")}
              </label>
              <textarea
                id="message"
                rows={5}
                value={fields.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={t("contact.form.messagePlaceholder")}
                aria-invalid={!!errors.message}
                className={`${inputBase} resize-y ${errors.message ? bad : ok}`}
              />
              {errors.message && <ErrorText>{errors.message}</ErrorText>}
            </div>

            {/* Honeypot : caché aux humains, ignoré des lecteurs d'écran. */}
            <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {formError && (
              <p className="rounded-lg border border-red-400/50 bg-red-50 px-3 py-2 text-sm text-red-700
                            dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5
                         text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400
                         disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? t("contact.form.sending") : t("contact.form.send")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sous-composants ──────────────────────────────────────────────────────────
function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
      {children}
    </p>
  );
}
