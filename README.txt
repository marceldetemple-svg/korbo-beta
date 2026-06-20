Korbo Beta 0.4

Neu:
- Bewertungsfunktion pro Gericht
- 👍 Lecker / 👎 Nicht meins
- Grundauswahl bei negativer Bewertung
- echte Supabase-Datenbank-Anbindung
- config.js für Supabase URL und anon key
- supabase_setup.sql für die Datenbanktabelle

Ablauf:
1. Supabase-Projekt erstellen.
2. supabase_setup.sql im SQL Editor ausführen.
3. In config.js SUPABASE_URL und SUPABASE_ANON_KEY ersetzen.
4. Alle Dateien zu GitHub hochladen.
5. Commit changes klicken.
6. Vercel deployed automatisch.

Ohne config.js-Werte läuft Korbo weiter, aber Bewertungen werden nicht gespeichert.
