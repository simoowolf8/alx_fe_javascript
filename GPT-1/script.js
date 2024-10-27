// Charger les citations depuis le stockage local (ajouté)
function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Sauvegarder les citations dans le stockage local (ajouté)
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initialiser les citations avec celles du Local Storage (modification)
// Remplace cette ligne :
// const quotes = [
//     { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
//     { text: "Life is what happens when you're busy making other plans.", category: "Life" },
//     { text: "Get busy living or get busy dying.", category: "Life" },
//     { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
// ];
// par cette ligne :
let quotes = loadQuotesFromLocalStorage();
if (quotes.length === 0) { // Si le stockage est vide, on ajoute des citations par défaut
    quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Life" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
    ];
    saveQuotesToLocalStorage(); // On enregistre les citations par défaut dans Local Storage
}

// Fonction pour afficher une citation aléatoire (modifiée pour utiliser le Session Storage)
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;

    // Sauvegarder la dernière citation vue dans le Session Storage (ajouté)
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Fonction pour créer et ajouter un formulaire de nouvelle citation
function createAddQuoteForm() {
    const form = document.createElement('form');
    form.id = 'addQuoteForm';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Quote text';
    textInput.required = true;

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Category';
    categoryInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Add Quote';

    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submitButton);

    // Gestionnaire d'événement pour ajouter une nouvelle citation et sauvegarder dans Local Storage (modifié)
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newQuote = {
            text: textInput.value,
            category: categoryInput.value
        };
        quotes.push(newQuote);
        saveQuotesToLocalStorage(); // Sauvegarder après ajout (ajouté)
        textInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
    });

    document.body.appendChild(form);
}

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    createAddQuoteForm();

    // Charger la dernière citation vue depuis le Session Storage (ajouté)
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastViewedQuote);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }
});
