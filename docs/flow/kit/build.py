#!/usr/bin/env python3
"""Build the two flow pages from the sources in this folder.

    python build.py [out_dir]        (default: .., the folder that holds this kit)

Sources: template.html, style.css, engine.js, and the data files, concatenated in this order:
data_scene.js (zones, components, calls), data_things.js (what travels), data_meta.js (page texts,
legend, windows), data_journeys.js (journeys). Each output is one self-contained HTML file: no
external request, nothing sent anywhere.

To make your own pair of pages, change PAGES and FILES below and rewrite the four data files.
engine.js, style.css and template.html need no change.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = ["data_scene.js", "data_things.js", "data_meta.js", "data_journeys.js"]

# The two page ids must match AF.meta.files in data_meta.js. "before" and "after" are also the CSS
# classes that colour the stamp and the switch (style.css: body.before, body.after).
FILES = {"before": "implementation-trap.html", "after": "design-first-flow.html"}
LABEL = {"before": "Without the framework", "after": "With the framework"}

PAGES = {
    "before": {
        "TITLE": "The implementation trap",
        "COMMENT": "One story without the framework: one prompt, four hundred lines, a dozen decisions nobody was asked about. Its twin shows the same scene with the framework.",
        "H1": "Design-First AI",
        "H1SMALL": "without the framework: the implementation trap, step by step",
        "MARKS": "Traps",
        "THINGS": "Artifacts",
        "THINGSTITLE": "Every artifact: prompts, decisions, documents, code. Who makes it, who holds it, where it goes",
        "JSUB": "Follow the dot: it is what travels, and its letters are the artifacts it carries.",
        "STAMPB": "Without the framework",
        "STAMP": "design and implementation collapsed into one step · the judgment stays in heads · the session forgets",
        "SWITCHTITLE": "The two pages show the same scene: one story without the framework, and with it",
    },
    "after": {
        "TITLE": "Design-First AI: the flow",
        "COMMENT": "One story through the Design-First AI framework: knowledge priming, the implementation guide, execution, the execution report, the feedback flywheel. Its twin shows the same scene without the framework.",
        "H1": "Design-First AI",
        "H1SMALL": "with the framework: one story, from the whiteboard to the pull request",
        "MARKS": "Patterns",
        "THINGS": "Artifacts",
        "THINGSTITLE": "Every artifact: the story, the layers, the two documents, the code, the signals. Who makes it, who holds it, where it goes",
        "JSUB": "Follow the dot: it is what travels, and its letters are the artifacts it carries.",
        "STAMPB": "With the framework",
        "STAMP": "five patterns · six context layers · two documents per story · the files are the memory",
        "SWITCHTITLE": "The two pages show the same scene: one story without the framework, and with it",
    },
}


def read(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()


def switch(page):
    other = [p for p in FILES if p != page][0]
    links = {}
    links[page] = '<a class="%s on" aria-current="page">%s</a>' % (page, LABEL[page])
    links[other] = '<a class="%s" id="other-link" href="%s">%s</a>' % (other, FILES[other], LABEL[other])
    return "".join(links[p] for p in FILES)


def build(out_dir):
    template, css, engine = read("template.html"), read("style.css"), read("engine.js")
    data = "\n".join(read(n) for n in DATA)
    for bad in ("</script", "<!--"):
        assert bad not in data.lower() and bad not in engine.lower(), "a source contains " + bad
    os.makedirs(out_dir, exist_ok=True)
    for page, vals in PAGES.items():
        vals = dict(vals, SWITCH=switch(page), PAGE=page, CSS=css, DATA=data, ENGINE=engine)
        assert "--" not in vals["COMMENT"], "an HTML comment can't contain --"
        # one pass: text put in by a placeholder is never scanned again
        html = re.sub(r"\{\{(\w+)\}\}", lambda m: vals[m.group(1)], template)
        path = os.path.join(out_dir, FILES[page])
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        print("wrote %s (%d KB)" % (path, len(html.encode("utf-8")) // 1024))


if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, ".."))
