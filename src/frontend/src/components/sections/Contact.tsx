import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSubmitContactMessage } from "@/hooks/useQueries";
import { SOCIAL_LINKS } from "@/lib/sections";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
  Twitter,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
} as const;

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY_FORM: FormValues = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Please add a short message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

/** Contact section: validated form backed by submitContactMessage plus social links. */
export function Contact() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const mutation = useSubmitContactMessage();

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (submitted) setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };
    setValues(EMPTY_FORM);
    setSubmitted(false);
    mutation.mutate(payload, {
      onSuccess: () => setSubmitted(true),
      onError: () => {
        setValues((current) =>
          current.name === "" && current.message === "" ? payload : current,
        );
      },
    });
  };

  const reveal = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      data-ocid="contact.section"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6"
    >
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Get in touch
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-gradient">Let&apos;s build something</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Have a project, a role, or an idea worth exploring? Send a message and
          I&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.form
          {...reveal(0)}
          onSubmit={handleSubmit}
          noValidate
          data-ocid="contact.form"
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                data-ocid="contact.name_input"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  data-ocid="contact.name_error"
                  className="text-xs text-destructive"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                data-ocid="contact.email_input"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  data-ocid="contact.email_error"
                  className="text-xs text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              data-ocid="contact.message_textarea"
              rows={5}
              placeholder="Tell me about the project, timeline, and what success looks like."
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
            />
            {errors.message && (
              <p
                id="contact-message-error"
                data-ocid="contact.message_error"
                className="text-xs text-destructive"
              >
                {errors.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              size="lg"
              data-ocid="contact.submit_button"
              disabled={mutation.isPending}
              className="rounded-full bg-gradient-primary px-6 font-medium text-primary-foreground shadow-glow-cyan transition-smooth hover:brightness-110"
            >
              {mutation.isPending ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send message
                </>
              )}
            </Button>

            {submitted && (
              <output
                data-ocid="contact.success_state"
                className="flex items-center gap-2 text-sm text-[oklch(var(--success))]"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Message sent — thanks, I&apos;ll be in touch.
              </output>
            )}

            {mutation.isError && (
              <p
                data-ocid="contact.error_state"
                role="alert"
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </motion.form>

        <motion.aside
          {...reveal(0.12)}
          data-ocid="contact.links_panel"
          className="glass flex flex-col rounded-2xl p-6 sm:p-8"
        >
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            Elsewhere
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Prefer another channel? Reach out through any of these.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICONS[social.icon];
              const isMail = social.icon === "mail";
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noreferrer"}
                    data-ocid={`contact.social.${social.icon}`}
                    className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-fast hover:border-primary/50 hover:bg-secondary/50 hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground transition-fast group-hover:text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-foreground/90 transition-fast group-hover:text-primary">
                      {social.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
