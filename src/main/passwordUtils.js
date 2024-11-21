import easyWordsData from "./easyWords.json";

const symbols = "!@#$%^&*()_+";
const numbers = "0123456789";

export const evaluateStrength = pwd => {
    let score = 1; // score must be 1 or above 

    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (pwd.isEasyToRemember === false) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+]/.test(pwd)) score += 1;
    if (pwd.length >= 12) score += 1;

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
            strengthMessage = "FAIR";
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
