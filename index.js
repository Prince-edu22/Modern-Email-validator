const emailInput = document.getElementById('emailInput');
const validateBtn = document.getElementById('validateBtn');
const resultContainer = document.querySelector('.result-container');
const result = document.getElementById('result');
const historyList = document.getElementById('historyList');

let validationHistory = JSON.parse(localStorage.getItem('emailValidationHistory')) || [];

// Initialize history
updateHistory();

function validateEmail() {
    const email = emailInput.value.trim();
    if (!email) return;

    // Show loading state
    validateBtn.classList.add('loading');
    resultContainer.classList.remove('show');

    // Simulate API call
    setTimeout(() => {
        const isValidFormat = validateEmailFormat(email);
        const isDisposable = checkDisposableEmail(email);
        const isDomainValid = checkDomain(email);
        
        const validationResult = {
            email,
            valid: isValidFormat && isDomainValid && !isDisposable,
            timestamp: new Date().toISOString()
        };

        showResult(validationResult);
        addToHistory(validationResult);
        validateBtn.classList.remove('loading');
        resultContainer.classList.add('show');
    }, 1000);
}

function validateEmailFormat(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function checkDomain(email) {
    const domain = email.split('@')[1];
    const invalidDomains = ['example.com', 'test.com', 'mailinator.com'];
    return !invalidDomains.includes(domain.toLowerCase());
}

function checkDisposableEmail(email) {
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    return disposableDomains.includes(domain.toLowerCase());
}

function showResult(result) {
    const icon = result.valid ? 
        '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>' : 
        '<i class="fas fa-times-circle" style="color: var(--error-color);"></i>';
    
    const text = result.valid ? 
        'Valid Email Address' : 
        'Invalid Email Address';
    
    const details = result.valid ? 
        'This email address is properly formatted and has a valid domain.' : 
        'This email appears to be invalid or uses a disposable service.';

    result.className = result.valid ? 'valid' : 'invalid';
    result.innerHTML = `
        <div class="result-icon">${icon}</div>
        <div class="result-text">${text}</div>
        <div class="result-details">${details}</div>
    `;
}

function addToHistory(result) {
    validationHistory.unshift(result);
    if (validationHistory.length > 5) validationHistory.pop();
    localStorage.setItem('emailValidationHistory', JSON.stringify(validationHistory));
    updateHistory();
}

function updateHistory() {
    historyList.innerHTML = validationHistory
        .map(item => `
            <li>
                <span class="email">${item.email}</span>
                <span class="status ${item.valid ? 'valid' : 'invalid'}">
                    ${item.valid ? 'Valid' : 'Invalid'}
                </span>
            </li>
        `)
        .join('');
}

// Event Listeners
validateBtn.addEventListener('click', validateEmail);
emailInput.addEventListener('keypress', e => e.key === 'Enter' && validateEmail());

// Input validation on typing
emailInput.addEventListener('input', () => {
    resultContainer.classList.remove('show');
});