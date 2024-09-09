import React, { useState } from "react";
import CopySvg from "./CopySvg";
import Check from "./Check";

const easyWords = [
    "apple",
    "banana",
    "orange",
    "grape",
    "melon",
    "berry",
    "kiwi",
    "lemon",
    "lime",
    "main",
    "brick",
    "seed",
    "type",
    "earn",
    "trick",
    "each",
    "when",
    "purple",
    "mango",
    "peach",
    "pear",
    "plum",
    "cherry",
    "berry",
    "avocado",
    "fig",
    "date",
    "coconut",
    "papaya",
    "twitter",
    "diamond",
    "treasure",
    "greedy",
    "environment",
    "saturn",
    "kepler",
    "white",
    "optimist",
    "college",
    "larry",
    "candy",
    "strong",
    "firefighter",
    "crayon",
    "cardboard",
    "putin",
    "korea",
    "parrot",
    "deer",
    "heart",
    "megabolt",
    "megavolt",
    "goliath",
    "giant",
    "picture",
    "spanish",
    "edge"
];

const symbols = "!@#$%^&*()_+";
const numbers = "0123456789";

function MainContent() {
    const handleRangeChange = e => {
        const rangeValue = e.target.value;
        setPasswordLength(parseInt(rangeValue));

        // Update linear gradient width dynamically based on range value
        const rangeInput = e.target;
        const value =
            ((rangeValue - rangeInput.min) /
                (rangeInput.max - rangeInput.min)) *
            100;
        rangeInput.style.backgroundSize = `${value}% 100%`;
    };

    const [checkedStates, setCheckedStates] = useState({
        upperCase: false,
        lowerCase: false,
        numbers: false,
        symbols: false
    });
    const [passwordLength, setPasswordLength] = useState(8);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(2); // 0: weak, 1: fair, 2: good, 3: strong
    const [strengthMessage, setStrengthMessage] = useState("FAIR");

    const toggleCheckbox = type => {
        setCheckedStates(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    };
    const generatePassword = () => {
        let generatedPassword = "";

        // Add words from the list first
        while (generatedPassword.length < passwordLength) {
            const randomWord =
                easyWords[Math.floor(Math.random() * easyWords.length)];
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

        // Add extra characters if necessary to meet the length
        let remainingLength = passwordLength - generatedPassword.length;
        let extraChars = "";

        if (checkedStates.upperCase) extraChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (checkedStates.lowerCase) extraChars += "abcdefghijklmnopqrstuvwxyz";
        if (checkedStates.numbers) extraChars += numbers;
        if (checkedStates.symbols) extraChars += symbols;

        // If no character options are selected, fall back to lowercase letters
        if (!extraChars) extraChars = "abcdefghijklmnopqrstuvwxyz";

        for (let i = 0; i < remainingLength; i++) {
            const randomChar =
                extraChars[Math.floor(Math.random() * extraChars.length)];
            generatedPassword += randomChar;
        }

        // Apply case mixing if both upper and lower are selected
        if (checkedStates.upperCase && checkedStates.lowerCase) {
            generatedPassword = generatedPassword
                .split("")
                .map(char =>
                    Math.random() > 0.5
                        ? char.toUpperCase()
                        : char.toLowerCase()
                )
                .join("");
        }

        setPassword(generatedPassword);
        evaluateStrength(generatedPassword);
    };

    const evaluateStrength = pwd => {
        let score = 0;

        if (pwd.length >= 8) score += 1; // Length check for 8 or more
        if (/[A-Z]/.test(pwd)) score += 1; // Uppercase
        if (/[a-z]/.test(pwd)) score += 1; // Lowercase
        if (/[0-9]/.test(pwd)) score += 1; // Numbers
        if (/[!@#$%^&*()_+]/.test(pwd)) score += 1; // Symbols

        // Fine-tuned thresholds
        if (pwd.length >= 12) score += 1; // Bonus for longer passwords

        setStrength(score);

        // Update message based on score
        switch (score) {
            case 1:
            case 2:
                setStrengthMessage("WEAK");
                break;
            case 3:
                setStrengthMessage("FAIR");
                break;
            case 4:
                setStrengthMessage("GOOD");
                break;
            case 5:
            case 6:
                setStrengthMessage("STRONG");
                break;
            default:
                setStrengthMessage("WEAK");
        }
    };

    const getStrengthClass = barNumber => {
        if (strength >= barNumber) {
            if (strength <= 2) {
                return "bg-red-500 border-red-500"; // Weak
            } else if (strength === 3) {
                return "bg-yellow-500 border-yellow-500"; // Fair
            } else if (strength === 4) {
                return "bg-blue-500 border-blue-500"; // Good
            } else if (strength >= 5) {
                return "bg-green-500 border-green-500"; // Strong
            }
        } else {
            return "bg-transparent border-white"; // Default for unfilled bars
        }
    };

    return (
        <main className="flex font-jetbrains justify-center items-center h-[99vh] text-center">
            <div>
                <h3 className="text-[#1b5a68] font-bold text-1xl m-3">
                    Password Generator
                </h3>
                <div>
                    <div className="flex align-center justify-between bg-[#0c2930] py-3 px-4 w-[19rem]">
                        <span>{password || "P@S$W0RD"}</span>
                        <span
                            onClick={() =>
                                navigator.clipboard.writeText(password)
                            }
                        >
                            <CopySvg />
                        </span>
                    </div>
                    <div className="my-4 bg-[#0c2930] py-3 px-4 w-[19rem]">
                        <div className="flex align-center justify-between my-3 ">
                            <span>Character Length </span>
                            <span>{passwordLength}</span>
                        </div>
                        <input
                            id="passwordRange"
                            type="range"
                            className="password__range"
                            min="6"
                            max="20"
                            value={passwordLength}
                            onChange={handleRangeChange}
                        />

                        {/* Custom Checkbox */}
                        <div className="flex mt-3 items-center">
                            <div
                                onClick={() => toggleCheckbox("upperCase")}
                                className={`flex items-center cursor-pointer relative h-5 w-5 border border-[#34afcb] rounded shadow hover:shadow-md ${
                                    checkedStates.upperCase
                                        ? "bg-[#34afcb]"
                                        : ""
                                }`}
                            >
                                {checkedStates.upperCase && (
                                    <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Check />
                                    </span>
                                )}
                            </div>
                            <label
                                className="cursor-pointer ml-3 text-sm"
                                onClick={() => toggleCheckbox("upperCase")}
                            >
                                Include Upper Case Letters
                            </label>
                        </div>

                        <div className="flex mt-3 items-center">
                            <div
                                onClick={() => toggleCheckbox("lowerCase")}
                                className={`flex items-center cursor-pointer relative h-5 w-5 border border-[#34afcb] rounded shadow hover:shadow-md ${
                                    checkedStates.lowerCase
                                        ? "bg-[#34afcb]"
                                        : ""
                                }`}
                            >
                                {checkedStates.lowerCase && (
                                    <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Check />
                                    </span>
                                )}
                            </div>
                            <label
                                className="cursor-pointer ml-3 text-sm"
                                onClick={() => toggleCheckbox("lowerCase")}
                            >
                                Include Lower Case Letters
                            </label>
                        </div>

                        <div className="flex mt-3 items-center">
                            <div
                                onClick={() => toggleCheckbox("numbers")}
                                className={`flex items-center cursor-pointer relative h-5 w-5 border border-[#34afcb] rounded shadow hover:shadow-md ${
                                    checkedStates.numbers ? "bg-[#34afcb]" : ""
                                }`}
                            >
                                {checkedStates.numbers && (
                                    <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Check />
                                    </span>
                                )}
                            </div>
                            <label
                                className="cursor-pointer ml-3 text-sm"
                                onClick={() => toggleCheckbox("numbers")}
                            >
                                Include Numbers
                            </label>
                        </div>

                        <div className="flex mt-3 items-center">
                            <div
                                onClick={() => toggleCheckbox("symbols")}
                                className={`flex items-center cursor-pointer relative h-5 w-5 border border-[#34afcb] rounded shadow hover:shadow-md ${
                                    checkedStates.symbols ? "bg-[#34afcb]" : ""
                                }`}
                            >
                                {checkedStates.symbols && (
                                    <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Check />
                                    </span>
                                )}
                            </div>
                            <label
                                className="cursor-pointer ml-3 text-sm"
                                onClick={() => toggleCheckbox("symbols")}
                            >
                                Include Symbols
                            </label>
                        </div>

                        <div className="flex align-center bg-[#061417] py-4 px-3 justify-between my-7">
                            <span className="text-[#1b5a68]">STRENGTH</span>
                            <span>
                                <span className="mx-1">{strengthMessage}</span>
                                <span
                                    className={`py-[1px] px-[3px] mr-1.5 border ${getStrengthClass(
                                        1
                                    )}`}
                                />
                                <span
                                    className={`py-[1px] px-[3px] mr-1.5 border ${getStrengthClass(
                                        2
                                    )}`}
                                />
                                <span
                                    className={`py-[1px] px-[3px] mr-1.5 border ${getStrengthClass(
                                        3
                                    )}`}
                                />
                                <span
                                    className={`py-[1px] px-[3px] border ${getStrengthClass(
                                        4
                                    )}`}
                                />
                            </span>
                        </div>
                        <button
                            className="bg-[#34afcb] text-black w-full font-bold py-4"
                            onClick={generatePassword}
                        >
                            <span>GENERATE </span>
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MainContent;
/*
thanks to chatgpt, if not, how would i debug 😅
*/
