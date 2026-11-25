# 059 answer hubs SpeakableSpecification

ADR: seo , kit-structured-data ssot-repo-structure

## goal
Add SpeakableSpecification (+ voice nodes) to answer hubs: /contact/ /sheelot/ /media/ /tags/ /editorial-policy/ /guy-avni/ /blog/ (F11).

## todos
- [ ] Add hub voice blocks in speakable-voice-blocks.ts
- [ ] Wire attachSpeakable + visible .speakable-voice on each hub
- [ ] verify build+dev

## DoD
each listed hub emits speakable when FAQ/answer intent present.
