/* global window */

// Fonctions utilitaires
function addNumbers(a, b) { return a + b; }
function subtractNumbers(a, b) { return a - b; }
function multiplyNumbers(a, b) { return a * b; }
function divideNumbers(a, b) { return a / b; }
function isValidNumber(value) { return !isNaN(value) && isFinite(value); }

// Exposer dans le navigateur
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
    isValidNumber,
  };
}
/* eslint-enable no-undef */
