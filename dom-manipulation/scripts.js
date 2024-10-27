// Array to store quote objects
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" },
    { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Motivation" }
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = `"${quote.text}" - ${quote.category}`;
}

// Function to create and add a new quote form
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
        textInput.value = '';
        categoryInput.value = '';
        alert('Quote added successfully!');
    });

    document.body.appendChild(form);
}

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    const quoteDisplay = document.createElement('div');
    quoteDisplay.id = 'quoteDisplay';
    document.body.appendChild(quoteDisplay);

    const showQuoteButton = document.getElementById('newQuote');
    showQuoteButton.addEventListener('click', showRandomQuote);

    createAddQuoteForm();
});
