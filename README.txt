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

0.7.0:
- Einkaufsliste V1 eingebaut
- Artikel manuell hinzufügen
- Menge + Produkt erfassen
- Artikel abhaken
- Einzelne Artikel löschen
- Erledigte Artikel löschen
- Komplette Liste löschen
- Einkaufsliste bleibt im Browser gespeichert
- Rezeptzutaten einzeln zur Einkaufsliste übernehmen
- Kompletten generierten Plan zur Einkaufsliste übernehmen
- Gleiche Zutaten mit gleicher Einheit werden zusammengeführt

0.7.1:
- Einkaufsliste: bessere Zusammenführung gleicher Zutaten
- erkennt Varianten wie Hackfleisch / Rinderhackfleisch / Hackfleisch gemischt oder Rind
- Button „Doppelte zusammenführen“ ergänzt

0.7.2:
- Einkaufsliste wird automatisch in Kategorien gruppiert
- Kategorien: Fleisch & Fisch, Milchprodukte, Gemüse, Obst, Backwaren, Trockenwaren, Konserven, Tiefkühl, Gewürze & Öl, Sonstiges
- Grundlage für späteren Angebotsfinder geschaffen

0.7.3:
- Ausschluss-Auswahl vereinfacht
- Fisch fasst jetzt Thunfisch, Lachs, Kabeljau und Fischstäbchen zusammen
- Geflügel fasst Hähnchen und Pute zusammen
- Vegetarisch entfernt Fleisch und Fisch
- Vegan entfernt Fleisch, Fisch, Milchprodukte und Ei
- Text in Schritt 8 klarer formuliert

0.7.4:
- Vegan-Filter korrigiert
- Ausschlüsse werden beim Planen nicht mehr ignoriert, auch wenn zu wenige Gerichte übrig sind
- Filter prüft zusätzlich Zutaten, Rezeptname und containsFish/containsEggs/containsMilk

0.7.5:
- Vegan-Filter deutlich verschärft
- Hüttenkäse, Quark, Skyr, Käse, Milch, Joghurt, Sahne, Butter und Eier werden bei Vegan ausgeschlossen
- Fleisch, Fisch, Geflügel und Meeresfrüchte werden bei Vegan ebenfalls sicher ausgeschlossen
- Filter prüft jetzt Name, Zutaten, Tags, excludeTags, mainProtein und Boolean-Felder
- Ausschlüsse werden weiterhin nicht ignoriert, auch wenn dadurch weniger Gerichte übrig bleiben

0.7.6:
- Ernährungsart "Vegan" filtert jetzt eigenständig streng, auch wenn unter Ausschlüsse nichts angeklickt wurde
- Vegan blockiert Fisch, Thunfisch, Lachs, Steak, Fleisch, Geflügel, Milchprodukte, Hüttenkäse, Käse, Eier usw.
- Fallback-Logik geändert: Nur Kochzeit darf gelockert werden, Vegan/Vegetarisch/Ausschlüsse niemals

0.7.7:
- Vegetarisch filtert jetzt direkt über die Ernährungsart streng.
- Nutzer müssen keine zusätzlichen Ausschlüsse setzen.
- Steak, Thunfisch, Hähnchen, Pute, Schinken, Wurst, Gyros, Döner, Frikadellen usw. werden bei Vegetarisch ausgeschlossen.
- Cache-Version v077.

0.7.8:
- 48 neue vegane und vegetarische Gerichte ergänzt
- jede Hauptkategorie erhält zusätzliche vegane/vegetarische Optionen
- Vegan-/Vegetarisch-Filter robuster gemacht
- Ei-Filter löst nicht mehr fälschlich bei Reis, Einfach oder Proteinreich aus

0.8.0:
- 100 kuratierte neue Rezeptnamen mit sauberen Zutaten, Mengen, Schritten, Kosten, Proteinwerten und Tags ergänzt.
- Die 100 neuen Gerichte sind in allen Planungszielen verfügbar, damit Vegan/Vegetarisch/Normal/Proteinreich/Schnell unabhängig vom Ziel genügend Auswahl liefern.
- Vegan/Vegetarisch-Sicherheitsprüfung verbessert: Rezeptnamen wie „vegane Bolognese“ oder „veganes Gulasch“ lösen keinen falschen Fleisch-Filter mehr aus.
- Ausschluss „Ei“ prüft jetzt wortbasiert und trifft nicht mehr versehentlich Wörter wie „Proteinreich“.
