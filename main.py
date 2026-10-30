# PyScript handles the Wordle-style validation and attempt counter.
# The browser-side JavaScript handles presentation and animation.
from pyscript import document
from pyscript import when
from js import window
from pyodide.ffi import to_js

SECRET = "MAHALKITA"
MAX_ATTEMPTS = 6
attempts = 0
finished = False

def score_guess(guess: str, answer: str):
    """Return Wordle feedback while correctly accounting for repeated letters."""
    result = ["absent"] * len(answer)
    remaining = {}
    for i, char in enumerate(answer):
        if guess[i] == char:
            result[i] = "correct"
        else:
            remaining[char] = remaining.get(char, 0) + 1
    for i, char in enumerate(guess):
        if result[i] == "correct":
            continue
        if remaining.get(char, 0) > 0:
            result[i] = "present"
            remaining[char] -= 1
    return result

@when("pyscript-submit", "#submit-guess")
def handle_guess(event=None):
    global attempts, finished
    if finished:
        return

    field = document.querySelector("#guess-value")
    guess = str(field.value).strip().upper()
    status = document.querySelector("#status")

    if len(guess) != 9 or not guess.isalpha():
        status.textContent = "Enter a nine-letter word using letters only."
        return

    attempts += 1
    feedback = score_guess(guess, SECRET)

    # Send the result to the JavaScript renderer.
    window.paintGuess(to_js(feedback), guess)

    if guess == SECRET:
        finished = True
        status.textContent = "Thou hast spoken the secret, and the gates of my heart shall open unto thee."
        window.setTimeout(window.unlockCard, 450)
    elif attempts >= MAX_ATTEMPTS:
        finished = True
        status.textContent = "The secret remains veiled. Refresh the page to begin again."
        window.document.querySelector("#submit-guess").disabled = True
        window.document.querySelector("#delete-key").disabled = True
    else:
        remaining = MAX_ATTEMPTS - attempts
        status.textContent = f"Not quite, my love. {remaining} " + ("chance remains." if remaining == 1 else "chances remain.")
