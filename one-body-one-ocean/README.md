# One Body, One Ocean

One Body, One Ocean is an educational Next.js experience that ties the health of the human body to the ocean through interactive storytelling and mini-games. The landing page invites visitors to explore organs on an illustrated body, then discover how each organ mirrors a vital marine process, challenge themselves with a knowledge quiz, and complete playful challenges highlighting marine preservation.

## ✨ Features

- **Interactive human body navigation** – Clickable icons reveal contextual modals that compare organs to ocean systems and offer actionable tips for protecting both. 【F:src/components/Navbar.tsx†L1-L169】
- **Educational quiz** – A multi-question quiz validates each answer in real time, tracking correct and incorrect responses with feedback and progression controls. 【F:src/app/survey/page.tsx†L1-L154】【F:src/app/data/questions.json†L1-L120】
- **Gamified captcha** – A custom “prove you’re not a robot” flappy-fish mini-game challenges players to survive before entering the Cookie Clicker experience. 【F:src/app/captcha-game/page.tsx†L1-L168】
- **Cookie Clicker remix** – A playful resource management mini-game with upgrades, auto-clickers, and dynamic behaviors that reacts to how you interact with the fish. 【F:src/app/CookieClicker/page.js†L1-L200】
- **Credits gallery** – A dedicated page acknowledging project contributors and partners. 【F:src/app/credits/page.tsx†L1-L200】

## 🗂️ Project structure

```text
one-body-one-ocean/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/
│   │   ├── CookieClicker/  # Cookie clicker mini-game and helpers
│   │   ├── captcha-game/   # Flappy-fish captcha game
│   │   ├── credits/        # Credits page
│   │   ├── data/           # Quiz question bank
│   │   ├── quiz/           # Quiz wrapper
│   │   ├── survey/         # Quiz engine and answer component
│   │   ├── page.tsx        # Landing page
│   │   └── layout.tsx      # Root layout
│   └── components/         # Reusable UI components (modals, scenes)
├── package.json
└── README.md
```

## 🚀 Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Build for production**

   ```bash
   npm run build
   npm start
   ```

4. **Lint the project**

   ```bash
   npm run lint
   ```

5. **Process Tailwind CSS manually (optional)**

   ```bash
   npm run build:css
   # or watch changes
   npm run watch:css
   ```

## 🛠️ Tech stack

- [Next.js 15](https://nextjs.org/) with the App Router. 【F:package.json†L1-L28】
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling. 【F:package.json†L1-L28】
- [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` for data visualization components. 【F:package.json†L1-L28】

## 🤝 Contributing

1. Fork the repository and create a new branch.
2. Commit your changes with clear messages.
3. Open a pull request describing your improvements.

## 📄 License

This project was created for Nuit de l'Info 2024. Please contact the maintainers for usage rights.
