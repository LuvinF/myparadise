# Five Months of Us — Royal Paradise Anniversary Card

## Run locally
1. Extract the ZIP.
2. Open the folder in a terminal.
3. Start a local server (recommended; PyScript modules may not run correctly from `file://`):

   **Python**
   ```bash
   python -m http.server 8000
   ```

4. Open `http://localhost:8000` in your browser.

The Wordle puzzle uses native JavaScript form submission for reliable mobile keyboard support. Google Fonts load from the internet; the page does not require a Python environment beyond the local HTTP server.

## Add your song
1. Create an `assets` folder beside `index.html`.
2. Put your own MP3 in that folder and name it `our-song.mp3`.
3. The music button appears after the letter unlocks. Music does not autoplay.

## Files
- `index.html` — page structure and card content
- `style.css` — visual design, responsive layout and animations
- `script.js` — particle effects, keyboard interaction and reveal animation
- `main.py` — retained reference implementation; the live mobile puzzle runs in `script.js`

## Change the letter
Edit the text inside `.poem`, `.royal-quote`, `.closing-message` and `.forever` in `index.html`.

## Important security note
This is a romantic front-end experience, not secure authentication. The answer is present in the client-side Python source and can be found by someone who inspects the downloaded files. It prevents ordinary UI bypass, but it cannot protect the secret against source inspection. A genuinely private gate requires server-side validation.

## Mobile keyboard
Tap the text field, type a nine-letter guess with the phone keyboard, then press the keyboard's Enter/Go key. The on-screen keyboard has been removed. The Unlock button remains as an alternative submit control.
