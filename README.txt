Korbo Beta 0.4.2 - FIXED

Supabase ist fertig eingetragen.

Geändert:
- config.js enthält jetzt den anon/public/publishable Key.
- index.html Titel wurde von Korbo Beta 0.3 auf Korbo Beta 0.4.2 geändert.
- service-worker.js Cache wurde auf korbo-beta-v042 erhöht, damit alte Dateien nicht hängen bleiben.

Upload:
1. Alle Dateien aus dieser ZIP in GitHub hochladen und vorhandene Dateien ersetzen.
2. Commit changes klicken.
3. In Vercel Deployment abwarten.
4. Korbo im Browser öffnen.
5. Einmal hart neu laden: STRG + F5.
6. Plan erstellen und 👍 / 👎 testen.
7. Supabase -> Table Editor -> recipe_votes prüfen.

Wichtig:
Nur anon/public/publishable Key verwenden. Niemals service_role secret key veröffentlichen.
