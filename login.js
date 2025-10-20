// Login Page JavaScript - Updated for admin dashboard

document.addEventListener('DOMContentLoaded', function () {
    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin.html';
        return;
    }

    // Set up login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store login status in localStorage
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            errorDiv.textContent = data.message || 'Invalid username or password';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Login failed. Please try again.';
        errorDiv.style.display = 'block';
    }
}