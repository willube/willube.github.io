# Screen · Futuristic Realtime Chat

A futuristic, neon-styled realtime chat application hosted as a GitHub Pages site. Built with vanilla HTML, CSS, and JavaScript, backed by [Supabase](https://supabase.com) for authentication and realtime messaging.

## ✨ Highlights

- Realtime direct messaging between users via Supabase Realtime.
- Email/password authentication with registration (username selection) and login.
- Friend requests: send and accept friend requests by username.
- Futuristic dark UI with neon-glow effects, glassmorphism cards, and a cinematic noise/glow backdrop.
- Settings panel with profile info, neon-glow intensity toggle, password change, and logout.
- No build step — pure static files.

## 📂 Project Structure

```
index.html
assets/
  css/
    style.css
  js/
    script.js
```

## 🚀 Getting Started

Open `index.html` in your preferred browser or serve it with any static file server. No build step is required.

```powershell
npx serve .
```

Register an account (email + username + password), then log in to start chatting with friends in realtime.

## 🛠 Customization Tips

- Supabase project URL and anon key are set via `<meta>` tags in `index.html`.
- Update UI copy and color variables in `assets/css/style.css`.
- All application logic (auth, messaging, friend system) lives in `assets/js/script.js`.

---
Built with curiosity. Ready to chat.
