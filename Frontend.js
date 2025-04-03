const API_URL = 'http://localhost:5000/api'; // Adjust if necessary

async function login() {
    const reg_no = document.getElementById('reg_no').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reg_no, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('request-form').style.display = 'block';
        fetchRequests();
    } else {
        alert('Login failed. Please check your credentials.');
    }
}

async function submitRequest() {
    const type_of_work = document.getElementById('type_of_work').value;
    const suggestions = document.getElementById('suggestions').value;
    const comments = document.getElementById('comments').value;
    const proof = document.getElementById('proof').files[0];

    const formData = new FormData();
    formData.append('type_of_work', type_of_work);
    formData.append('suggestions', suggestions);
    formData.append('comments', comments);
    if (proof) {
        formData.append('proof', proof);
    }

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
            'x-access-token': token
        },
        body: formData
    });

    if (response.ok) {
        alert('Request submitted successfully.');
        fetchRequests();
    } else {
        alert('Failed to submit request.');
    }
}

async function fetchRequests() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/requests`, {
        method: 'GET',
        headers: {
            'x-access-token': token
        }
    });

    if (response.ok) {
        const requests = await response.json();
        const requestsList = document.getElementById('requests');
        requestsList.innerHTML = '';

        requests.forEach(request => {
            const li = document.createElement('li');
            li.textContent = `Type: ${request.type_of_work}, Status: ${request.status}`;
            requestsList.appendChild(li);
        });

        document.getElementById('requests-list').style.display = 'block';
    } else {
        alert('Failed to fetch requests.');
    }
}