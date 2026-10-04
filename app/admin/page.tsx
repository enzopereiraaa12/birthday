"use client";

import { ArrowLeft, Download, Play, RefreshCw, Shuffle, SkipForward, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PROFILE_QUESTIONS } from "@/lib/game-config";
import type { RSVPRecord } from "@/lib/rsvp-schema";

type AdminResponse = {
  ok: boolean;
  rsvps: RSVPRecord[];
  emailConfigured: boolean;
  recipient: string;
};

type GamePlayer = {
  id: string;
  firstName: string;
  hasProfile: boolean;
  profileAnswers: number[] | null;
  duoId: string | null;
};
type GameDuo = { id: string; memberIds: string[]; memberNames: string[]; score: number };
type GameSnapshot = {
  state: { phase: string; currentQuestionIndex: number };
  players: GamePlayer[];
  duos: GameDuo[];
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RSVPRecord>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [game, setGame] = useState<GameSnapshot | null>(null);
  const [gameError, setGameError] = useState("");
  const [gameLoading, setGameLoading] = useState(false);
  const [pendingDuos, setPendingDuos] = useState<Array<{ id: string; memberIds: string[] }>>([]);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [editPlayerAnswers, setEditPlayerAnswers] = useState<number[]>([]);

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
      await gameAction("refresh");
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

  const startEdit = (rsvp: RSVPRecord) => {
    setEditingId(rsvp.id);
    setEditForm({ ...rsvp });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSavingEdit(true);
    setError("");
    try {
      await requestAdmin({
        action: "edit",
        id: editingId,
        patch: {
          firstName: editForm.firstName,
          attending: editForm.attending,
          plusOne: editForm.plusOne,
          plusOneName: editForm.plusOneName,
          alcohol: editForm.alcohol,
          allergies: editForm.allergies,
          message: editForm.message
        }
      });
      setEditingId(null);
      setEditForm({});
    } catch {
      setError("Impossible de modifier cette réponse.");
    } finally {
      setSavingEdit(false);
    }
  };

  const gameAction = async (action: string, payload?: Record<string, unknown>) => {
    setGameError("");
    setGameLoading(true);
    try {
      const response = await fetch("/api/admin/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action, ...payload })
      });
      const json = (await response.json()) as Partial<GameSnapshot> & { ok: boolean };
      if (!response.ok || !json.ok) throw new Error("Action impossible.");
      const snapshot = json as GameSnapshot;
      setGame(snapshot);
      setPendingDuos(snapshot.duos.map((duo) => ({ id: duo.id, memberIds: duo.memberIds })));
    } catch {
      setGameError("Mot de passe incorrect ou action impossible.");
    } finally {
      setGameLoading(false);
    }
  };

  const updatePendingDuoMember = (duoId: string, memberIndex: number, playerId: string) => {
    setPendingDuos((prev) =>
      prev.map((duo) => {
        if (duo.id !== duoId) return duo;
        const memberIds = [...duo.memberIds];
        memberIds[memberIndex] = playerId;
        return { ...duo, memberIds };
      })
    );
  };

  const saveDuos = () => gameAction("setDuos", { duos: pendingDuos });

  const startEditPlayer = (player: GamePlayer) => {
    setEditingPlayerId(player.id);
    setEditPlayerName(player.firstName);
    setEditPlayerAnswers(player.profileAnswers ? [...player.profileAnswers] : Array(PROFILE_QUESTIONS.length).fill(0));
  };

  const cancelEditPlayer = () => {
    setEditingPlayerId(null);
    setEditPlayerName("");
    setEditPlayerAnswers([]);
  };

  const saveEditPlayer = async () => {
    if (!editingPlayerId) return;
    await gameAction("updatePlayer", {
      playerId: editingPlayerId,
      firstName: editPlayerName,
      profileAnswers: editPlayerAnswers
    });
    cancelEditPlayer();
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
                      {rsvps.map((rsvp) => {
                        const isEditing = editingId === rsvp.id;
                        return (
                        <tr key={rsvp.id} className="border-t border-white/10">
                          <Td strong>
                            {isEditing ? (
                              <EditInput value={editForm.firstName || ""} onChange={(v) => setEditForm((f) => ({ ...f, firstName: v }))} />
                            ) : (
                              rsvp.firstName
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditSelect
                                value={editForm.attending || "yes"}
                                options={[["yes", "Oui"], ["no", "Non"]]}
                                onChange={(v) => setEditForm((f) => ({ ...f, attending: v as RSVPRecord["attending"] }))}
                              />
                            ) : rsvp.attending === "yes" ? (
                              "Oui"
                            ) : (
                              "Non"
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditSelect
                                value={editForm.plusOne || "none"}
                                options={[["none", "Non"], ["one", "Oui"]]}
                                onChange={(v) => setEditForm((f) => ({ ...f, plusOne: v as RSVPRecord["plusOne"] }))}
                              />
                            ) : rsvp.plusOne === "one" ? (
                              "Oui"
                            ) : (
                              "Non"
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditInput
                                value={editForm.plusOneName || ""}
                                onChange={(v) => setEditForm((f) => ({ ...f, plusOneName: v }))}
                                placeholder="Prénom du +1"
                              />
                            ) : (
                              rsvp.plusOneName || "-"
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditSelect
                                value={editForm.alcohol || "no"}
                                options={[["yes", "Oui"], ["no", "Non"], ["little", "Un peu"]]}
                                onChange={(v) => setEditForm((f) => ({ ...f, alcohol: v as RSVPRecord["alcohol"] }))}
                              />
                            ) : (
                              alcoholLabel(rsvp.alcohol)
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditInput value={editForm.allergies || ""} onChange={(v) => setEditForm((f) => ({ ...f, allergies: v }))} />
                            ) : (
                              rsvp.allergies || "-"
                            )}
                          </Td>
                          <Td>
                            {isEditing ? (
                              <EditInput value={editForm.message || ""} onChange={(v) => setEditForm((f) => ({ ...f, message: v }))} />
                            ) : (
                              rsvp.message || "-"
                            )}
                          </Td>
                          <Td>{new Date(rsvp.createdAt).toLocaleString("fr-FR")}</Td>
                          <Td>
                            {isEditing ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => void saveEdit()}
                                  disabled={savingEdit}
                                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 text-xs font-bold uppercase tracking-[0.1em] text-emerald-200 disabled:opacity-50"
                                >
                                  {savingEdit ? "..." : "Sauver"}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-bold uppercase tracking-[0.1em] text-pink-50"
                                >
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEdit(rsvp)}
                                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-bold uppercase tracking-[0.1em] text-pink-50"
                                >
                                  Éditer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void deleteOne(rsvp)}
                                  disabled={deletingId === rsvp.id}
                                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-pink-200/30 bg-pink-500/15 px-3 text-xs font-bold uppercase tracking-[0.1em] text-pink-100 disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  {deletingId === rsvp.id ? "..." : "Supprimer"}
                                </button>
                              </div>
                            )}
                          </Td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-10 glass rounded-[2rem] p-5 sm:p-7">
              <h2 className="font-display text-2xl font-black uppercase sm:text-3xl">Jeu — binômes</h2>
              {gameError && <p className="mt-3 font-semibold text-pink-100">{gameError}</p>}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => gameAction("match")}
                  disabled={gameLoading}
                  className="glossy-button inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-60"
                >
                  <Shuffle size={15} />
                  Lancer l'appariement
                </button>
                <button
                  type="button"
                  onClick={() => gameAction("validate")}
                  disabled={gameLoading || !game?.duos.length}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold uppercase tracking-[0.1em] text-pink-50 disabled:opacity-40"
                >
                  Valider les binômes
                </button>
                <button
                  type="button"
                  onClick={() => gameAction("startLive")}
                  disabled={gameLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold uppercase tracking-[0.1em] text-pink-50 disabled:opacity-40"
                >
                  <Play size={14} />
                  Ouvrir le jeu live
                </button>
                <button
                  type="button"
                  onClick={() => gameAction("nextQuestion")}
                  disabled={gameLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold uppercase tracking-[0.1em] text-pink-50 disabled:opacity-40"
                >
                  <SkipForward size={14} />
                  Question suivante
                </button>
                <button
                  type="button"
                  onClick={() => gameAction("end")}
                  disabled={gameLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-bold uppercase tracking-[0.1em] text-pink-50 disabled:opacity-40"
                >
                  Terminer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Réinitialiser tout le jeu (comptes, réponses, binômes) ?")) gameAction("reset");
                  }}
                  disabled={gameLoading}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-pink-200/30 bg-pink-500/15 px-5 text-xs font-bold uppercase tracking-[0.1em] text-pink-100 disabled:opacity-40"
                >
                  Réinitialiser
                </button>
              </div>

              {game && (
                <>
                  <p className="mt-5 text-sm font-semibold text-pink-100/80">
                    État : <span className="font-black text-white">{game.state.phase}</span> · {game.players.length} joueur(s),{" "}
                    {game.players.filter((p) => p.hasProfile).length} ont répondu au quiz de goûts
                  </p>

                  {game.players.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-display text-xs uppercase tracking-[0.2em] text-pink-200">joueurs inscrits</p>
                      {game.players.map((player) => {
                        const isEditingPlayer = editingPlayerId === player.id;
                        return (
                        <details key={player.id} className="rounded-xl border border-white/15 bg-white/8 p-3" open={isEditingPlayer}>
                          <summary className="flex cursor-pointer items-center justify-between gap-2 font-bold text-white">
                            <span>{player.firstName}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${
                                player.hasProfile ? "bg-emerald-400/25 text-emerald-200" : "bg-white/10 text-pink-100/60"
                              }`}
                            >
                              {player.hasProfile ? "a répondu" : "en attente"}
                            </span>
                          </summary>

                          {isEditingPlayer ? (
                            <div className="mt-3 space-y-3 text-sm text-pink-50/85">
                              <div>
                                <p className="mb-1 text-xs uppercase tracking-[0.1em] text-pink-100/60">Prénom</p>
                                <EditInput value={editPlayerName} onChange={setEditPlayerName} />
                              </div>
                              {PROFILE_QUESTIONS.map((question, qIndex) => (
                                <div key={question.question}>
                                  <p className="mb-1 text-xs text-pink-100/60">{question.question}</p>
                                  <EditSelect
                                    value={String(editPlayerAnswers[qIndex] ?? 0)}
                                    options={question.options.map((opt, i) => [String(i), opt])}
                                    onChange={(v) =>
                                      setEditPlayerAnswers((prev) => {
                                        const next = [...prev];
                                        next[qIndex] = Number(v);
                                        return next;
                                      })
                                    }
                                  />
                                </div>
                              ))}
                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => void saveEditPlayer()}
                                  className="glossy-button inline-flex min-h-9 items-center rounded-full px-4 text-xs font-black uppercase tracking-[0.1em]"
                                >
                                  Sauver
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditPlayer}
                                  className="inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/10 px-4 text-xs font-bold uppercase tracking-[0.1em] text-pink-50"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {player.profileAnswers && (
                                <ul className="mt-3 space-y-1 text-sm text-pink-50/85">
                                  {PROFILE_QUESTIONS.map((question, index) => (
                                    <li key={question.question}>
                                      <span className="text-pink-100/60">{question.question}</span>{" "}
                                      <span className="font-semibold text-white">
                                        {question.options[player.profileAnswers![index]]}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <button
                                type="button"
                                onClick={() => startEditPlayer(player)}
                                className="mt-3 inline-flex min-h-9 items-center rounded-full border border-white/20 bg-white/10 px-4 text-xs font-bold uppercase tracking-[0.1em] text-pink-50"
                              >
                                Éditer
                              </button>
                            </>
                          )}
                        </details>
                        );
                      })}
                    </div>
                  )}

                  {pendingDuos.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {pendingDuos.map((duo) => (
                        <div key={duo.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/8 p-3">
                          {duo.memberIds.map((memberId, memberIndex) => (
                            <select
                              key={memberIndex}
                              value={memberId}
                              onChange={(event) => updatePendingDuoMember(duo.id, memberIndex, event.target.value)}
                              className="min-h-10 rounded-lg border border-white/20 bg-black/30 px-2 text-sm text-white"
                            >
                              {game.players.map((player) => (
                                <option key={player.id} value={player.id}>
                                  {player.firstName}
                                </option>
                              ))}
                            </select>
                          ))}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={saveDuos}
                        disabled={gameLoading}
                        className="glossy-button mt-2 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-60"
                      >
                        Enregistrer les binômes
                      </button>
                    </div>
                  )}

                  {game.duos.length > 0 && game.state.phase === "live" && (
                    <div className="mt-5 space-y-2">
                      <p className="font-display text-xs uppercase tracking-[0.2em] text-pink-200">classement</p>
                      {[...game.duos]
                        .sort((a, b) => b.score - a.score)
                        .map((duo, index) => (
                          <div key={duo.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/8 px-4 py-2">
                            <span className="font-bold text-white">
                              #{index + 1} {duo.memberNames.join(" & ")}
                            </span>
                            <span className="font-display text-lg font-black text-pink-100">{duo.score}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </>
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

function EditInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-9 w-full min-w-[120px] rounded-lg border border-white/20 bg-black/30 px-2 text-sm text-white outline-none"
    />
  );
}

function EditSelect({
  value,
  options,
  onChange
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-9 rounded-lg border border-white/20 bg-black/30 px-2 text-sm text-white"
    >
      {options.map(([optionValue, label]) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
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
