// Charger les citations depuis le stockage local
function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Sauvegarder les citations dans le stockage local
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initialiser les citations avec celles du Local Storage
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

// Fonction pour afficher une citation aléatoire en fonction de la catégorie sélectionnée
function showRandomQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
        quoteDisplay.innerHTML = 'No quotes available for this category';
    }

    // Sauvegarder la dernière citation vue dans le Session Storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
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

    // Gestionnaire d'événement pour ajouter une nouvelle citation et sauvegarder dans Local Storage
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newQuote = {
            text: textInput.value,
            category: categoryInput.value
        };
        quotes.push(newQuote);
        saveQuotesToLocalStorage(); // Sauvegarder après ajout
        populateCategories(); // Met à jour la liste déroulante des catégories
        textInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
    });

    document.body.appendChild(form);
}

// Fonction pour exporter les citations en JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Crée un lien temporaire pour le téléchargement
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();

    // Nettoyage de l'URL
    URL.revokeObjectURL(url);
}

// Fonction pour importer des citations depuis un fichier JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    // Fonction exécutée lorsque le fichier est chargé
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) { // Vérifie si les données sont un tableau
                quotes.push(...importedQuotes);
                saveQuotesToLocalStorage(); // Sauvegarde dans Local Storage
                populateCategories(); // Met à jour la liste des catégories
                alert('Quotes imported successfully!');
                showRandomQuote(); // Met à jour l'affichage
            } else {
                alert("Invalid JSON format");
            }
        } catch (error) {
            alert("Failed to import quotes: Invalid JSON file.");
        }
    };

    fileReader.readAsText(event.target.files[0]);
}

// Fonction pour remplir le menu déroulant des catégories
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Extrait les catégories uniques

    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Réinitialise le menu
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Récupère le dernier filtre sélectionné de Local Storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory; // Sélectionne la dernière catégorie utilisée
        filterQuotes(); // Filtre immédiatement les citations
    }
}

// Fonction pour filtrer les citations en fonction de la catégorie sélectionnée
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Efface l'affichage précédent

    // Filtre les citations en fonction de la catégorie sélectionnée
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
        quoteDisplay.innerHTML = 'No quotes available for this category';
    }

    // Sauvegarde la catégorie sélectionnée dans Local Storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    createAddQuoteForm();
    populateCategories(); // Initialise le menu des catégories

    // Charger la dernière citation vue depuis le Session Storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastViewedQuote);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }
});
