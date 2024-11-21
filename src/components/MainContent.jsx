import React, { useState, useEffect } from "react";
import CopySvg from "./CopySvg";
import Check from "./Check";
import { generatePassword, evaluateStrength } from "./../main/passwordUtils"; // Import logic functions

function MainContent() {
    const [checkedStates, setCheckedStates] = useState({
        upperCase: false,
        lowerCase: true, // Always true, can't be toggled 
        numbers: false,
        symbols: false,
        easyToRemember: true, 
    });
    const [passwordLength, setPasswordLength] = useState(8);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(2); // 0&1: weak, 2: fair, 3: good, 4: strong 
    const [strengthMessage, setStrengthMessage] = useState("FAIR");
    const [shuffling, setShuffling] = useState(false); // State to control the shuffle animation
    const [displayedPassword, setDisplayedPassword] = useState(""); // Displaying the shuffled password
    const [showCopiedPopup, setShowCopiedPopup] = useState(false); // State for the "Copied" popup

    // Handle range slider change
    const handleRangeChange = (e) => {
        
        const rangeValue = e.target.value;
        setPasswordLength(parseInt(rangeValue));

        // Update linear gradient width dynamically based on range value
        const rangeInput = e.target;
        const value =
            ((rangeValue - rangeInput.min) /
                (rangeInput.max - rangeInput.min)) *
            100;
        rangeInput.style.backgroundSize = `${value}% 100%`;
        handleGeneratePassword();
    };

    // Toggle checkbox state (only for the non-disabled ones)
    const toggleCheckbox = (type) => {
        if (type !== "lowerCase") {
            setCheckedStates((prevState) => ({
                ...prevState,
                [type]: !prevState[type],
            }));
        }
    
      handleGeneratePassword();
    };

    // Function to generate a random character for the shuffle effect
    const getRandomChar = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    };

    // Simulate the shuffling effect
    const shufflePassword = (finalPassword) => {
        const shuffleTimes = 6; // Number of "shuffle" steps
        let currentShuffle = 0;
        const interval = setInterval(() => {
            setDisplayedPassword(
                Array.from({ length: passwordLength }, () => getRandomChar()).join("")
            );
            currentShuffle++;
            if (currentShuffle >= shuffleTimes) {
                clearInterval(interval);
                setDisplayedPassword(finalPassword); // Set the final password
            }
        }, 50); // Update every 50ms
    };

    // Generate password and evaluate its strength
    const handleGeneratePassword = () => {
        const newPassword = generatePassword(passwordLength, checkedStates);
        const { score, strengthMessage } = evaluateStrength(newPassword);

        setPassword(newPassword);
        setStrength(score);
        setStrengthMessage(strengthMessage);

        // Trigger the shuffle effect before displaying the final password
        setShuffling(true);
        shufflePassword(newPassword);
    };

    // Determine the strength bar class
    const getStrengthClass = (barNumber) => {
        if (strength >= barNumber) {
            // 0&1: weak, 2: fair, 3: good, 4: strong 
            if (strength <= 1) {
                return "bg-red-500 border-red-500"; // Weak
            } else if (strength === 2) {
                return "bg-yellow-500 border-yellow-500"; // Fair
            } else if (strength === 3) {
                return "bg-emerald-500 border-emerald-500"; // Good
            } else if (strength >= 4) {
                return "bg-green-500 border-green-500"; // Strong
            }
        }
        else {
            return "bg-black border-red"; // Default for unfilled bars
        }
    };

    // Function to handle copying to clipboard and show popup
    const handleCopyPassword = () => {
        navigator.clipboard.writeText(password); // Copy the password to clipboard
        setShowCopiedPopup(true); // Show the popup
        setTimeout(() => {
            setShowCopiedPopup(false); // Hide the popup after 1 second
        }, 1000);
    };

    return (
        <main className="flex font-jetbrains justify-center items-center h-[99vh] text-center">
            <div>
                <h3 className="text-[#1b5a68] font-bold text-1xl m-3">
                    Password Generator
                </h3>
                <div>
                    <div className="flex align-center justify-between bg-[#0c2930] py-3 px-4 w-[19rem]">
                        <span>{displayedPassword || "P@S$W0RD"}</span>
                        <span onClick={handleCopyPassword}>
                            <CopySvg />
                        </span>
                    </div>

                    {/* Copied Popup */}
                    {showCopiedPopup && (
                        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 font-poppins text-[0.6rem] text-white px-4 py-2 rounded-2xl shadow-lg">
                            Copied!
                        </div>
                    )}

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
                            max="25"
                            value={passwordLength}
                            onChange={handleRangeChange}
                        />

                        {/* Custom Checkboxes */}
                        {["upperCase", "lowerCase", "numbers", "symbols", "easyToRemember"].map(
                            (key) => (
                                <div className="flex mt-3 items-center" key={key}>
                                    <div
                                        onClick={() => toggleCheckbox(key)}
                                        className={`flex items-center cursor-pointer relative h-5 w-5 border border-[#34afcb] rounded shadow hover:shadow-md ${
                                            checkedStates[key] 
                                                ? "bg-[#34afcb]" 
                                                : (key === "lowerCase" ? "bg-[#1a4f56]" : "")
                                        }`}
                                        style={{
                                            cursor: key === "lowerCase" ? "not-allowed" : "pointer",
                                        }}
                                    >
                                        {checkedStates[key] && (
                                            <span className="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <Check />
                                            </span>
                                        )}
                                    </div>
                                    <label
                                        className="cursor-pointer ml-3 text-sm"
                                        onClick={() => toggleCheckbox(key)}
                                        style={{
                                            color: key === "lowerCase" ? "#6b7d7f" : "inherit", // Slightly darker color for disabled
                                        }}
                                    >
                                        {key === "easyToRemember"
                                            ? "Easy to Remember"
                                            : `Include ${key
                                                  .replace(/([A-Z])/g, " $1")
                                                  .trim()} Letters`}
                                    </label>
                                </div>
                            )
                        )}

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
                            onClick={handleGeneratePassword}
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
