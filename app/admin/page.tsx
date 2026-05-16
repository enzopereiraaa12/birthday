"use client";

import { ArrowLeft, Download, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { RSVPRecord } from "@/lib/rsvp-schema";

type AdminResponse = {
  ok: boolean;
  rsvps: RSVPRecord[];
  emailConfigured: boolean;
  recipient: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totals = useMemo(() => {
    return {
      all: rsvps.length,
      yes: rsvps.filter((rsvp) => rsvp.attending === "yes").length,
      no: rsvps.filter((rsvp) => rsvp.attending === "no").length,
      guests: rsvps.filter((rsvp) => rsvp.plusOne === "one").length
    };
  }, [rsvps]);

  const requestAdmin = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/admin/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, ...body })
    });
    const json = (await response.json()) as Partial<AdminResponse>;
    if (!response.ok || !json.ok) {
      throw new Error("Unauthorized");
    }
    setRsvps(json.rsvps || []);
    setLoaded(true);
  };

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      await requestAdmin({});
    } catch {
      setError("Mot de passe incorrect ou impossible de charger les réponses.");
    } finally {
      setLoading(false);
    }
  };

  const deleteOne = async (rsvp: RSVPRecord) => {
    const ok = window.confirm(`Supprimer la réponse de ${rsvp.firstName} ?`);
    if (!ok) return;
    setError("");
    setDeletingId(rsvp.id);
    try {
      await requestAdmin({ action: "delete", id: rsvp.id });
    } catch {
      setError("Impossible de supprimer cette réponse.");
    } finally {
      setDeletingId(null);
    }
  };

  const exportCsv = () => {
    const header = ["Nom", "Présent", "+1", "Accompagnant", "Alcool", "Allergies", "Message", "Date"];
    const rows = rsvps.map((rsvp) => [
      rsvp.firstName,
      rsvp.attending === "yes" ? "Oui" : "Non",
      rsvp.plusOne === "one" ? "Oui" : "Non",
      rsvp.plusOneName || "",
      alcoholLabel(rsvp.alcohol),
      rsvp.allergies || "",
      rsvp.message || "",
      new Date(rsvp.createdAt).toLocaleString("fr-FR")
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rsvps-enzo-22.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#130813] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-pink-100">
          <ArrowLeft size={16} />
          Retour au site
        </a>

        <section className="glass rounded-[2rem] p-5 sm:p-7">
          <h1 className="font-display text-3xl font-black uppercase sm:text-5xl">Admin RSVP</h1>

          <div className="mt-7 flex flex-col gap-3 sm:max-w-xl sm:flex-row">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void load();
              }}
              placeholder="Mot de passe admin"
              className="min-h-13 flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 font-semibold text-white outline-none placeholder:text-pink-100/45 focus:border-pink-100/70"
            />
            <button
              onClick={load}
              disabled={loading}
              className="glossy-button inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl px-6 font-black uppercase tracking-[0.12em] disabled:opacity-70"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Voir
            </button>
          </div>

          {error && <p className="mt-4 font-semibold text-pink-100">{error}</p>}
        </section>

        {loaded && (
          <>
            <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Réponses" value={totals.all} />
              <Stat label="Présents" value={totals.yes} />
              <Stat label="Absents" value={totals.no} />
              <Stat label="+1" value={totals.guests} />
            </section>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-bold text-pink-50"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <section className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/8">
              {rsvps.length === 0 ? (
                <div className="p-6 text-pink-50/75">Aucune réponse pour le moment.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[1080px] w-full border-collapse text-sm">
                    <thead className="bg-pink-300/18 text-left uppercase tracking-[0.12em] text-pink-100">
                      <tr>
                        <Th>Nom</Th>
                        <Th>Présent ?</Th>
                        <Th>+1 ?</Th>
                        <Th>Accompagnant</Th>
                        <Th>Alcool</Th>
                        <Th>Allergies</Th>
                        <Th>Message</Th>
                        <Th>Date</Th>
                        <Th>Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="border-t border-white/10">
                          <Td strong>{rsvp.firstName}</Td>
                          <Td>{rsvp.attending === "yes" ? "Oui" : "Non"}</Td>
                          <Td>{rsvp.plusOne === "one" ? "Oui" : "Non"}</Td>
                          <Td>{rsvp.plusOneName || "-"}</Td>
                          <Td>{alcoholLabel(rsvp.alcohol)}</Td>
                          <Td>{rsvp.allergies || "-"}</Td>
                          <Td>{rsvp.message || "-"}</Td>
                          <Td>{new Date(rsvp.createdAt).toLocaleString("fr-FR")}</Td>
                          <Td>
                            <button
                              type="button"
                              onClick={() => void deleteOne(rsvp)}
                              disabled={deletingId === rsvp.id}
                              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-pink-200/30 bg-pink-500/15 px-3 text-xs font-bold uppercase tracking-[0.1em] text-pink-100 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              {deletingId === rsvp.id ? "..." : "Supprimer"}
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pink-200/80">{label}</p>
      <p className="mt-1 font-display text-4xl font-black text-white">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}

function Td({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <td className={`px-4 py-4 align-top ${strong ? "font-bold text-white" : "text-pink-50/90"}`}>{children}</td>;
}

function alcoholLabel(value: RSVPRecord["alcohol"]) {
  if (value === "little") return "Un peu";
  return value === "yes" ? "Oui" : "Non";
}
