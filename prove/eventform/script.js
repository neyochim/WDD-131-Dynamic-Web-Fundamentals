const form = document.querySelector('#ticket-form');
const typeSelect = document.querySelector('#type');
const typeDetails = document.querySelector('#type-details');
const typeLabel = document.querySelector('#type-label');
const typeCode = document.querySelector('#type-code');
const eventDate = document.querySelector('#event-date');
const errorPanel = document.querySelector('#errors');
const ticketPanel = document.querySelector('#ticket');

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const minDate = tomorrow.toISOString().split('T')[0];

eventDate.min = minDate;

typeCode.disabled = true;
typeCode.required = false;
typeCode.dataset.mode = '';

function showTypeField(mode) {
    const isStudent = mode === 'student';
    const isGuest = mode === 'guest';

    typeDetails.hidden = !mode;
    typeCode.disabled = !mode;
    typeCode.required = !!mode;
    typeCode.value = '';
    typeCode.setCustomValidity('');

    if (isStudent) {
        typeLabel.textContent = 'Student I#';
        typeCode.type = 'text';
        typeCode.inputMode = 'numeric';
        typeCode.autocomplete = 'off';
        typeCode.maxLength = 9;
        typeCode.placeholder = '123456789';
        typeCode.pattern = '\\d{9}';
        typeCode.dataset.mode = 'student';
    } else if (isGuest) {
        typeLabel.textContent = 'Access Code';
        typeCode.type = 'text';
        typeCode.inputMode = 'text';
        typeCode.autocomplete = 'off';
        typeCode.maxLength = 8;
        typeCode.placeholder = 'EVENT131';
        typeCode.pattern = 'EVENT131';
        typeCode.dataset.mode = 'guest';
    } else {
        typeLabel.textContent = 'Student I#';
        typeCode.removeAttribute('placeholder');
        typeCode.removeAttribute('pattern');
        typeCode.dataset.mode = '';
    }
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(value) {
    const [year, month, day] = value.split('-');
    return `${month}/${day}/${year}`;
}

function renderErrors(messages) {
    if (!messages.length) {
        errorPanel.hidden = true;
        errorPanel.innerHTML = '';
        return;
    }

    errorPanel.hidden = false;
    errorPanel.innerHTML = `<ul>${messages.map((message) => `<li>${message}</li>`).join('')}</ul>`;
}

function renderTicket(data) {
    ticketPanel.hidden = false;
    ticketPanel.innerHTML = `
        <h2>Ticket Created</h2>
        <div class="ticket-details">
            <div class="ticket-row">
                <span class="ticket-label">Name</span>
                <span class="ticket-value">${data.firstName} ${data.lastName}</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Email</span>
                <span class="ticket-value">${data.email}</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Type</span>
                <span class="ticket-value">${data.typeLabel}</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">${data.typeFieldLabel}</span>
                <span class="ticket-value">${data.typeCode}</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Event Date</span>
                <span class="ticket-value">${formatDate(data.eventDate)}</span>
            </div>
        </div>
    `;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const messages = [];
    const firstName = document.querySelector('#first-name').value.trim();
    const lastName = document.querySelector('#last-name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const selectedType = typeSelect.value;
    const selectedDate = eventDate.value;
    const todayString = getLocalDateString(today);

    if (!firstName) {
        messages.push('First name is required.');
    }

    if (!lastName) {
        messages.push('Last name is required.');
    }

    if (!email) {
        messages.push('Email is required.');
    }

    if (!selectedType) {
        messages.push('Please choose a ticket type.');
    }

    if (!selectedDate) {
        messages.push('Please choose an event date.');
    } else if (selectedDate <= todayString) {
        messages.push('The event date must be later than today.');
    }

    let typeFieldLabel = '';
    let typeCodeValue = '';

    if (selectedType === 'student') {
        typeFieldLabel = 'Student I#';
        typeCodeValue = typeCode.value.trim();

        if (!/^\d{9}$/.test(typeCodeValue)) {
            messages.push('Student I# must be 9 digits.');
        }
    }

    if (selectedType === 'guest') {
        typeFieldLabel = 'Access Code';
        typeCodeValue = typeCode.value.trim().toUpperCase();

        if (typeCodeValue !== 'EVENT131') {
            messages.push('Access Code must be EVENT131.');
        }
    }

    if (messages.length) {
        renderErrors(messages);
        ticketPanel.hidden = true;
        return;
    }

    renderErrors([]);
    renderTicket({
        firstName,
        lastName,
        email,
        typeLabel: selectedType === 'student' ? 'Student' : 'Guest',
        typeFieldLabel,
        typeCode: selectedType === 'guest' ? typeCodeValue : typeCodeValue,
        eventDate: selectedDate,
    });
});

typeSelect.addEventListener('change', () => {
    showTypeField(typeSelect.value);
});

typeCode.addEventListener('input', () => {
    if (typeCode.dataset.mode === 'guest') {
        typeCode.value = typeCode.value.toUpperCase();
    }
});

showTypeField(typeSelect.value);
