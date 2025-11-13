// app.js - CORRECTED VERSION
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    
    // Theme Toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('calculatorTheme', newTheme);
        updateThemeButton(newTheme);
    });

    function updateThemeButton(theme) {
        const button = themeToggle;
        if (theme === 'dark') {
            button.textContent = '☀️ Light Mode';
            button.setAttribute('aria-label', 'Toggle light mode');
        } else {
            button.textContent = '🌙 Dark Mode';
            button.setAttribute('aria-label', 'Toggle dark mode');
        }
    }
    
    // Button click handlers - ONLY ONE SET OF LISTENERS!
    
    // Number buttons
    document.querySelectorAll('.btn-number').forEach(button => {
        button.addEventListener('click', () => {
            const number = button.getAttribute('data-number');
            if (number === '.') {
                calculator.inputDecimal();
            } else {
                calculator.inputDigit(number);
            }
        });
    });

    // Operator buttons
    document.querySelectorAll('.btn-operator').forEach(button => {
        button.addEventListener('click', () => {
            const operator = button.getAttribute('data-operator');
            calculator.chooseOperator(operator);
        });
    });

    // Action buttons (ONLY THIS ONE - REMOVE THE OTHERS!)
    // In your [data-action] event listener, update the switch statement:
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        switch (action) {
            case 'equals':
                calculator.evaluate();
                break;
            case 'clear':
                calculator.clear();
                break;
            case 'allClear':
                calculator.allClear();
                break;
            case 'backspace':
                calculator.backspace();
                break;
            case 'toggleSign':
                calculator.toggleSign();
                break;
            case 'percent':
                calculator.percent();
                break;
            case 'clearHistory':  // ADD THIS NEW CASE
                calculator.clearHistory();
                break;
        }
    });
});

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const { key } = event; // ES6: Destructuring
        
        if (key >= '0' && key <= '9') {
            calculator.inputDigit(key);
        } else if (key === '.') {
            calculator.inputDecimal();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            const operators = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷'
            };
            calculator.chooseOperator(operators[key]);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculator.evaluate();
        } else if (key === 'Backspace') {
            calculator.backspace();
        } else if (key === 'Escape') {
            calculator.allClear();
        }
    });
});