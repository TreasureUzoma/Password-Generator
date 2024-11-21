import easyWordsData from "./easyWords.json";

const symbols = "!@#$%^&*()_+";
const numbers = "0123456789";

export const evaluateStrength = pwd => {
    let score = 1; // score starts at 1 to ensure the minimum score is 1

    // 1. Length check: Password must be at least 10 characters long to score more than 1.
    if (pwd.length >= 10) score += 1; // +1 if length is 10 or more

    // 2. Uppercase letter: Requires at least one uppercase letter.
    if (/[A-Z]/.test(pwd)) score += 1; // +1 if it contains at least 1 uppercase letter


    // 3. Numbers: Requires at least one number.
    if (/[0-9]/.test(pwd)) score += 1; // +1 if it contains at least 1 number

    // 4. Special character: Requires at least one special character (e.g., !@#$%^&*).
    if (/[!@#$%^&*()_+]/.test(pwd)) score += 1; // +1 if it contains a special character

    // 5. Easy-to-Remember: Penalize if the password is easy to remember (e.g., dictionary word or simple pattern).
    if (pwd.isEasyToRemember === true) score -= 1; // -1 if it's easy to remember (e.g., "password123")

    // 6. Length of 12 or more: For stronger passwords, it should be 12 characters long to be considered "strong."
    if (pwd.length >= 12) score += 1; // +1 if length is 12 or more

    // 7. Maximum score: Cap the score to 4 (strongest level).
    score = Math.min(score, 4);

    // Ensure the score is at least 1 (cannot be less than 1)
    score = Math.max(score, 1);

    let strengthMessage = "WEAK";
    switch (score) {
        case 0:
            strengthMessage = "WEAK";
            break;
        case 1:
            strengthMessage = "WEAK";
            break;
        case 2:
            strengthMessage = "FAIR";
            break;
        case 3:
            strengthMessage = "GOOD";
            break;
        case 4:
            strengthMessage = "STRONG";
            break;
        default:
            strengthMessage = "STRONG";
            break;
    }

    return { score, strengthMessage };
};

export const generatePassword = (
    passwordLength,
    checkedStates,
    isEasyToRemember = checkedStates.easyToRemember
) => {
    let generatedPassword = "";

    if (isEasyToRemember) {
        while (generatedPassword.length < passwordLength) {
            const randomWord =
                easyWordsData.easyWords[
                    Math.floor(Math.random() * easyWordsData.easyWords.length)
                ];
            if (
                generatedPassword.length + randomWord.length + 1 <=
                passwordLength
            ) {
                generatedPassword +=
                    (generatedPassword ? "-" : "") + randomWord;
            } else {
                break;
            }
        }
    }

    let remainingLength = passwordLength - generatedPassword.length;
    let extraChars = "";

    if (checkedStates.upperCase) extraChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (checkedStates.lowerCase) extraChars += "abcdefghijklmnopqrstuvwxyz";
    if (checkedStates.numbers) extraChars += numbers;
    if (checkedStates.symbols) extraChars += symbols;

    if (!extraChars) extraChars = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < remainingLength; i++) {
        const randomChar =
            extraChars[Math.floor(Math.random() * extraChars.length)];
        generatedPassword += randomChar;
    }

    if (checkedStates.upperCase && checkedStates.lowerCase) {
        generatedPassword = generatedPassword
            .split("")
            .map(char =>
                Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
            )
            .join("");
    }

    return generatedPassword;
};
