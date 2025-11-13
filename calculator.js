// calculator.js - FIXED VERSION
class Calculator {
    constructor() {
        this.current = '0';
        this.previous = '';
        this.operator = null;
        this.waitingForNewOperand = false;
        this.history = [];
        
        this.displayUpdate = (value = '0') => {
            document.getElementById('display').textContent = value;
        };
        
        this.historyUpdate = () => {
            this.updateHistoryDisplay();
        };

    }

    
clearHistory = () => {
    this.history = [];
    this.historyUpdate();
    console.log('History cleared'); // Optional debug
}

toggleSign = () => {
    if (this.current !== '0' && this.current !== 'Error') {
        if (this.current.startsWith('-')) {
            this.current = this.current.slice(1);
        } else {
            this.current = '-' + this.current;
        }
        this.displayUpdate(this.current);
    }
}

percent = () => {
    if (this.current !== '0' && this.current !== 'Error') {
        const value = parseFloat(this.current);
        this.current = (value / 100).toString();
        this.displayUpdate(this.current);
    }
}

    inputDigit = (digit) => {
        if (this.waitingForNewOperand) {
            this.current = digit;
            this.waitingForNewOperand = false;
        } else {
            this.current = this.current === '0' ? digit : this.current + digit;
        }
        this.displayUpdate(this.current);
    }

    inputDecimal = () => {
        if (this.waitingForNewOperand) {
            this.current = '0.';
            this.waitingForNewOperand = false;
        } else if (this.current.indexOf('.') === -1) {
            this.current += '.';
        }
        this.displayUpdate(this.current);
    }

    // FIXED: Proper left-to-right chaining
    chooseOperator = (nextOperator) => {
        if (this.operator && !this.waitingForNewOperand) {
            // If we already have an operator and new number entered, evaluate first
            this.evaluate();
        }

        if (this.operator === null) {
            // First operator - just store the current value
            this.previous = this.current;
        }

        this.operator = nextOperator;
        this.waitingForNewOperand = true;
    }

    evaluate = () => {
        // Don't evaluate if we don't have both operands and an operator
        if (this.operator === null || this.waitingForNewOperand) {
            return;
        }

        const prev = parseFloat(this.previous);
        const current = parseFloat(this.current);

        if (isNaN(prev) || isNaN(current)) return;

        let computation;
        switch (this.operator) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.handleError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // ES6: Template literal
        const expression = `${this.previous} ${this.operator} ${this.current} = ${computation}`;
        this.addToHistory(expression);
        
        this.current = computation.toString();
        this.operator = null;
        this.previous = '';
        this.waitingForNewOperand = true;
        
        this.displayUpdate(this.current);
    }
    

    handleError = (message) => {
        this.displayUpdate(message);
        setTimeout(() => {
            this.displayUpdate(this.current);
        }, 2000);
    }

    clear = () => {
        this.current = '0';
        this.displayUpdate();
    }

    allClear = () => {
        this.current = '0';
        this.previous = '';
        this.operator = null;
        this.waitingForNewOperand = false;
        this.displayUpdate();
    }

    backspace = () => {
    // Handle error states
    if (this.current === 'Error' || this.current === 'Cannot divide by zero') {
        this.allClear();
        return;
    }
    
    // Handle single character cases
    if (this.current.length === 1) {
        this.current = '0';
    } 
    // Handle negative numbers with only 2 characters (like "-5")
    else if (this.current.length === 2 && this.current.startsWith('-')) {
        this.current = '0';
    }
    // Normal case - remove last character
    else {
        this.current = this.current.slice(0, -1);
    }
    
    this.displayUpdate(this.current);
    }

    addToHistory = (expression) => {
        this.history.unshift(expression);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        this.historyUpdate();
    }

    updateHistoryDisplay = () => {
    const historyElement = document.getElementById('history');
    
    if (this.history.length === 0) {
        historyElement.innerHTML = '<div class="history-empty">No history yet</div>';
    } else {
        historyElement.innerHTML = this.history
            .map(entry => `<div class="history-item">${entry}</div>`)
            .join('');
    }
}

    toJSON() {
        return {
            current: this.current,
            previous: this.previous,
            operator: this.operator,
            history: this.history
        };
    }
}