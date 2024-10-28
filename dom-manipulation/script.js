// Load quotes from Local Storage
function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to Local Storage
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initialize quotes with data from Local Storage
let quotes = loadQuotesFromLocalStorage();
if (quotes.length === 0) {
    quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Life" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
    ];
    saveQuotesToLocalStorage();
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const serverData = await response.json();
        
        // Map server data to the quote structure and sync
        const serverQuotes = serverData.map(item => ({
            text: item.title,
            category: "Imported"
        }));
        
        syncQuotesWithServer(serverQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Function to sync local quotes with server data
function syncQuotesWithServer(serverQuotes) {
    let localQuotes = loadQuotesFromLocalStorage();
    
    // Simple conflict resolution: Prioritize server data
    const serverIds = new Set(serverQuotes.map((quote, index) => index + localQuotes.length + 1));
    const newLocalQuotes = localQuotes.filter(quote => !serverIds.has(quote.id));
    
    quotes = [...newLocalQuotes, ...serverQuotes];
    saveQuotesToLocalStorage();

    populateCategories(); // Update category filter
    alert('Quotes have been synchronized with the server.');
}

// Function to post new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });

        if (!response.ok) throw new Error("Failed to post data to server");

        console.log("Quote successfully posted to server");
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// Display a random quote filtered by category
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

    sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
}

// Populate category filter dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }
}

// Start periodic sync with the server
function startSyncWithServer(interval = 300000) { // Sync every 5 minutes
    setInterval(fetchQuotesFromServer, interval);
}

// Initial Setup when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    createAddQuoteForm();
    populateCategories();
    startSyncWithServer();

    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastViewedQuote);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }
});

// Function to create and add new quotes via form submission
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

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newQuote = {
            text: textInput.value,
            category: categoryInput.value
        };

        quotes.push(newQuote);
        saveQuotesToLocalStorage();
        populateCategories();

        // Post new quote to server
        postQuoteToServer(newQuote);

        textInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
    });

    document.body.appendChild(form);
}
d