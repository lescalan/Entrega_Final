window.addEventListener('load', function() {
    // Cargar los valores guardados en el LocalStorage
    const savedLoanAmount = localStorage.getItem('loanAmount');
    const savedInterestRate = localStorage.getItem('interestRate');
    const savedLoanTerm = localStorage.getItem('loanTerm');

    if (savedLoanAmount) {
        document.getElementById('loanAmount').value = savedLoanAmount;
    }
    if (savedInterestRate) {
        document.getElementById('interestRate').value = savedInterestRate;
    }
    if (savedLoanTerm) {
        document.getElementById('loanTerm').value = savedLoanTerm;
    }

    // Fetch del JSON
    fetch('prestamos.json')
        .then(response => response.json())
        .then(data => {
            //  Mostrar el primer formulario del JSON
            document.getElementById('loanAmount').value = data[0].amount;
            document.getElementById('interestRate').value = data[0].interestRate;
            document.getElementById('loanTerm').value = data[0].term;
        })
        .catch(error => console.error('Error fetching loans:', error));
});

document.getElementById('loan-form').addEventListener('submit', function(e) {
    // Evitar el envio del formulario standard
    e.preventDefault();

    // Obtengo los valores
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly interest rate
    const loanTerm = parseFloat(document.getElementById('loanTerm').value) * 12; // Monthly loan term

    // Guardado de datos en el localStorage
    localStorage.setItem('loanAmount', loanAmount);
    localStorage.setItem('interestRate', interestRate * 12 * 100); // Save annual interest rate
    localStorage.setItem('loanTerm', loanTerm / 12); // Save loan term in years

    // Calculo matematico
    const x = Math.pow(1 + interestRate, loanTerm);
    const monthlyPayment = (loanAmount * x * interestRate) / (x - 1);

    // El resultado es un nro finito?
    if (isFinite(monthlyPayment)) {
        // Muestra los resultados
        document.getElementById('monthlyPayment').innerText = '$' + monthlyPayment.toFixed(2);
        document.getElementById('totalPayment').innerText = '$' + (monthlyPayment * loanTerm).toFixed(2);
        document.getElementById('totalInterest').innerText = '$' + ((monthlyPayment * loanTerm) - loanAmount).toFixed(2);

        document.getElementById('results').style.display = 'block';
    } else {
        // En caso de Error
        showError('Please check your numbers');
    }
});

function showError(error) {
    // Creo un div
    const errorDiv = document.createElement('div');

    // Traigo los elementos
    const card = document.querySelector('.container');
    const heading = document.querySelector('h2');

    // class
    errorDiv.className = 'alert alert-danger';

    // Creo un texto y agrego al div
    errorDiv.appendChild(document.createTextNode(error));

    // Inserto el error
    card.insertBefore(errorDiv, heading);

    // Borro el error despues de 3 segundos
    setTimeout(clearError, 3000);
}

function clearError() {
    document.querySelector('.alert').remove();
}
