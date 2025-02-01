import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const languages = ["English", "French", "German"];

export default function FlashcardApp() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [userInput, setUserInput] = useState("");
  const [vocab, setVocab] = useState(() => {
    return JSON.parse(localStorage.getItem("vocab")) || {
      English: [],
      French: [],
      German: [],
    };
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("Game");

  useEffect(() => {
    localStorage.setItem("vocab", JSON.stringify(vocab));
  }, [vocab]);

  const addWord = () => {
    if (word && meaning) {
      setVocab((prev) => {
        const updated = { ...prev, [selectedLanguage]: [...prev[selectedLanguage], { word, meaning }] };
        return updated;
      });
      setWord("");
      setMeaning("");
    }
  };

  const shuffleCards = () => {
    setIndex(Math.floor(Math.random() * vocab[selectedLanguage].length));
    setFlipped(false);
    setUserInput("");
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % vocab[selectedLanguage].length);
    setFlipped(false);
    setUserInput("");
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + vocab[selectedLanguage].length) % vocab[selectedLanguage].length);
    setFlipped(false);
    setUserInput("");
  };

  const submitAnswer = () => {
    setFlipped(true);
  };

  const sortedDictionary = [...vocab[selectedLanguage] || []]
    .filter(item => item.word.includes(searchTerm) || item.meaning.includes(searchTerm))
    .sort((a, b) => a.word.localeCompare(b.word));

  const LanguageSwitcher = () => (
    <div className="mt-4 flex justify-around border-t pt-2">
      {languages.map((lang) => (
        <Button key={lang} variant="ghost" onClick={() => setSelectedLanguage(lang)}>
          {lang}
        </Button>
      ))}
    </div>
  );

  if (!selectedLanguage) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Select Language</h1>
        {languages.map((lang) => (
          <Button key={lang} className="m-2" onClick={() => setSelectedLanguage(lang)}>{lang}</Button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <nav className="flex justify-between items-center mb-4 border-b pb-2">
        <Button variant="ghost" onClick={() => setSelectedLanguage(null)}>Home</Button>
        <div className="flex space-x-4">
          {['Game', 'Dictionary', 'Add'].map(tab => (
            <Button key={tab} variant={currentTab === tab ? "default" : "ghost"} onClick={() => setCurrentTab(tab)}>
              {tab}
            </Button>
          ))}
        </div>
      </nav>
      {currentTab === "Game" && vocab[selectedLanguage].length > 0 && (
        <>
          <Card className="p-4 text-center">
            <CardContent className="text-lg font-medium">
              {!flipped ? vocab[selectedLanguage][index].word : vocab[selectedLanguage][index].meaning}
            </CardContent>
          </Card>
          {!flipped && (
            <Input 
              className="mt-4 p-2 border rounded" 
              placeholder="Enter the meaning" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)}
            />
          )}
          <div className="flex justify-between mt-4">
            <Button onClick={prevCard}>Back</Button>
            {!flipped ? <Button onClick={submitAnswer}>Submit</Button> : <Button onClick={shuffleCards}>Shuffle</Button>}
            <Button onClick={nextCard}>Next</Button>
          </div>
        </>
      )}
      {currentTab === "Dictionary" && (
        <>
          <Input className="mb-4" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <ul className="list-disc pl-4">
            {sortedDictionary.map((item, index) => (
              <li key={index}>{item.word} - {item.meaning}</li>
            ))}
          </ul>
        </>
      )}
      {currentTab === "Add" && (
        <div className="flex flex-col gap-2">
          <Input className="p-2 border rounded" placeholder="Word" value={word} onChange={(e) => setWord(e.target.value)} />
          <Input className="p-2 border rounded" placeholder="Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
          <Button onClick={addWord}>Add Word</Button>
        </div>
      )}
      <LanguageSwitcher />
    </div>
  );
}
