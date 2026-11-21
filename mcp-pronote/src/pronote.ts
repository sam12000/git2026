// Lecture des données PRONOTE et mise en forme simple pour Claude.
import * as P from "pawnote";

const TZ = process.env.PRONOTE_TZ || "Europe/Paris";

export const stripHtml = (s: unknown) => String(s ?? "")
  .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li)>/gi, "\n").replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();

const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const fmtDay = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const when = (d: Date) => fmt.format(new Date(d));
export const day = (d: Date) => fmtDay.format(new Date(d));

/** « 2026-11-24 » → minuit local ; vide → aujourd'hui + décalage en jours. */
export function parseDay(value: string | undefined, offsetDays = 0): Date {
  if (value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!m) throw new Error(`Date invalide « ${value} » : utilise le format AAAA-MM-JJ.`);
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offsetDays);
  return d;
}
export function range(debut?: string, fin?: string, defaultDays = 14): [Date, Date] {
  const from = parseDay(debut);
  const to = fin ? parseDay(fin) : new Date(from.getTime());
  if (!fin) to.setDate(to.getDate() + defaultDays);
  to.setHours(23, 59, 59, 999);
  if (to < from) throw new Error("La date de fin est avant la date de début.");
  if ((to.getTime() - from.getTime()) / 86400000 > 120) throw new Error("Période trop longue : 120 jours maximum.");
  return [from, to];
}

export function profile(s: P.SessionHandle) {
  const r = s.userResource;
  return { nom: r?.name ?? s.user?.name, classe: r?.className ?? null, etablissement: r?.establishmentName ?? null };
}

export async function homework(s: P.SessionHandle, from: Date, to: Date) {
  const list = await P.assignmentsFromIntervals(s, from, to);
  return list
    .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline))
    .map((a) => ({
      id: a.id,
      matiere: a.subject?.name,
      pour_le: when(a.deadline),
      date_limite: new Date(a.deadline).toISOString(),
      consigne: stripHtml(a.description),
      fait: !!a.done,
      duree_estimee_min: a.length ?? null,
      pieces_jointes: (a.attachments || []).map((f) => f.name).filter(Boolean),
    }));
}

export async function timetable(s: P.SessionHandle, from: Date, to: Date) {
  const tt = await P.timetableFromIntervals(s, from, to);
  P.parseTimetable(s, tt, { withSuperposedCanceledClasses: false, withCanceledClasses: true, withPlannedClasses: true });
  return tt.classes
    .filter((c): c is P.TimetableClassLesson => c.is === "lesson")
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
    .map((c) => ({
      matiere: c.subject ? c.subject.name : (c.groupNames && c.groupNames[0]) || "Cours",
      debut: when(c.startDate),
      fin: when(c.endDate),
      debut_iso: new Date(c.startDate).toISOString(),
      fin_iso: new Date(c.endDate).toISOString(),
      salle: (c.classrooms || []).join(", ") || null,
      professeur: (c.teacherNames || []).join(", ") || null,
      annule: !!c.canceled,
      statut: c.status || null,
      controle: !!c.test,
    }));
}

const TEST_WORDS = /\b(contr[ôo]le|[ée]valuation|interro(gation)?|ds|devoir surveill[ée]|examen|test|bac blanc|brevet blanc|partiel|oral)\b/i;

export async function upcomingTests(s: P.SessionHandle, from: Date, to: Date) {
  const [lessons, hw] = await Promise.all([timetable(s, from, to), homework(s, from, to)]);
  return {
    cours_marques_controle: lessons.filter((l) => l.controle && !l.annule),
    devoirs_qui_parlent_d_un_controle: hw.filter((h) => TEST_WORDS.test(h.consigne)),
    remarque: "PRONOTE ne publie pas toujours les contrôles : ceux-ci viennent des cours marqués « devoir surveillé » et des consignes de devoirs qui citent un contrôle.",
  };
}

function tab(s: P.SessionHandle, loc: P.TabLocation) {
  const t = s.userResource?.tabs?.get(loc);
  if (!t) throw new Error("Cette rubrique n'est pas accessible avec ce compte PRONOTE.");
  return t;
}
function pickPeriod(t: P.Tab, name?: string): P.Period {
  if (name) {
    const p = t.periods.find((x) => x.name.toLowerCase().includes(name.toLowerCase()));
    if (!p) throw new Error(`Période « ${name} » introuvable. Périodes : ${t.periods.map((x) => x.name).join(", ")}.`);
    return p;
  }
  const now = Date.now();
  return t.periods.find((p) => +new Date(p.startDate) <= now && now <= +new Date(p.endDate)) || t.defaultPeriod || t.periods[t.periods.length - 1];
}

export function periods(s: P.SessionHandle) {
  const t = s.userResource?.tabs?.get(P.TabLocation.Grades);
  return (t?.periods || []).map((p) => ({ nom: p.name, du: day(p.startDate), au: day(p.endDate) }));
}

const val = (v?: P.GradeValue) => {
  if (!v) return null;
  switch (v.kind) {
    case P.GradeKind.Grade: return Math.round(v.points * 100) / 100;
    case P.GradeKind.Absent: return "absent";
    case P.GradeKind.Exempted: return "dispensé";
    case P.GradeKind.NotGraded: return "non noté";
    case P.GradeKind.Unfit: return "inapte";
    default: return null;
  }
};

export async function grades(s: P.SessionHandle, periodName?: string) {
  const period = pickPeriod(tab(s, P.TabLocation.Grades), periodName);
  const g = await P.gradesOverview(s, period);
  return {
    periode: period.name,
    moyenne_generale: val(g.overallAverage),
    moyenne_classe: val(g.classAverage),
    moyennes: g.subjectsAverages.map((x) => ({ matiere: x.subject.name, eleve: val(x.student), classe: val(x.class_average), min: val(x.min), max: val(x.max) })),
    notes: [...g.grades]
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .map((n) => ({ matiere: n.subject.name, date: day(n.date), note: val(n.value), sur: val(n.outOf), coefficient: n.coefficient, moyenne_classe: val(n.average), intitule: n.comment || null })),
  };
}

export async function schoolLife(s: P.SessionHandle, periodName?: string) {
  const period = pickPeriod(tab(s, P.TabLocation.Notebook), periodName);
  const n = await P.notebook(s, period);
  return {
    periode: period.name,
    absences: n.absences.map((a) => ({ du: when(a.startDate), au: when(a.endDate), justifiee: a.justified, motif: a.reason || null, heures: a.hoursMissed })),
    retards: n.delays.map((d) => ({ date: when(d.date), minutes: d.minutes, justifie: d.justified, motif: d.reason || null })),
    punitions: n.punishments.map((p) => ({ titre: p.title, date: day(p.dateGiven), motifs: p.reasons, travail: stripHtml(p.workToDo) || null })),
    observations: n.observations.map((o) => ({ titre: o.name, date: day(o.date), matiere: o.subject?.name || null, motif: o.reason || null })),
  };
}

export async function newsItems(s: P.SessionHandle, limit = 20) {
  const n = await P.news(s);
  return n.items
    .sort((a, b) => +new Date(b.creationDate) - +new Date(a.creationDate))
    .slice(0, limit)
    .map((i) => ({
      type: i.is === "survey" ? "sondage" : "information",
      titre: i.title || "(sans titre)",
      auteur: i.author,
      date: day(i.creationDate),
      lu: i.read,
      contenu: i.is === "information" ? stripHtml(i.content).slice(0, 2000) : null,
    }));
}
