"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Heart, Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";

type FormState = {
  firstName: string;
  attending: "" | "yes" | "no";
  plusOne: "" | "none" | "one";
  plusOneName: string;
  alcohol: "" | "yes" | "no" | "little";
  allergies: string;
  message: string;
  honeypot: string;
};

const initialState: FormState = {
  firstName: "",
  attending: "",
  plusOne: "",
  plusOneName: "",
  alcohol: "",
  allergies: "",
  message: "",
  honeypot: ""
};

export default function RSVPQuiz() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const steps = useMemo(() => {
    const base = [
      "firstName",
      "attending",
      "plusOne",
      ...(form.plusOne === "one" ? ["plusOneName"] : []),
      "alcohol",
      "allergies",
      "message",
      "confirm"
    ];
    return base;
  }, [form.plusOne]);

  const progress = Math.round(((step + 1) / steps.length) * 100);
  const current = steps[step];
  const canContinue = validateStep(current, form);

  const update = (patch: Partial<FormState>) => {
    setError("");
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const next = () => {
    if (!canContinue) {
      setError("Encore un petit détail à remplir.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  const submit = async () => {
    if (status === "sending" || status === "sent") return;
    if (!canContinue) return;
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        throw new Error(json.message || "Erreur RSVP");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("L'envoi n'a pas fonctionné. Réessaie dans un instant.");
    }
  };

  return (
    <section id="rsvp" className="relative z-20 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 text-center">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-pink-200">rsvp / guest quiz</p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase text-white sm:text-5xl">
            Are you coming?
          </h2>
        </div>

        <div className="glass overflow-hidden rounded-[2rem] p-5 sm:p-7">
          <div className="mb-7 h-3 overflow-hidden rounded-full bg-white/12">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-200 via-bubblegum to-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <input
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(event) => update({ honeypot: event.target.value })}
            aria-hidden
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 34, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -34, filter: "blur(10px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[360px]"
            >
              {status === "sent" ? (
                <Success />
              ) : (
                <StepContent current={current} form={form} update={update} />
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p className="mt-4 text-sm font-semibold text-pink-100">{error}</p>}

          {status !== "sent" && (
            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || status === "sending"}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition enabled:active:scale-95 disabled:opacity-30"
                aria-label="Question précédente"
              >
                <ChevronLeft size={20} />
              </button>

              {current === "confirm" ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "sending"}
                  className="glossy-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-black uppercase tracking-[0.12em] transition active:scale-[.98] disabled:opacity-70"
                >
                  {status === "sending" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Confirm RSVP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="glossy-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-black uppercase tracking-[0.12em] transition active:scale-[.98]"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StepContent({
  current,
  form,
  update
}: {
  current: string;
  form: FormState;
  update: (patch: Partial<FormState>) => void;
}) {
  if (current === "firstName") {
    return (
      <Question title="Quel est ton prénom ?" subtitle="Pour mettre ton RSVP dans la VIP list.">
        <TextInput
          autoFocus
          value={form.firstName}
          onChange={(value) => update({ firstName: value })}
          placeholder="Ton prénom"
        />
      </Question>
    );
  }

  if (current === "attending") {
    return (
      <Question title="Seras-tu présent(e) à la soirée ?" subtitle="Réponse officielle, énergie pink carpet.">
        <ChoiceGrid
          value={form.attending}
          options={[
            ["yes", "Oui évidemment 💖"],
            ["no", "Non malheureusement 😢"]
          ]}
          onChange={(value) => update({ attending: value as FormState["attending"] })}
        />
      </Question>
    );
  }

  if (current === "plusOne") {
    return (
      <Question
        title="Viendras-tu accompagné(e) ?"
        subtitle="Si tu veux venir avec un +1, merci de confirmer avec moi avant."
      >
        <ChoiceGrid
          value={form.plusOne}
          options={[
            ["none", "Non"],
            ["one", "Oui (+1)"]
          ]}
          onChange={(value) => update({ plusOne: value as FormState["plusOne"], plusOneName: value === "none" ? "" : form.plusOneName })}
        />
      </Question>
    );
  }

  if (current === "plusOneName") {
    return (
      <Question title="Prénom de ton +1" subtitle="Pour l'ajouter à la liste.">
        <TextInput
          autoFocus
          value={form.plusOneName}
          onChange={(value) => update({ plusOneName: value })}
          placeholder="Prénom de l'accompagnant(e)"
        />
      </Question>
    );
  }

  if (current === "alcohol") {
    return (
      <Question title="Bois-tu de l'alcool ?" subtitle="Pour prévoir ce qu'il faut, chic et simple.">
        <ChoiceGrid
          value={form.alcohol}
          options={[
            ["yes", "Oui"],
            ["no", "Non"],
            ["little", "Un peu 👀"]
          ]}
          onChange={(value) => update({ alcohol: value as FormState["alcohol"] })}
        />
      </Question>
    );
  }

  if (current === "allergies") {
    return (
      <Question title="Allergies ou restrictions alimentaires ?" subtitle="Optionnel, mais important.">
        <TextArea
          value={form.allergies}
          onChange={(value) => update({ allergies: value })}
          placeholder="Aucune, végétarien, sans gluten..."
        />
      </Question>
    );
  }

  if (current === "message") {
    return (
      <Question title="Un message pour le birthday boy ? ✨" subtitle="Optionnel, mais forcément iconique.">
        <TextArea
          value={form.message}
          onChange={(value) => update({ message: value })}
          placeholder="Ton message..."
        />
      </Question>
    );
  }

  return (
    <Question title="Confirmer l'envoi" subtitle="Dernier check avant l'arrivée dans la boîte mail.">
      <div className="space-y-3 rounded-[1.4rem] border border-white/15 bg-black/20 p-4">
        <Summary label="Prénom" value={form.firstName} />
        <Summary label="Présence" value={form.attending === "yes" ? "Oui évidemment" : "Non malheureusement"} />
        <Summary label="+1" value={form.plusOne === "one" ? form.plusOneName : "Non"} />
        <Summary label="Alcool" value={form.alcohol === "little" ? "Un peu" : form.alcohol === "yes" ? "Oui" : "Non"} />
        <Summary label="Allergies" value={form.allergies || "-"} />
        <Summary label="Message" value={form.message || "-"} />
      </div>
    </Question>
  );
}

function Question({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[360px] flex-col justify-center">
      <div className="mb-7">
        <h3 className="font-display text-3xl font-black uppercase leading-tight text-white">{title}</h3>
        <p className="mt-3 text-base leading-7 text-pink-50/76">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  autoFocus
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-16 w-full rounded-[1.4rem] border border-white/22 bg-white/12 px-5 text-lg font-bold text-white outline-none shadow-chrome placeholder:text-pink-100/44 focus:border-pink-100/80"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full resize-none rounded-[1.4rem] border border-white/22 bg-white/12 px-5 py-4 text-base font-semibold text-white outline-none shadow-chrome placeholder:text-pink-100/44 focus:border-pink-100/80"
    />
  );
}

function ChoiceGrid({
  value,
  options,
  onChange
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map(([optionValue, label]) => {
        const selected = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`flex min-h-16 items-center justify-between rounded-[1.4rem] border px-5 text-left text-lg font-bold transition active:scale-[.98] ${
              selected
                ? "border-white/70 bg-pink-300/30 shadow-chrome"
                : "border-white/18 bg-white/10 hover:border-pink-100/55"
            }`}
          >
            <span>{label}</span>
            <span className={`grid h-7 w-7 place-items-center rounded-full border ${selected ? "border-white bg-white text-pink-600" : "border-white/30"}`}>
              {selected && <Check size={16} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-pink-200/80">{label}</span>
      <span className="max-w-[58%] text-right font-semibold text-white">{value}</span>
    </div>
  );
}

function Success() {
  return (
    <div className="grid min-h-[360px] place-items-center text-center">
      <div>
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-white/45 bg-pink-300/24 shadow-chrome">
          <Heart fill="white" size={34} />
        </div>
        <h3 className="font-display text-3xl font-black uppercase text-white">Your RSVP has been sent 💌</h3>
        <p className="mx-auto mt-4 max-w-sm text-pink-50/78">
          Merci. La réponse est enregistrée et envoyée au birthday boy.
        </p>
      </div>
    </div>
  );
}

function validateStep(current: string, form: FormState) {
  if (current === "firstName") return form.firstName.trim().length >= 2;
  if (current === "attending") return Boolean(form.attending);
  if (current === "plusOne") return Boolean(form.plusOne);
  if (current === "plusOneName") return form.plusOneName.trim().length >= 2;
  if (current === "alcohol") return Boolean(form.alcohol);
  return true;
}
