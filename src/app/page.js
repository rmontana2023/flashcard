"use client";
import { useState, useEffect } from "react";

export default function FlashCardApp() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [lives, setLives] = useState(5);
  const [progress, setProgress] = useState({ correct: 0, incorrect: 0, reviewed: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [deckName, setDeckName] = useState("General");
  const [decks, setDecks] = useState({ General: [] });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("flashcardData"));
    if (storedData) {
      setDecks(storedData.decks);
      setDeckName(storedData.deckName);
      setFlashcards(storedData.decks[storedData.deckName] || []);
    } else {
      const demoFlashcards = [
        { question: "What is React?", answer: "A JavaScript library for building UIs." },
        { question: "What is Next.js?", answer: "A React framework for server-side rendering." },
        { question: "What is useState?", answer: "A React hook for state management." },
        { question: "What is useEffect?", answer: "A React hook for handling side effects." },
      ];
      const demoData = { decks: { General: demoFlashcards }, deckName: "General" };
      setDecks(demoData.decks);
      setFlashcards(demoData.decks.General);
      localStorage.setItem("flashcardData", JSON.stringify(demoData));
    }
  }, []);

  const saveData = (newDecks, newDeckName) => {
    setDecks(newDecks);
    setFlashcards(newDecks[newDeckName] || []);
    setDeckName(newDeckName);
    localStorage.setItem(
      "flashcardData",
      JSON.stringify({ decks: newDecks, deckName: newDeckName })
    );
  };

  const addFlashcard = () => {
    const question = prompt("Enter question:");
    const answer = prompt("Enter answer:");
    if (question && answer) {
      const newDecks = { ...decks, [deckName]: [...flashcards, { question, answer }] };
      saveData(newDecks, deckName);
    }
  };

  const editFlashcard = (index) => {
    const question = prompt("Edit question:", flashcards[index].question);
    const answer = prompt("Edit answer:", flashcards[index].answer);
    if (question && answer) {
      const updatedFlashcards = flashcards.map((card, i) =>
        i === index ? { question, answer } : card
      );
      const newDecks = { ...decks, [deckName]: updatedFlashcards };
      saveData(newDecks, deckName);
    }
  };

  const deleteFlashcard = (index) => {
    const newDecks = { ...decks, [deckName]: flashcards.filter((_, i) => i !== index) };
    saveData(newDecks, deckName);
  };

  const nextCard = (correct) => {
    setProgress((prev) => ({
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
      reviewed: prev.reviewed + 1,
    }));

    if (!correct) {
      setFlashcards([...flashcards, flashcards[currentIndex]]);
      setLives((prev) => prev - 1);
    }
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const changeDeck = (newDeck) => {
    saveData(decks, newDeck);
  };

  return (
    <div
      className={`p-6 max-w-lg mx-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-xl font-bold">Flash Card Study System</h1>
      <button
        className="mt-2 px-3 py-1 rounded bg-gray-500 text-white"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div className="mt-4">
        <label>Choose Deck:</label>
        <select
          className="ml-2 p-1 border"
          value={deckName}
          onChange={(e) => changeDeck(e.target.value)}
        >
          {Object.keys(decks).map((deck) => (
            <option key={deck} value={deck}>
              {deck}
            </option>
          ))}
        </select>
      </div>
      {isStudying ? (
        <div className="mt-4 p-4 border rounded">
          <p className="text-lg">{flashcards[currentIndex]?.question || "No cards available"}</p>
          {showAnswer && (
            <p className="text-md mt-2 text-green-500">{flashcards[currentIndex]?.answer}</p>
          )}
          <button
            className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 ml-2 rounded"
            onClick={() => nextCard(true)}
          >
            Correct
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 ml-2 rounded"
            onClick={() => nextCard(false)}
          >
            Incorrect
          </button>
          <p className="mt-2">Lives: {lives}/5</p>
        </div>
      ) : (
        <div className="mt-4">
          {flashcards.map((card, index) => (
            <div key={index} className="p-2 border-b flex justify-between">
              <span>{card.question}</span>
              <div>
                <button className="text-blue-500 mr-2" onClick={() => editFlashcard(index)}>
                  Edit
                </button>
                <button className="text-red-500" onClick={() => deleteFlashcard(index)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button className="bg-green-500 text-white px-3 py-1 mt-2 rounded" onClick={addFlashcard}>
            Add Flashcard
          </button>
        </div>
      )}
      <button
        className="bg-purple-500 text-white px-3 py-1 mt-4 rounded"
        onClick={() => setIsStudying(!isStudying)}
      >
        {isStudying ? "Back to List" : "Start Studying"}
      </button>
      <p className="mt-4">
        Progress: {progress.reviewed} Reviewed | {progress.correct} Correct | {progress.incorrect}{" "}
        Incorrect
      </p>
    </div>
  );
}
