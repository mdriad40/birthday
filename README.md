# 🌸 Umme Habiba Mim - Dreamy Birthday Celebration Website

A premium, romantic, elegant, interactive, and visually stunning digital birthday celebration website dedicated to **Umme Habiba Mim (উম্মে হাবিবা মিম)**, crafted with love by **Mohammed Riad Hasan (মোহাম্মদ রিয়াদ হাসান)**.

Built with **Pure HTML5**, **Modern CSS3**, and **Vanilla JavaScript** (Zero frameworks, zero heavy dependencies).

---

## 📂 Project Directory Structure

```text
Birthday/
│
├── index.html               # Main website with all 14 celebration sections
├── README.md                # Guide & customization instructions
│
├── css/
│   └── style.css            # Pastel theme, smooth animations, responsive styles
│
├── js/
│   └── script.js            # Interactive cake, confetti, lightbox, Web Audio engine
│
└── assets/
    ├── images/              # Put your couple & Habiba's photos here
    │   ├── couple-01.jpg
    │   ├── couple-02.jpg
    │   ├── couple-03.jpg
    │   ├── couple-04.jpg
    │   ├── couple-05.jpg
    │   ├── couple-06.jpg
    │   ├── couple-07.jpg
    │   ├── couple-08.jpg
    │   ├── mim-01.jpg
    │   ├── mim-02.jpg
    │   ├── mim-03.jpg
    │   ├── mim-04.jpg
    │   ├── mim-05.jpg
    │   └── mim-06.jpg
    │
    └── music/
        └── birthday-song.mp3 # Put your favorite romantic/birthday song here
```

> **Note:** The website has built-in graceful SVG fallbacks for all image cards, as well as an automated Web Audio API procedural romantic melody synthesizer. This means the website works and looks enchanting right out of the box even before you put your photos or mp3 file!

---

## 📸 1. How to Add Your Photos

1. Navigate to the `assets/images/` folder.
2. Place your photos with the exact filenames:
   - **For Couple Memories Gallery (Section 06):**
     - `couple-01.jpg`
     - `couple-02.jpg`
     - `couple-03.jpg`
     - `couple-04.jpg`
     - `couple-05.jpg`
     - `couple-06.jpg`
     - `couple-07.jpg`
     - `couple-08.jpg`
   - **For Habiba's Personal Gallery (Section 07):**
     - `mim-01.jpg`
     - `mim-02.jpg`
     - `mim-03.jpg`
     - `mim-04.jpg`
     - `mim-05.jpg`
     - `mim-06.jpg`
3. If your photos are `.png` or `.webp`, either rename/convert them to `.jpg` or open `index.html` and update the `src` attribute (e.g., `src="assets/images/couple-01.png"`).

---

## 🎵 2. How to Add Your Background Music

1. Choose a romantic acoustic song or soft birthday background track.
2. Name the file `birthday-song.mp3`.
3. Place it inside the `assets/music/` directory.
4. When Habiba clicks **"চলো, শুরু করি ✨"** on the welcome screen or clicks the play button on the floating music player, the song will play smoothly.
5. If no MP3 is placed yet, the website automatically plays a soothing acoustic chime lullaby synthesized through the browser's Web Audio API.

---

## ✍️ 3. How to Customize Text & Bengali Captions

- Open `index.html` in any text editor.
- **Section 04 (My Letter):** Search for `<article class="parchment-letter">` to add or edit any personal sentences in the letter.
- **Section 05 (Our Story Timeline):** Search for `<div class="timeline-wrapper">` to edit dates or descriptions of your milestones.
- **Section 06 & 07 (Photo Captions):** Change the `data-caption="..."` attribute and the caption text inside `<figcaption>` to your own personal words.
- **Section 08 (Things I Love):** Modify the 8 cards inside `<div class="admiration-grid">` to add any special personal memories or jokes.
- **Section 10 (Gift Box Message):** Search for `gift-card-text` to change the surprise gift message.

---

## 🚀 4. How to Deploy Online (Free & Fast)

### Option A: Netlify Drop (Easiest, Takes 30 Seconds)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the whole `Birthday` folder into the browser.
3. You will immediately get a live link (e.g. `mim-birthday.netlify.app`) to share with Habiba!

### Option B: GitHub Pages
1. Push this folder to a GitHub repository (e.g. `habiba-birthday`).
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your website will be live at `https://<username>.github.io/habiba-birthday/`.

---

## 💖 Special Note
Throughout the entire website:
- Respectful and affectionate Bengali addresses (**মিম**, **উম্মে হাবিবা মিম**, **হাবিবা**, **আমার প্রিয় মানুষ**) are used.
- The word "girlfriend" or "gf" is completely avoided.
- The tone is mature, romantic, and deeply emotional.

