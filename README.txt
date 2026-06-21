Korbo Beta 0.5.0

Neu:
- 50 Gerichte je Kategorie
- Rezeptdetails mit Zutaten und Zubereitung
- Ausschlussliste: z. B. keine Pilze, kein Fisch, kein Schwein
- Budgetlogik nutzt das Budget besser aus
- Supabase-Verbindung robuster
- Cache-Version v050

Wichtig:
Alle Dateien in GitHub ersetzen und committen.
Danach Vercel Deployment abwarten.
Dann auf Handy und PC einmal komplett neu laden.

0.5.1:
- Genauere Mengenangaben in Rezeptdetails
- Mengen skalieren je nach Personenanzahl

0.5.2:
- Portionen für 2 Personen vergrößert
- Mengenangaben sauberer formuliert
- Preiswerte realistischer geschätzt
- Preise in der App als geschätzte Werte gekennzeichnet

0.5.3:
- Fehler behoben, der Rezeptdetails in einigen Kategorien blockieren konnte
- Rezept anzeigen und Bewertung laufen jetzt stabil über interne Rezept-IDs statt über langen JSON-Code im Button

0.5.4:
- fehlende offensichtliche Zutaten ergänzt
- Öl zeigt nicht mehr 0 EL
- Rezeptschritte werden passend nach Zutaten erstellt
- generische Tofu/Fleisch/Ei-Sätze entfernt

0.6.0:
- Premium Datenbank V1 eingebaut
- 240 Rezepte: Sparen, Abnehmen, Muskelaufbau, Familie je 60
- App an neue Zutatenstruktur angepasst

0.6.1 Clean Database:
- Platzhalter aus Muskelaufbau und Familie entfernt
- Gewürze von nach Geschmack auf konkrete Mengen umgestellt
- data.js QA: keine Begriffe passsend zum Gericht / nach Geschmack
