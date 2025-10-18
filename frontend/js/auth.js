// Authentication functions
async function handleLogin(e) {
  e.preventDefault();
  loadingSpinner.classList.add('active');

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const campus = document.getElementById('campus').value;
  const remember = rememberPassword.checked;

  try {
    const result = await ApiService.login(username, password, campus);
    
    if (result.success) {
      currentUser = result.user;

      // Save credentials if remember me is checked
      if (remember) {
        localStorage.setItem('savedUsername', username);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }

      // Persist login info
      localStorage.setItem('loggedInUsername', username);
      localStorage.setItem('loggedInType', result.user.type);
      localStorage.setItem('loggedInCampus', campus);

      // Update UI with user info
      loggedInUser.textContent = result.user.name;
      loggedInCampus.textContent = campuses[result.user.campus];
      loggedInCampus.className = 'campus-badge campus-' + result.user.campus;

      // Redirect based on user type
      if (result.user.type === 'employee') {
        // Show employee portal
        adminTabs.style.display = 'none';
        employeeTabs.style.display = 'flex';
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById('attendance-tab').classList.add('active');
        updateEmployeeDetails(result.user);
        initializeEmployeePortal();
      } else {
        // Show admin portal
        adminTabs.style.display = 'flex';
        employeeTabs.style.display = 'none';
        if (result.user.role === 'admin' || result.user.role === 'mudeer') {
          adminTab.style.display = 'block';
        } else {
          adminTab.style.display = 'none';
        }
        leaveManagementTab.style.display = 'block';
        initializeApplication();
      }

      // Show application, hide login
      loginSection.style.display = 'none';
      appContainer.style.display = 'block';
    } else {
      alert(result.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message || 'Login failed. Please check your connection and try again.');
  }
  
  loadingSpinner.classList.remove('active');
}

function handleLogout() {
  // Call backend logout if needed
  ApiService.logout();
  
  currentUser = null;
  localStorage.removeItem('loggedInUsername');
  localStorage.removeItem('loggedInType');
  localStorage.removeItem('loggedInCampus');
  appContainer.style.display = 'none';
  loginSection.style.display = 'flex';
  loginForm.reset();
}