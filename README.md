# 📝 To-Do Liste (Single Page Application)

## Beschreibung
Dies ist eine Single Page Application (SPA) für eine To-Do Liste, entwickelt mit **React** und **TailwindCSS**.  
Die App ermöglicht es dem Benutzer, Aufgaben zu erstellen, zu bearbeiten, zu löschen und zu durchsuchen.  
Jede Aufgabe enthält folgende Attribute:
- Titel
- Beschreibung
- Autor
- Kategorie
- Wichtigkeit
- Dringlichkeit
- Startdatum
- Enddatum
- Fortschritt (0–100%)

Die **Priorität** einer Aufgabe wird automatisch anhand der Eigenschaften "Wichtigkeit" und "Dringlichkeit" berechnet und angezeigt.

---

## 🚀 Features
- ✅ Aufgaben **hinzufügen, bearbeiten und löschen**
- 🔍 **Suchfunktion** für Aufgaben
- 🛡️ **Formularvalidierung** für Pflichtfelder, Maximalwerte, Datumsprüfung
- 📊 Fortschrittsbalken für Statusanzeige (0–100%)
- ⚙️ Automatische **Prioritätsberechnung**
- 📱 **Responsives Design** für Desktop & Mobile
- 💾 Lokaler State (kein Backend, keine Datenbank)
- 🔄 Moderne React Hooks (`useState`, `useEffect`)

---

## 🛠️ Verwendete Technologien
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- JavaScript (ES6)
- Lokaler Component State (kein Redux, kein Backend)

---

## 📦 Installation & Nutzung

```bash
# Repository klonen
git clone https://github.com/dein-benutzername/todo-spa.git

# Ins Projektverzeichnis wechseln
cd todo-spa

# Abhängigkeiten installieren
npm install

# Lokalen Entwicklungsserver starten
npm run dev
````

---

## 📚 Lernziele & Erkenntnisse

* Umgang mit React (SPA, Hooks)
* State-Management innerhalb einer Anwendung
* Formularvalidierung und Fehlermeldungen
* Dynamische UI-Komponenten
* Einsatz von TailwindCSS für responsives Design
* Debugging und Testing von Frontend-Komponenten

---

## ⚠️ Hinweise

* Keine Backend-Integration (Daten bleiben nur im lokalen State)
* Kein Routing (Einseitenanwendung)
* Getestet auf:

    * Brave Browser

---

## 👤 Autor

| Name         | Schule/Klasse | Projekt        |
|--------------|---------------| -------------- |
| Loïc Matthey | I2b           | ToDo SPA React |

---

## 🔗 Lizenz

Dieses Projekt wurde ausschließlich für schulische Zwecke erstellt.
**Keine kommerzielle Nutzung erlaubt.**

```
