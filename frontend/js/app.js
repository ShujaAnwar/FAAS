async function checkBackendConnection() {
    try {
        const health = await ApiService.healthCheck();
        console.log('✅ Backend connection successful:', health);
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        
        // Show connection error to user
        showConnectionError();
        return false;
    }
}

function showConnectionError() {
    const errorHtml = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; background: #e74c3c; color: white; padding: 10px; text-align: center; z-index: 10000;">
            <i class="fas fa-exclamation-triangle"></i>
            Cannot connect to server. Please check if the backend is running.
            <button onclick="retryConnection()" style="margin-left: 20px; background: #c0392b; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                Retry
            </button>
        </div>
    `;
    
    if (!document.getElementById('connection-error')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'connection-error';
        errorDiv.innerHTML = errorHtml;
        document.body.prepend(errorDiv);
    }
}

function hideConnectionError() {
    const errorDiv = document.getElementById('connection-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

async function retryConnection() {
    hideConnectionError();
    await checkBackendConnection();
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Set current date in date selectors
    const now = new Date();
    const currentDate = now.toISOString().substring(0, 10);
    const currentMonth = now.toISOString().substring(0, 7);
    manualAttendanceDate.value = currentDate;
    dashboardDateSelect.value = currentDate;
    reportMonthSelect.value = currentMonth;
    employeeMonthSelect.value = currentMonth;
    removeMonthSelect.value = currentMonth;
    attendanceMonthSelect.value = currentMonth;

    // Start real-time clock
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Check backend connection first
    checkBackendConnection().then(isConnected => {
        if (isConnected) {
            // Check if user credentials are saved
            const savedUsername = localStorage.getItem('savedUsername');
            const savedPassword = localStorage.getItem('savedPassword');

            if (savedUsername && savedPassword) {
                document.getElementById('username').value = savedUsername;
                document.getElementById('password').value = savedPassword;
                rememberPassword.checked = true;
            }

            // Check for persisted login
            const loggedInUsername = localStorage.getItem('loggedInUsername');
            const loggedInType = localStorage.getItem('loggedInType');
            const loggedInCampus = localStorage.getItem('loggedInCampus');

            if (loggedInUsername && loggedInType) {
                // Auto-login will be handled after API integration
                console.log('Auto-login feature available');
            }

            // Check if database needs initialization
            checkDatabaseInitialization();
        }
    });

    // Set up event listeners
    setupEventListeners();
});

// Add database initialization check
async function checkDatabaseInitialization() {
    try {
        const status = await ApiService.getStatus();
        
        if (!status.initialized || status.users === 0) {
            const shouldInitialize = confirm(
                'Database is empty. Would you like to initialize with default users and employees?\n\n' +
                'This will create:\n' +
                '- 5 default admin/users\n' +
                '- Sample employees for all campuses\n' +
                '- Ready-to-use login credentials'
            );
            
            if (shouldInitialize) {
                await initializeDatabase();
            }
        }
    } catch (error) {
        console.error('Error checking database status:', error);
    }
}

async function initializeDatabase() {
    try {
        loadingSpinner.classList.add('active');
        const result = await ApiService.initializeData();
        
        alert(`✅ Database initialized successfully!\n\n` +
              `Users created: ${result.summary.users.total}\n` +
              `Employees created: ${result.summary.employees.total}\n\n` +
              `You can now login with:\n` +
              `• Admin: shuja / password1\n` +
              `• Mudeer: mudeer / mudeer123\n` +
              `• Employee: FAMC1001 / abc123`);
              
    } catch (error) {
        console.error('Initialization failed:', error);
        alert('❌ Database initialization failed: ' + error.message);
    } finally {
        loadingSpinner.classList.remove('active');
    }
}