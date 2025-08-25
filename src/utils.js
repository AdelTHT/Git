// Fonctions utilitaires pour les calculs
function addNumbers(a, b) {
    return a + b;
}

function subtractNumbers(a, b) {
    return a - b;
}

function multiplyNumbers(a, b) {
    return a * b;
}

function divideNumbers(a, b) {
    return a / b;
}

// Fonction de validation
function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
}

// Export pour les tests (si environnement Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addNumbers,
        subtractNumbers,
        multiplyNumbers,
        divideNumbers,
        isValidNumber
    };
}
// Exposer dans le navigateur (window)
if (typeof window !== 'undefined') {
  window.addNumbers = addNumbers;
  window.subtractNumbers = subtractNumbers;
  window.multiplyNumbers = multiplyNumbers;
  window.divideNumbers = divideNumbers;
  window.isValidNumber = isValidNumber;
}

// Export pour les tests Node (Jest)
/* eslint-disable no-undef */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addNumbers,
    subtractNumbers,
    multiplyNumbers,
    divideNumbers,
    isValidNumber
  };
}
/* eslint-enable no-undef */
