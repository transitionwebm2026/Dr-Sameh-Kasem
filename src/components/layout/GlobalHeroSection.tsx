import { Calendar, ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DynamicIcon } from "@/lib/icons";
import { FadeIn } from "@/components/motion/FadeIn";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";
import { cn } from "@/lib/utils";

type Cta = { label: string; href: string };
type BookingCard = { title: string; text: string; cta: string };

function isExternalHref(href: string) {
  return /^(tel:|mailto:|https?:|#)/.test(href);
}

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export async function GlobalHeroSection({
  title,
  titleHighlight,
  subtitle,
  primaryCta,
  secondaryCta,
  followLabel,
  showDoctor = false,
  doctorImage,
  doctorImageAlt,
  bg3DElement = "brain",
  bookingCard,
  reserveOverlapSpace = false,
}: {
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  followLabel?: string;
  showDoctor?: boolean;
  doctorImage?: string;
  doctorImageAlt?: string;
  bg3DElement?: string;
  bookingCard?: BookingCard;
  /** Reserves extra guaranteed empty space at the bottom (lg:+ only) for a
   * floating element — like a stats bar — to overlap into without ever
   * covering the hero's own text/CTAs, regardless of viewport aspect ratio. */
  reserveOverlapSpace?: boolean;
}) {
  // Admin-editable in /admin/dashboard/settings; falls back to the static
  // defaults if the settings row can't be reached so the hero never breaks.
  const contact = await getSiteSettingsOrDefault();

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-ivory pt-28 pb-8 sm:pt-32",
        showDoctor && doctorImage ? "flex min-h-screen flex-col justify-center" : "",
        reserveOverlapSpace ? "lg:pb-24" : ""
      )}
    >
      {/* Doctor portrait as a full-bleed background layer, edge to edge */}
      {showDoctor && doctorImage ? (
        <>
          <div
            role="img"
            aria-label={doctorImageAlt ?? ""}
            className="absolute inset-0 bg-cover bg-[position:88%_top] rtl:bg-[position:12%_top]"
            style={{ backgroundImage: `url(${doctorImage})` }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-ivory/95 via-brand-ivory/30 to-transparent rtl:bg-gradient-to-l"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-ivory/70 to-transparent"
            aria-hidden="true"
          />
        </>
      ) : null}

      {/* Warm ambient backdrop: soft wave lines + glass glow blobs */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-40"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 220 C 250 160, 450 280, 700 210 S 1100 140, 1200 200"
          fill="none"
          stroke="#c5a059"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <path
          d="M0 420 C 280 360, 500 480, 750 410 S 1080 340, 1200 400"
          fill="none"
          stroke="#0a2a22"
          strokeOpacity="0.08"
          strokeWidth="2"
        />
      </svg>
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -end-24 h-96 w-96 rounded-full bg-brand-700/10 blur-3xl animate-float-slow"
        aria-hidden="true"
      />

      {/* Giant translucent anatomical glass backdrop */}
      <DynamicIcon
        name={bg3DElement}
        className="pointer-events-none absolute end-[-4rem] top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 text-brand-forest/[0.06] md:block lg:h-[32rem] lg:w-[32rem]"
        strokeWidth={0.6}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("grid w-full items-center", !showDoctor && "gap-10")}>
          {/* Copy + CTAs — sits over the full-bleed photo when showDoctor is set */}
          <div
            className={cn(
              "space-y-6 text-center",
              showDoctor ? "lg:max-w-xl lg:text-start lg:me-auto" : "mx-auto max-w-3xl"
            )}
          >
            <FadeIn delay={0.05}>
              <h1 className="text-balance font-tajawal text-4xl font-black leading-tight tracking-tight text-brand-forest sm:text-5xl lg:text-6xl">
                {title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-brand-600 to-brand-forest">
                  {titleHighlight}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p
                className={cn(
                  "text-base leading-relaxed text-brand-800/85 sm:text-lg",
                  showDoctor ? "mx-auto max-w-xl lg:mx-0" : "mx-auto max-w-2xl"
                )}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            </FadeIn>

            <FadeIn delay={0.15}>
              <div
                className={cn(
                  "flex flex-wrap items-center gap-4 pt-2",
                  showDoctor ? "justify-center lg:justify-start" : "justify-center"
                )}
              >
                <CtaLink
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-goldLight px-7 py-3.5 text-sm font-extrabold text-brand-deep shadow-xl transition-all duration-300 hover:scale-105 hover:bg-brand-gold sm:text-base"
                >
                  <Calendar className="h-5 w-5" />
                  <span>{primaryCta.label}</span>
                </CtaLink>
                <CtaLink
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-brand-gold/40 bg-white/60 px-7 py-3.5 text-sm font-bold text-brand-forest backdrop-blur-sm transition-all duration-300 hover:border-brand-gold hover:bg-white sm:text-base"
                >
                  <span>{secondaryCta.label}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </CtaLink>
              </div>
            </FadeIn>

          </div>
        </div>

        {/* Booking card: stacks in normal flow on mobile/tablet, floats over the photo from lg up */}
        {showDoctor && doctorImage && bookingCard ? (
          <FadeIn
            delay={0.25}
            className="relative z-20 mx-auto mt-6 w-full max-w-xs lg:absolute lg:end-4 lg:top-1/2 lg:mx-0 lg:mt-0 lg:w-64 lg:-translate-y-1/2"
          >
            <div className="liquid-glass rounded-3xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-goldLight text-brand-deep">
                <Calendar className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-tajawal text-sm font-extrabold text-brand-forest">
                {bookingCard.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-800/75">
                {bookingCard.text}
              </p>
              <CtaLink
                href={primaryCta.href}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-goldLight px-4 py-2.5 text-xs font-bold text-brand-deep transition-all duration-300 hover:bg-brand-gold"
              >
                <span>{bookingCard.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </CtaLink>

              <div className="mt-4 space-y-3 border-t border-brand-900/10 pt-3">
                <a
                  href={contact.phone_href}
                  className="flex items-center gap-2.5 text-xs font-bold text-brand-forest transition-colors hover:text-brand-gold"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold">
                    <Phone className="h-3 w-3" strokeWidth={1.8} />
                  </span>
                  <span dir="ltr">{contact.phone_display}</span>
                </a>

                {followLabel && (contact.facebook_url || contact.instagram_url || contact.tiktok_url) ? (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700/60">
                      {followLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {contact.facebook_url ? (
                        <a
                          href={contact.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Facebook"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                        >
                          <FacebookIcon className="h-3 w-3" />
                        </a>
                      ) : null}
                      {contact.instagram_url ? (
                        <a
                          href={contact.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Instagram"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                        >
                          <InstagramIcon className="h-3 w-3" />
                        </a>
                      ) : null}
                      {contact.tiktok_url ? (
                        <a
                          href={contact.tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="TikTok"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                        >
                          <TikTokIcon className="h-3 w-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
