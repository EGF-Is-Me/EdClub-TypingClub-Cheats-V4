# 🦆 EdClub TypingClub Cheat Suite
**By EGF**

A fully automated, hands-free cheat suite for TypingClub / EdClub.
Run once — it handles everything forever.

---

## ✅ Features

- 🤖 **Auto-types** all lessons at your chosen WPM
- 🎓 **Tutorials** — auto-detects "press C with your left pinky" and does it
- 🎮 **Games** — auto-plays typing games
- 📹 **Videos** — skips to the end instantly
- ⌨️ **Hold-key exercises** — holds the key for the right duration
- ⏭️ **Auto-advances** to the next lesson forever
- 🔁 **Persistent** — install once as a bookmarklet, never paste again
- 👤 **Human-like** — random WPM variation + keystroke jitter

---

## 🚀 Installation (Bookmarklet — run with one click forever)

### Step 1 — Create the bookmarklet

1. Right-click your browser bookmarks bar → **Add page** / **Add bookmark**
2. Set the **Name** to: `🦆 TC Cheat`
3. Set the **URL** to the entire contents of `bookmarklet.js` (copy it exactly)
4. Click **Save**

### Step 2 — Use it

1. Go to [typingclub.com](https://typingclub.com) and open any lesson
2. Switch your browser console context to the **`coreclassictyping.edclub.app`** iframe:
   - Open DevTools (`F12`)
   - Click the **`top`** dropdown at the top of the Console tab
   - Select **`coreclassictyping.edclub.app`**
3. Click your **🦆 TC Cheat** bookmark
4. Enter your WPM when prompted
5. Leave the tab open — it runs forever through every lesson

### Alternative — Chrome Console (one-time)

1. Open any TypingClub lesson
2. Press `F12` → Console tab
3. Switch context to `coreclassictyping.edclub.app` in the dropdown
4. Paste the contents of `cheat.js` and press Enter

---

## 📁 Files

| File | Purpose |
|---|---|
| `cheat.js` | Main script — paste into console |
| `bookmarklet.js` | One-click bookmarklet version |
| `README.md` | This file |

---

## ⚙️ Configuration

At the top of `cheat.js`, edit the `CONFIG` block:

```js
const CONFIG = {
  wpm: 80,          // Your typing speed
  variation: 8,     // ±WPM random variation (looks human)
  autoAdvance: true, // Auto-go to next lesson
  advanceDelay: 2200, // Ms to wait before advancing
  debug: false      // Set true to see logs in console
};
```

---

## 🛠️ Troubleshooting

**It's not typing anything**
→ Make sure you switched console context to `coreclassictyping.edclub.app`

**Tutorial steps aren't working**
→ Enable `debug: true` and check what text it's detecting

**Auto-advance not working**
→ Some lessons need a manual first click — after that it runs itself

---

## 📄 License

MIT — do whatever you want with it.

*By EGF*
