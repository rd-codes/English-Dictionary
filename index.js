const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const phoneticEl = document.getElementById("phonetic");
const audioBtn = document.getElementById("audio-btn");
const partOfSpeechEl = document.getElementById("part-of-speech");
const definitionsEl = document.getElementById("definitions");
const examplesEl = document.getElementById("examples");
const synonymsEl = document.getElementById("synonyms");
const loaderEl = document.getElementById("loader");

let audio = null;

async function fetchAPI(word) {
    try {
        // Reset and show loading state
        meaningContainerEl.style.display = "none";
        infoTextEl.style.display = "none";
        loaderEl.style.display = "block";

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(url);
        const result = await response.json();

        // Hide loader
        loaderEl.style.display = "none";

        if (!response.ok) {
            meaningContainerEl.style.display = "block";
            titleEl.innerText = word;
            phoneticEl.innerText = "";
            partOfSpeechEl.innerText = "";
            definitionsEl.innerHTML = `<div class="definition-item">
                <p class="definition-text">No definitions found. Please check the spelling.</p>
            </div>`;
            examplesEl.innerHTML = "";
            synonymsEl.innerHTML = "";
            audioBtn.style.display = "none";
            return;
        }

        // Show results
        meaningContainerEl.style.display = "block";
        
        // Word title and phonetic
        titleEl.innerText = result[0].word;
        phoneticEl.innerText = result[0].phonetic || "";

        // Audio
        const phoneticObj = result[0].phonetics.find(p => p.audio) || {};
        if (phoneticObj.audio) {
            audio = new Audio(phoneticObj.audio);
            audioBtn.style.display = "block";
        } else {
            audioBtn.style.display = "none";
        }

        // Definitions
        let definitionsHTML = "";
        result[0].meanings.forEach(meaning => {
            definitionsHTML += `
                <div class="definition-item">
                    <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
                    ${meaning.definitions.map(def => `
                        <div class="definition-text">${def.definition}</div>
                        ${def.example ? `<div class="example">"${def.example}"</div>` : ''}
                    `).join('')}
                </div>
            `;
        });
        definitionsEl.innerHTML = definitionsHTML;

        // Synonyms
        const allSynonyms = result[0].meanings.reduce((acc, meaning) => {
            return acc.concat(meaning.synonyms || []);
        }, []);
        
        if (allSynonyms.length > 0) {
            synonymsEl.innerHTML = `
                <h3>Synonyms:</h3>
                <div class="synonyms">
                    ${allSynonyms.slice(0, 5).map(syn => `
                        <span class="synonym-tag">${syn}</span>
                    `).join('')}
                </div>
            `;
        } else {
            synonymsEl.innerHTML = "";
        }

    } catch (error) {
        loaderEl.style.display = "none";
        infoTextEl.style.display = "block";
        infoTextEl.innerHTML = `<span style="color: #e74c3c">An error occurred. Please try again later.</span>`;
    }
}

inputEl.addEventListener("keyup", (e) => {
    if (e.target.value && e.key === "Enter") {
        fetchAPI(e.target.value.trim());
    }
});

audioBtn.addEventListener("click", () => {
    if (audio) {
        audio.play();
    }
});