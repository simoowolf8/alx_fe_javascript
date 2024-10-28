// Original Code: Loading quotes from Local Storage
function loadQuotesFromLocalStorage() {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Original Code: Saving quotes to Local Storage
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initialize quotes with data from Local Storage
let quotes = loadQuotesFromLocalStorage();
if (quotes.length === 0) { // Add default quotes if storage is empty
    quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Life" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
    ];
    saveQuotesToLocalStorage(); // Save default quotes to Local Storage
}

// New Code: Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Mock API endpoint
        if (!response.ok) throw new Error('Network response was not ok');
        
        const serverData = await response.json();
        
        // Map server data to match the local structure of quotes
        const serverQuotes = serverData.map(item => ({
            text: item.title,           // Assuming "title" maps to "text"
            category: "Imported"        // Default category for imported quotes
        }));
        
        syncQuotesWithServer(serverQuotes);
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// New Code: Sync quotes between Local Storage and server data
function syncQuotesWithServer(serverQuotes) {
    let localQuotes = loadQuotesFromLocalStorage();
    
    // Simple conflict resolution: Prioritize server data in case of discrepancies
    const serverIds = new Set(serverQuotes.map((quote, index) => index + localQuotes.length + 1)); // Simulated unique IDs
    const newLocalQuotes = localQuotes.filter(quote => !serverIds.has(quote.id));
    
    // Update quotes array with server quotes and unique local quotes
    quotes = [...newLocalQuotes, ...serverQuotes];
    saveQuotesToLocalStorage(); // Save updated quotes to Local Storage

    populateCategories(); // Update category filter with new data
    alert('Quotes have been synchronized with the server.');
}

// Original Code: Displaying a random quote with filtering by category
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

    // Save the last viewed quote to Session Storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(filteredQuotes[0]));
}

// Original Code: Populate category filter dropdown
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

    // Restore last selected category from Local Storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
        filterQuotes();
    }
}

// New Code: Start periodic sync with the server
function startSyncWithServer(interval = 300000) { // Default sync every 5 minutes
    setInterval(fetchQuotesFromServer, interval);
}

// Initial Setup when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    const exportButton = document.getElementById('exportQuotes');
    exportButton.addEventListener('click', exportToJsonFile);

    createAddQuoteForm();
    populateCategories(); // Populate categories initially
    startSyncWithServer(); // Start syncing with the server

    // Load last viewed quote from Session Storage
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const quote = JSON.parse(lastViewedQuote);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }
});
