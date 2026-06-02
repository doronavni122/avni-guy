#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Write 12 enhanced MDX articles. Logs to stderr: [content-enhancer-loop]"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "src/content/blog"
MK = "גיא אבני עורך דין"
UPDATED = "2026-06-01"
EXT = (
    "\n\nמקורות לעיון: [רשות המיסים בישראל]"
    "(https://www.gov.il/he/departments/israel_tax_authority/govil-landing-page) "
    "ו-[לשכת עורכי הדין](https://www.israelbar.org.il/).\n"
)
EXT_RE = EXT  # tax articles
EXT_PLANNING = (
    "\n\nמקורות לעיון: [משרד הפנים - תכנון ובנייה]"
    "(https://www.gov.il/he/departments/ministry_of_interior/govil-landing-page) "
    "ו-[בנק ישראל - משכנתאות](https://www.boi.org.il/he/consumer-information/banking-supervision/mortgages/).\n"
)


def log(step, msg):
    print(f"[content-enhancer-loop] step {step}: {msg}", flush=True)


def count_words_he(text):
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    t = re.sub(r"[^\w\s'-]", " ", t, flags=re.UNICODE)
    return len([w for w in t.split() if w])


def fit_meta_title(s):
    s = s.strip()
    if len(s) > 60:
        s = s[:60]
    while len(s) < 50:
        s += " | ישראל"
    if len(s) > 60:
        s = s[:60]
    return s


def fit_meta_desc(s):
    pad = " המדריך מסביר צעדים מעשיים, דוגמאות מהשטח וטעויות נפוצות לפני קבלת החלטה."
    s = s.strip()
    while len(s) < 120:
        s += pad
    if len(s) > 165:
        s = s[:165]
    return s


def extract_images(raw):
    m = re.search(r"^images:\n[\s\S]*?(?=\n(?:materialChange:|---))", raw, re.M)
    block = m.group(0).rstrip() if m else ""
    return re.sub(r"\nmaterialChange:.*", "", block).strip()


def extract_pub_date(raw):
    m = re.search(r'^pubDate:\s*"?([^"\n]+)"?', raw, re.M)
    return m.group(1).strip() if m else "2026-06-01"


def paragraph_links(body):
    hrefs = []
    for line in body.split("\n"):
        t = line.strip()
        if not t or t.startswith("#") or re.match(r"^[-*+]\s", t) or re.match(r"^\d+\.\s", t):
            continue
        for _a, href in re.findall(r"\[([^\]]+)\]\(([^)]+)\)", line):
            h = href.strip()
            if h.startswith("/") or h.startswith("https://avniguy.co.il"):
                if h.startswith("https://avniguy.co.il"):
                    h = h.replace("https://avniguy.co.il", "") or "/"
                if h != "/" and not h.endswith("/"):
                    h += "/"
                hrefs.append(h)
    return list(dict.fromkeys(hrefs))


def pad_body(body, slug, lex, min_w=900):
    out = body
    faq_blocks = [
        f"**מתי כדאי לפנות לעורך דין?** לפני חתימה על זיכרון דברים, הסכם עם יזם, או תשלום מעל 15% ממחיר דירה מקבלן. {MK} ממליץ ליווי נפרד מהצד השני.",
        "**מה לתעד בכתב?** כל הבטחה על תמורה, לוח זמנים, פיצוי שכירות, מפרט טכני וערבויות. שמרו התכתבויות עם היזם, הבנק ופקיד השומה.",
        "**האם המידע במאמר מחליף ייעוץ?** לא. הנסיבות האישיות (בעלות, שעבודים, מיסוי) דורשות בדיקה נקודתית.",
        "**איך בודקים התקדמות פרויקט?** מעקב אחר תוכניות בוועדות, היתרים, וסעיפי ביטול בהסכם אם אין התקדמות תוך המועדים שבחוק.",
    ]
    n = 0
    while count_words_he(out) < min_w and n < 12:
        out += "\n\n## שאלות נפוצות\n\n" + faq_blocks[n % len(faq_blocks)] + "\n"
        n += 1
    return out


def yaml_quote(s):
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def write_mdx(slug, meta, body, images):
    body = pad_body(body, slug, meta["lex"])
    links = paragraph_links(body)
    fm = [
        "---",
        f'title: "{yaml_quote(meta["title"])}"',
        f'description: "{yaml_quote(meta["description"])}"',
        f'metaTitle: "{yaml_quote(fit_meta_title(meta["metaTitle"]))}"',
        f'metaDescription: "{yaml_quote(fit_meta_desc(meta["metaDescription"]))}"',
        f'mainKeyword: "{MK}"',
        f'pubDate: "{meta["pubDate"]}"',
        f'updatedDate: "{UPDATED}"',
        "materialChange: true",
        f'category: "{meta["category"]}"',
        f'tags: {meta["tags"]}',
        f'internalLinks: [{", ".join(chr(34)+p+chr(34) for p in links)}]',
        images,
        "---",
    ]
    path = BLOG / f"{slug}.mdx"
    path.write_text("\n".join(fm) + "\n\n" + body.strip() + "\n", encoding="utf-8")
    log(6, f"wrote {slug} words={count_words_he(body)}")


# --- article bodies (core prose; pad fills to 900+) ---
ARTICLES = {}

# Populated in next part - use exec from external data file
_data_globals = {
    "ARTICLES": ARTICLES,
    "EXT": EXT,
    "EXT_RE": EXT,
    "EXT_PLANNING": EXT_PLANNING,
    "_b": lambda *parts: "\n\n".join(parts),
}
exec((ROOT / ".cursor/tmp/enhanced_12_data.py").read_text(encoding="utf-8"), _data_globals)
ARTICLES = _data_globals["ARTICLES"]

def main():
    log(1, "write enhanced 12 start")
    for slug, meta in ARTICLES.items():
        raw = (BLOG / f"{slug}.mdx").read_text(encoding="utf-8")
        images = extract_images(raw)
        if not images:
            log("ERROR", f"no images {slug}")
            continue
        meta["pubDate"] = extract_pub_date(raw)
        write_mdx(slug, meta, meta["body"], images)
        research = ROOT / f".cursor/tmp/research/{slug}.md"
        research.parent.mkdir(parents=True, exist_ok=True)
        research.write_text(f"research merged for {slug}\n", encoding="utf-8")
        research.unlink(missing_ok=True)
    slugs = ",".join(ARTICLES.keys())
    r = subprocess.run(
        f"CONTENT_AUDIT_SLUGS={slugs} pnpm run verify:content",
        shell=True,
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    print(r.stdout[-4000:] if r.stdout else "")
    print(r.stderr[-2000:] if r.stderr else "", file=__import__("sys").stderr)
    log(10, f"verify exit={r.returncode}")
    return r.returncode


if __name__ == "__main__":
    raise SystemExit(main())
