// User management functions
async function loadUserManagement() {
    try {
        const users = await ApiService.getUsers();
        userManagementTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td><span class="campus-badge campus-${user.campus}">${campuses[user.campus]}</span></td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-warning edit-user-btn" data-username="${user.username}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-info reset-password-btn" data-username="${user.username}">
                        <i class="fas fa-key"></i>
                    </button>
                    <button class="btn btn-danger delete-user-btn" data-username="${user.username}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            userManagementTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                editUser(username);
            });
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                deleteUser(username);
            });
        });

        document.querySelectorAll('.reset-password-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                resetUserPassword(username);
            });
        });
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users. Please try again.');
    }
}

async function resetUserPassword(username) {
    if (confirm(`Are you sure you want to reset the password for ${username} to 'abc123'?`)) {
        try {
            const user = await ApiService.getUsers().then(users => 
                users.find(u => u.username === username)
            );
            if (user) {
                user.password = 'abc123';
                await ApiService.saveUser(user);
                alert('Password reset successfully to abc123!');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Error resetting password. Please try again.');
        }
    }
}

async function handleUserFormSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('user-username').value;
    const newUsername = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const name = document.getElementById('new-name').value;
    const campus = document.getElementById('new-campus').value;
    const role = document.getElementById('new-role').value;

    try {
        if (username) {
            // Update existing user
            const userData = {
                username: newUsername,
                name: name,
                campus: campus,
                role: role
            };
            
            if (password) {
                userData.password = password;
            }

            await ApiService.saveUser(userData);
        } else {
            // Add new user
            if (!password) {
                alert('Password is required for new users');
                return;
            }

            const userData = {
                username: newUsername,
                password: password,
                name: name,
                campus: campus,
                role: role
            };

            await ApiService.saveUser(userData);
        }

        // Reset form and refresh table
        resetUserForm();
        await loadUserManagement();

        // Show success message
        alert('User saved successfully!');
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user. Please try again.');
    }
}

function editUser(username) {
    ApiService.getUsers().then(users => {
        const user = users.find(u => u.username === username);
        if (user) {
            document.getElementById('user-username').value = user.username;
            document.getElementById('new-username').value = user.username;
            document.getElementById('new-name').value = user.name;
            document.getElementById('new-campus').value = user.campus;
            document.getElementById('new-role').value = user.role;

            // Clear password field for security
            document.getElementById('new-password').value = '';
        }
    });
}

async function deleteUser(username) {
    if (username === currentUser.username) {
        alert('You cannot delete your own account');
        return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await ApiService.deleteUser(username);
            await loadUserManagement();

            // If we were editing this user, reset the form
            if (document.getElementById('user-username').value === username) {
                resetUserForm();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        }
    }
}

function resetUserForm() {
    userForm.reset();
    document.getElementById('user-username').value = '';
}