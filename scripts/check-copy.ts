/**
 * Proofs every piece of copy in src/ against the portal's Hebrew house rules and fails (exit 1)
 * on any of these:
 *
 *   cart        The retail cart: סל, עגלה (עגלת, עגלות), alone or after ה ל ב ו מ. This is a
 *               wholesale portal, so it says הזמנה (מעבר להזמנה, הוספה להזמנה).
 *   imperative  הוסף, שלח: a control names its action with a noun (הוספה, שליחה), never with a
 *               masculine imperative.
 *   quote       An ASCII " or ' touching a Hebrew letter. ק״ג takes gershayim (U+05F4), צ׳ takes a
 *               geresh (U+05F3), and a UI label quoted in a sentence sits in gershayim: ״עודכן״.
 *   maqaf       An ASCII hyphen after a Hebrew letter. A prefix on a figure takes the maqaf (כ־20,
 *               ב־14:00), and so does a compound (ימין־לשמאל). A range takes an en dash (0–2°).
 *   dash        A spaced ASCII hyphen in Hebrew copy. The sentence dash is an en dash, with a
 *               no-break space before it: מסחר – המחירים.
 *   minus       An ASCII hyphen leading a figure in Hebrew copy. A minus is U+2212: −0.8%.
 *   unit        A figure and its Hebrew unit split by an ordinary space (30 דקות). They take a
 *               no-break space, or a whitespace-nowrap span in JSX.
 *   norway      נורווגיה. The brief writes נורבגיה, and סלמון נורבגי.
 *   tile        סטייל־טייל or טייל, which reads as "hiker". The page is a לוח סגנון.
 *   floor       Hebrew set in text-micro, type-micro or label-latin. Those are Latin-only, and
 *               Hebrew starts at text-caption (14px).
 *
 * Only copy is read: string and template literals and JSX text, found by the TypeScript
 * parser, so comments and code never trip a rule. JSX text is read the way React renders it
 * (lines trimmed and joined by one space, HTML entities decoded). The rules see one literal
 * at a time; a figure and a unit joined in JSX (<Num>312</Num> {KG}) are the caller's job,
 * with a whitespace-nowrap span.
 *
 *   npm run check:copy
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/**
 * Deliberate counter-examples. The clichés have to name what they refuse, so two mechanisms
 * let them through, and nothing else does:
 *
 *   1. A `copy-ok` comment on the same line clears that line: `// copy-ok: why`, or
 *      `{/* copy-ok: why *\/}` in JSX. Use it for a line that exists to show a wrong form,
 *      such as a wrong → right pair.
 *   2. ALLOW clears one exact phrase in one file. Use it for a sentence that names a banned
 *      word inside longer copy, so the rest of that copy is still proofed.
 *
 * An ALLOW entry that no longer matches, or a copy-ok marker on a clean line, is reported as
 * stale, so the list can only shrink.
 */
const ALLOW: readonly { file: string; text: string; why: string }[] = [
  { file: "src/app/style-tile/_content.ts", text: "הזמנה, אף פעם לא סל", why: "decision 02 names the word it bans" },
  { file: "src/app/style-tile/_content.ts", text: "הזמנה, לא סל", why: "cliché 03 names the word it bans" },
];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src");

/* A Hebrew letter, and a Hebrew word character: letters, points, geresh and gershayim. The maqaf
   (U+05BE) is left out on purpose: it joins words, so it ends one. */
const HE = "א-ת";
const W = `\u0591-\u05BD\u05BF-\u05C7${HE}\u05F0-\u05F4`;
const word = (body: string) => new RegExp(`(?<![${W}])(?:${body})(?![${W}])`, "gu");
const hasHebrew = (s: string) => new RegExp(`[${HE}]`, "u").test(s);

const UNITS = [
  "ק״ג",
  "גרם",
  "טון",
  "פיקסל",
  "פיקסלים",
  "שנייה",
  "שניות",
  "אלפיות",
  "דקה",
  "דקות",
  "שעה",
  "שעות",
  "ימים",
  "מעלות",
  "ס״מ",
  "מ״מ",
  "ליטר",
  "יחידות",
  "יח׳",
  "ש״ח",
].join("|");

/** Every rule runs on Hebrew copy only (a string with at least one Hebrew letter). */
type Rule = { id: string; re: RegExp; fix: string };

const RULES: readonly Rule[] = [
  { id: "cart", re: word("[הלבומ]{0,2}(?:סל|עגלה|עגלת|עגלות)"), fix: "wholesale wording: הזמנה (מעבר להזמנה, הוספה להזמנה), never סל or עגלה" },
  { id: "imperative", re: word("הוסף|שלח"), fix: "an action noun (הוספה, שליחה), never a masculine imperative" },
  { id: "quote", re: new RegExp(`(?<=[${HE}])["']|["'](?=[${HE}])`, "gu"), fix: "gershayim ״ (ק״ג), a geresh ׳ (צ׳), and ״…״ around a quoted label" },
  { id: "maqaf", re: new RegExp(`(?<=[${HE}])-(?=\\S)`, "gu"), fix: "a maqaf ־ after a prefix or in a compound (כ־20), an en dash – in a range" },
  { id: "dash", re: /(?<=\S)[ \u00a0]-[ \u00a0](?=\S)/gu, fix: "an en dash –, with a no-break space before it" },
  { id: "minus", re: /(?<![\p{L}\p{N}\p{Pd}.,:/])-(?=\d)/gu, fix: "a true minus − (U+2212) inside the figure's LTR isolate" },
  { id: "unit", re: new RegExp(`(?<=\\d) (?=ה?(?:${UNITS})(?![${W}]))`, "gu"), fix: "a no-break space between a figure and its unit (or a whitespace-nowrap span)" },
  { id: "norway", re: /נורווג/gu, fix: "נורבגיה, and סלמון נורבגי (the brief's spelling)" },
  { id: "tile", re: word("[הלבומש]?(?:סטייל[־-]?טייל|טייל)"), fix: "לוח סגנון (טייל reads as 'hiker')" },
];
const FLOOR_FIX = "Hebrew starts at text-caption (14px); text-micro and label-latin are for Latin labels";

/* ───────────────────────────── Reading copy ───────────────────────────── */

/** A piece of copy as rendered, with the source line of every character. */
type Copy = { text: string; lines: number[]; jsx: boolean; node: ts.Node };

const ENTITIES: Record<string, string> = { nbsp: "\u00a0", quot: '"', apos: "'", amp: "&", lt: "<", gt: ">", shy: "\u00ad" };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/** JSX whitespace: every line is trimmed, blank lines go, and the rest are joined by one space. */
function jsxText(raw: string, firstLine: number): { text: string; lines: number[] } {
  const rows = raw.split("\n");
  let text = "";
  const lines: number[] = [];
  let last = firstLine;
  rows.forEach((row, i) => {
    let s = row;
    if (i > 0) s = s.replace(/^[ \t\r]+/, "");
    if (i < rows.length - 1) s = s.replace(/[ \t\r]+$/, "");
    if (!s) return;
    s = decode(s);
    if (text) {
      text += " "; // the joining space belongs to the line it ends
      lines.push(last);
    }
    text += s;
    last = firstLine + i;
    for (let k = 0; k < s.length; k++) lines.push(last);
  });
  return { text, lines };
}

function copyIn(sf: ts.SourceFile): Copy[] {
  const out: Copy[] = [];
  const lineOf = (pos: number) => sf.getLineAndCharacterOfPosition(pos).line;
  const visit = (n: ts.Node) => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (ts.isJsxText(n)) {
      if (!n.containsOnlyTriviaWhiteSpaces) out.push({ ...jsxText(n.text, lineOf(n.getStart(sf))), jsx: true, node: n });
    } else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) {
      // JSX attribute values are HTML-like: entities are decoded, escapes are not processed.
      const text = ts.isJsxAttribute(n.parent) ? decode(n.text) : n.text;
      let line = lineOf(n.getStart(sf));
      const lines: number[] = [];
      for (const ch of text.split("")) {
        lines.push(line);
        if (ch === "\n") line++;
      }
      out.push({ text, lines, jsx: false, node: n });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

/* ───────────────────────────── The Hebrew floor ───────────────────────────── */

/* A base (unprefixed) size utility, with or without a line-height modifier (text-caption/5). */
const SIZE = /^(?:text|type)-(micro|caption|body|data|dish|title|section|headline|display)(?:\/\S+)?$/;

/**
 * The base text size a className sets: "latin" when it can only be a Latin-only size, "ok" when
 * it sets any other size (a conditional class naming both counts as "ok"), null when it sets none.
 */
function sizeIn(classes: string): "latin" | "ok" | null {
  let latin = false;
  for (const c of classes.split(/\s+/)) {
    const m = SIZE.exec(c);
    if (c === "label-latin" || m?.[1] === "micro") latin = true;
    else if (m || /^text-\[\d/.test(c)) return "ok"; // an arbitrary size is not ours to judge
  }
  return latin ? "latin" : null;
}

/** The static text of a className attribute: its string, or the literal parts of its expression. */
function classNameOf(el: ts.JsxOpeningLikeElement): string {
  for (const a of el.attributes.properties) {
    if (!ts.isJsxAttribute(a) || a.name.getText() !== "className" || !a.initializer) continue;
    if (ts.isStringLiteral(a.initializer)) return a.initializer.text;
    const parts: string[] = [];
    const collect = (n: ts.Node) => {
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) parts.push(n.text);
      ts.forEachChild(n, collect);
    };
    collect(a.initializer);
    return parts.join(" ");
  }
  return "";
}

/** The size a JSX text inherits from its nearest sized ancestor element, up to the component's edge. */
function inheritedSize(text: ts.JsxText): "latin" | "ok" | null {
  for (let n: ts.Node | undefined = text.parent; n; n = n.parent) {
    if (ts.isJsxAttribute(n)) return null; // passed as a prop: the component sets it
    if (ts.isJsxElement(n)) {
      const s = sizeIn(classNameOf(n.openingElement));
      if (s) return s;
    }
    // a callback (items.map(i => <li>…</li>)) renders into its caller; any other function is a component's edge
    if (ts.isFunctionLike(n) && !(n.parent && ts.isCallExpression(n.parent))) return null;
  }
  return null;
}

/* ───────────────────────────── Proofing ───────────────────────────── */

type Hit = { file: string; line: number; rule: string; snippet: string; fix: string };

const files = readdirSync(SRC, { encoding: "utf8", recursive: true })
  .filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".d.ts"))
  .map((f) => join(SRC, f))
  .sort();

const hits: Hit[] = [];
const allowedBy = new Map<string, number>(); // "allow:file:text" or "marker:file:line" → hits it cleared
const allowKey = (a: { file: string; text: string }) => `allow:${a.file}:${a.text}`;
const markerKey = (file: string, line: number) => `marker:${file}:${line}`;
const markers: { file: string; line: number }[] = [];
let pieces = 0;

const snippet = (text: string, at: number, len: number) => {
  const from = Math.max(0, text.lastIndexOf(" ", Math.max(0, at - 14)) + 1);
  const to = text.indexOf(" ", Math.min(text.length, at + len + 14));
  return text.slice(from, to < 0 ? text.length : to).replace(/\s+/g, " ").trim();
};

for (const path of files) {
  const file = relative(root, path);
  const source = readFileSync(path, "utf8");
  const rows = source.split("\n");
  const sf = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  rows.forEach((r, i) => {
    if (/(?:\/\/|\/\*)\s*copy-ok\b/.test(r)) markers.push({ file, line: i });
  });
  const allow = ALLOW.filter((a) => a.file === file);

  const report = (c: Copy, at: number, len: number, rule: string, fix: string) => {
    const line = c.lines[at] ?? c.lines[c.lines.length - 1] ?? 0;
    const cleared = (key: string) => {
      allowedBy.set(key, (allowedBy.get(key) ?? 0) + 1);
      return true;
    };
    if (/(?:\/\/|\/\*)\s*copy-ok\b/.test(rows[line] ?? "") && cleared(markerKey(file, line))) return;
    for (const a of allow) {
      for (let s = c.text.indexOf(a.text); s >= 0; s = c.text.indexOf(a.text, s + 1)) {
        if (s <= at && at + len <= s + a.text.length && cleared(allowKey(a))) return;
      }
    }
    hits.push({ file, line: line + 1, rule, snippet: snippet(c.text, at, len), fix });
  };

  for (const c of copyIn(sf)) {
    if (!hasHebrew(c.text)) continue;
    pieces++;
    for (const r of RULES) {
      for (const m of c.text.matchAll(r.re)) report(c, m.index, Math.max(1, m[0].length), r.id, r.fix);
    }
    if (c.jsx && ts.isJsxText(c.node) && inheritedSize(c.node) === "latin") {
      const at = c.text.search(new RegExp(`[${HE}]`, "u"));
      report(c, at, 1, "floor", FLOOR_FIX);
    }
  }
}

/* ───────────────────────────── Report ───────────────────────────── */

const stale: string[] = [];
for (const a of ALLOW) if (!allowedBy.has(allowKey(a))) stale.push(`ALLOW «${a.text}» in ${a.file} (${a.why}) matches nothing`);
for (const m of markers) if (!allowedBy.has(markerKey(m.file, m.line))) stale.push(`copy-ok on ${m.file}:${m.line + 1} clears nothing`);

for (const h of hits) console.log(`FAIL  ${h.file}:${h.line}  ${h.rule.padEnd(10)} «${h.snippet}»  → ${h.fix}`);
for (const s of stale) console.log(`stale ${s}`);

const cleared = [...allowedBy.values()].reduce((a, b) => a + b, 0);
if (hits.length) {
  const where = new Set(hits.map((h) => h.file)).size;
  console.error(
    `\n${hits.length} problem(s) in ${where} file(s). Fix the copy, or mark a deliberate counter-example (see the top of scripts/check-copy.ts).`,
  );
  process.exit(1);
}
console.log(`\ncopy ok: ${pieces} Hebrew strings in ${files.length} files; ${cleared} deliberate counter-example(s) allowed`);
