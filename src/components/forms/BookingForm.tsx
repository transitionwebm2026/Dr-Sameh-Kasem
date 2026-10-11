"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({ whatsappNumber }: { whatsappNumber: string }) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const clinics = siteConfig.clinics.map((clinic) => clinic[locale as "ar" | "en"].name);
  const services: string[] = t.raw("services");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const service = String(formData.get("service") ?? "");
    const clinic = String(formData.get("clinic") ?? "");
    const message = String(formData.get("message") ?? "").trim();

    const nextErrors: Record<string, boolean> = {
      name: !name,
      phone: !phone,
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;

    setStatus("submitting");

    try {
      if (isSupabaseConfigured && supabase) {
        // Best-effort record: WhatsApp (below) is the real delivery channel,
        // so a failed insert here shouldn't block the booking flow.
        await supabase.from("consultation_requests").insert({
          name,
          phone,
          service: service || null,
          clinic: clinic || null,
          message: message || null,
          locale,
        });
      }

      const whatsappMessage = t("whatsappTemplate", {
        name,
        phone,
        service: service || "-",
        clinic: clinic || "-",
        message: message || "-",
      });

      setStatus("success");
      window.open(buildWhatsAppLink(whatsappMessage, whatsappNumber), "_blank", "noopener,noreferrer");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <GlassCard hover={false} className="p-6 sm:p-10 h-full flex flex-col">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-forest font-tajawal mb-3">
        {t("title")}
      </h2>
      <p className="text-sm text-brand-800/80 leading-relaxed mb-8">{t("text")}</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col justify-between gap-6">
        <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-brand-forest mb-2">
              {t("nameLabel")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={t("namePlaceholder")}
              className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-4 py-3 text-sm text-brand-900 placeholder:text-brand-700/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition"
            />
            {errors.name ? (
              <p className="text-xs text-red-600 mt-1">{t("required")}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-brand-forest mb-2">
              {t("phoneLabel")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              placeholder={t("phonePlaceholder")}
              className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-4 py-3 text-sm text-brand-900 placeholder:text-brand-700/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition"
            />
            {errors.phone ? (
              <p className="text-xs text-red-600 mt-1">{t("required")}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="service" className="block text-sm font-bold text-brand-forest mb-2">
              {t("serviceLabel")}
            </label>
            <select
              id="service"
              name="service"
              defaultValue=""
              className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-4 py-3 text-sm text-brand-900 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition"
            >
              <option value="" disabled>
                {t("servicePlaceholder")}
              </option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="clinic" className="block text-sm font-bold text-brand-forest mb-2">
              {t("clinicLabel")}
            </label>
            <select
              id="clinic"
              name="clinic"
              defaultValue={clinics[0]}
              className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-4 py-3 text-sm text-brand-900 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition"
            >
              {clinics.map((clinic) => (
                <option key={clinic} value={clinic}>
                  {clinic}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-brand-forest mb-2">
            {t("messageLabel")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder={t("messagePlaceholder")}
            className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-4 py-3 text-sm text-brand-900 placeholder:text-brand-700/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition resize-none"
          />
        </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-brand-forest text-white font-extrabold text-base hover:bg-brand-900 transition-all duration-300 shadow-xl hover:scale-[1.01] border border-emerald-700/30 disabled:opacity-60 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5 text-brand-gold" />
            <span>{status === "submitting" ? t("submitting") : t("submit")}</span>
          </button>

          <AnimatePresence>
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{t("success")}</span>
              </motion.div>
            ) : null}
            {status === "error" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{t("error")}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    </GlassCard>
  );
}
