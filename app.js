const quickWords = [
  "happiness",
  "bravery",
  "honest",
  "curiosity",
  "friendly",
  "kindness",
  "careful",
  "helper",
  "planetary",
  "beneficial"
];

const suffixLibrary = [
  { suffix: "ness", description: "state of being or quality" },
  { suffix: "ly", description: "in a manner or way" },
  { suffix: "ful", description: "full of" },
  { suffix: "less", description: "without" },
  { suffix: "able", description: "capable of being" },
  { suffix: "ible", description: "capable of being" },
  { suffix: "ment", description: "result or action" },
  { suffix: "tion", description: "act or process of" },
  { suffix: "ity", description: "state or quality of" },
  { suffix: "ous", description: "full of or having the quality of" },
  { suffix: "al", description: "relating to or pertaining to" },
  { suffix: "er", description: "someone who does a thing" },
  { suffix: "or", description: "person or thing connected with an action" },
  { suffix: "ship", description: "state, condition, or skill of" },
  { suffix: "ary", description: "related to or connected with" }
];

const fallbackWordData = {
  happiness: {
    word: "happiness",
    definition: "The state of being happy or content.",
    synonyms: ["joy", "pleasure", "delight"],
    antonyms: ["sadness", "misery", "unhappiness"],
    suffix: "ness",
    suffixMeaning: "state of being or quality",
    origin: "From Old English 'hap' meaning chance or fortune, later shaped into 'happiness' to describe a positive state.",
    example: "Her happiness was clear in the way she smiled.",
    partOfSpeech: "noun"
  },
  bravery: {
    word: "bravery",
    definition: "The quality of being courageous in fear or danger.",
    synonyms: ["courage", "valor", "fearlessness"],
    antonyms: ["cowardice", "timidity", "fear"],
    suffix: "ry",
    suffixMeaning: "state or quality of being",
    origin: "From Old French 'braverie', meaning boldness or bravery.",
    example: "The firefighter showed remarkable bravery during the rescue.",
    partOfSpeech: "noun"
  },
  kindness: {
    word: "kindness",
    definition: "The quality of being friendly, generous, and considerate.",
    synonyms: ["compassion", "gentleness", "warmth"],
    antonyms: ["cruelty", "harshness", "rudeness"],
    suffix: "ness",
    suffixMeaning: "state of being or quality",
    origin: "Derived from the word 'kind', meaning gentle or benevolent.",
    example: "Her kindness made everyone feel welcome.",
    partOfSpeech: "noun"
  },
  curious: {
    word: "curious",
    definition: "Eager to know or learn something.",
    synonyms: ["inquisitive", "interested", "nosy"],
    antonyms: ["indifferent", "apathetic", "uninterested"],
    suffix: "ous",
    suffixMeaning: "full of or having the quality of",
    origin: "From Latin 'curiosus', meaning careful or inquisitive.",
    example: "The curious child asked endless questions.",
    partOfSpeech: "adjective"
  },
  helpful: {
    word: "helpful",
    definition: "Giving or ready to give help.",
    synonyms: ["useful", "assisting", "supportive"],
    antonyms: ["useless", "hindering", "unhelpful"],
    suffix: "ful",
    suffixMeaning: "full of",
    origin: "From 'help' plus the suffix '-ful', meaning full of usefulness.",
    example: "The teacher was very helpful during class.",
    partOfSpeech: "adjective"
  },
  careful: {
    word: "careful",
    definition: "Making sure of avoiding potential mistakes or dangers.",
    synonyms: ["cautious", "attentive", "mindful"],
    antonyms: ["careless", "reckless", "negligent"],
    suffix: "ful",
    suffixMeaning: "full of",
    origin: "From 'care' with the suffix '-ful', indicating full of care.",
    example: "She was careful while crossing the busy road.",
    partOfSpeech: "adjective"
  }
};

const statusText = document.getElementById("status");
const wordCard = document.getElementById("word-card");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const quickWordsContainer = document.getElementById("quick-words");

const wordFields = {
  word: document.getElementById("word"),
  partOfSpeech: document.getElementById("part-of-speech"),
  phonetic: document.getElementById("phonetic"),
  definition: document.getElementById("definition"),
  synonyms: document.getElementById("synonyms"),
  antonyms: document.getElementById("antonyms"),
  suffix: document.getElementById("suffix"),
  suffixMeaning: document.getElementById("suffix-meaning"),
  origin: document.getElementById("origin"),
  example: document.getElementById("example")
};

function renderQuickWords() {
  quickWordsContainer.innerHTML = "";

  quickWords.forEach((term) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-word";
    button.textContent = term;
    button.addEventListener("click", () => {
      searchInput.value = term;
      searchWord(term);
    });
    quickWordsContainer.appendChild(button);
  });
}

function detectSuffix(word) {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, "");

  if (!normalized) {
    return { suffix: "N/A", description: "No suffix detected." };
  }

  let match = null;

  suffixLibrary.forEach(({ suffix, description }) => {
    if (normalized.endsWith(suffix) && normalized.length > suffix.length + 2) {
      if (!match || suffix.length > match.suffix.length) {
        match = { suffix, description };
      }
    }
  });

  return match || { suffix: "No common suffix", description: "This word does not match a common English suffix pattern." };
}

function uniqueList(items) {
  return [...new Set((items || []).filter(Boolean).map((item) => item.toString().trim()))].slice(0, 8);
}

function renderWordCard(data) {
  wordFields.word.textContent = data.word;
  wordFields.partOfSpeech.textContent = data.partOfSpeech || "unknown";
  wordFields.phonetic.textContent = data.phonetic || "/ˈwoʊrd/";
  wordFields.definition.textContent = data.definition || "No definition available.";
  wordFields.suffix.textContent = data.suffix || "N/A";
  wordFields.suffixMeaning.textContent = data.suffixMeaning || "No suffix meaning available.";
  wordFields.origin.textContent = data.origin || "Origin information not available.";
  wordFields.example.textContent = data.example || "No example found.";

  wordFields.synonyms.innerHTML = "";
  wordFields.antonyms.innerHTML = "";

  const synonymValues = uniqueList(data.synonyms || []);
  const antonymValues = uniqueList(data.antonyms || []);

  if (!synonymValues.length) {
    const item = document.createElement("li");
    item.textContent = "No synonyms found";
    wordFields.synonyms.appendChild(item);
  } else {
    synonymValues.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      wordFields.synonyms.appendChild(item);
    });
  }

  if (!antonymValues.length) {
    const item = document.createElement("li");
    item.textContent = "No antonyms found";
    wordFields.antonyms.appendChild(item);
  } else {
    antonymValues.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      wordFields.antonyms.appendChild(item);
    });
  }

  wordCard.classList.remove("hidden");
}

function normalizeWordData(rawWord, entry) {
  const meaning = entry?.meanings?.[0] || {};
  const definition = meaning?.definitions?.[0]?.definition || "No definition found.";
  const examples = meaning?.definitions?.flatMap((item) => item.example ? [item.example] : []) || [];
  const synonyms = uniqueList(meaning?.synonyms || []);
  const antonyms = uniqueList(meaning?.antonyms || []);
  const phonetic = entry?.phonetics?.find((item) => item.text)?.text || "";
  const suffix = detectSuffix(rawWord);

  return {
    word: (entry?.word || rawWord).toLowerCase(),
    partOfSpeech: meaning?.partOfSpeech || "noun",
    definition,
    synonyms,
    antonyms,
    phonetic,
    suffix: suffix.suffix,
    suffixMeaning: suffix.description,
    origin: entry?.origin || "Origin information not available in the API response.",
    example: examples[0] || "No example provided.",
  };
}

async function searchWord(word) {
  const searchTerm = word.trim();

  if (!searchTerm) {
    statusText.textContent = "Please type a word to search.";
    wordCard.classList.add("hidden");
    return;
  }

  statusText.textContent = `Searching for “${searchTerm}”...`;

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchTerm)}`);

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    const entry = Array.isArray(data) ? data[0] : null;

    if (!entry) {
      throw new Error("No word data found");
    }

    const normalized = normalizeWordData(searchTerm, entry);
    renderWordCard(normalized);
    statusText.textContent = `Results for “${searchTerm}”`;
    return;
  } catch (error) {
    const fallback = fallbackWordData[searchTerm.toLowerCase()];

    if (fallback) {
      renderWordCard(fallback);
      statusText.textContent = `Showing local result for “${searchTerm}”`;
      return;
    }

    wordCard.classList.add("hidden");
    statusText.textContent = `No results found for “${searchTerm}”. Try another English word.`;
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const word = searchInput.value;
  searchWord(word);
});

renderQuickWords();
statusText.textContent = "Search any English word to see its definition, synonyms, antonyms, suffix, and origin.";
