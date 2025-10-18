// Dashboard functions
async function initializeApplication() {
  try {
    // Load employees from API
    employees = await ApiService.getEmployees();
    
    // Load employee dropdowns
    populateEmployeeDropdowns();

    // Load employee table
    renderEmployeeTable();

    // Update dashboard
    updateDashboard();

    // Load manual attendance
    loadManualAttendance();

    // If user is from main campus, show all data, otherwise filter by campus
    if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
      // For non-main campuses, filter data to show only their campus
      document.getElementById('report-campus-select').value = currentUser.campus;
      document.getElementById('employee-campus').value = currentUser.campus;

      // Disable campus selection in reports for non-main campuses
      document.getElementById('report-campus-select').disabled = true;
      document.getElementById('employee-campus').disabled = true;
    } else {
      // Enable campus selection for main campus and admin
      document.getElementById('report-campus-select').disabled = false;
      document.getElementById('employee-campus').disabled = false;
    }
  } catch (error) {
    console.error('Error initializing application:', error);
    alert('Error loading application data. Please refresh the page.');
  }
}

function updateDashboard() {
  // Update campus stats
  updateCampusStats();

  // Update charts
  updateCharts();

  // Update attendance details
  updateAttendanceDetails();
}

function updateCampusStats() {
  const selectedDate = dashboardDateSelect.value || getCurrentDate();

  let employeesToCheck = employees;
  if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
    employeesToCheck = employees.filter(emp => emp.campus === currentUser.campus);
  }

  const campusStats = {
    main: { total: 0, present: 0, late: 0 },
    johar: { total: 0, present: 0, late: 0 },
    masjid: { total: 0, present: 0, late: 0 },
    maktab: { total: 0, present: 0, late: 0 }
  };

  let totalPresent = 0;
  let totalLate = 0;

  employeesToCheck.forEach(employee => {
    campusStats[employee.campus].total++;
    const dateRecord = employee.attendance.find(record => record.date === selectedDate);
    if (dateRecord && (dateRecord.status === 'present' || dateRecord.status === 'late')) {
      campusStats[employee.campus].present++;
      totalPresent++;
      if (dateRecord.status === 'late') {
        campusStats[employee.campus].late++;
        totalLate++;
      }
    }
  });

  // Update with stylish HTML
  mainCampusStats.innerHTML = `
    <span class="stat-sub-label">Total:</span> <span class="stat-sub-value">${campusStats.main.total}</span><br>
    <span class="stat-sub-label">Present:</span> <span class="stat-sub-value present-value">${campusStats.main.present}</span><br>
    <span class="stat-sub-label">Late:</span> <span class="stat-sub-value late-value">${campusStats.main.late}</span>
  `;
  joharCampusStats.innerHTML = `
    <span class="stat-sub-label">Total:</span> <span class="stat-sub-value">${campusStats.johar.total}</span><br>
    <span class="stat-sub-label">Present:</span> <span class="stat-sub-value present-value">${campusStats.johar.present}</span><br>
    <span class="stat-sub-label">Late:</span> <span class="stat-sub-value late-value">${campusStats.johar.late}</span>
  `;
  masjidCampusStats.innerHTML = `
    <span class="stat-sub-label">Total:</span> <span class="stat-sub-value">${campusStats.masjid.total}</span><br>
    <span class="stat-sub-label">Present:</span> <span class="stat-sub-value present-value">${campusStats.masjid.present}</span><br>
    <span class="stat-sub-label">Late:</span> <span class="stat-sub-value late-value">${campusStats.masjid.late}</span>
  `;
  maktabCampusStats.innerHTML = `
    <span class="stat-sub-label">Total:</span> <span class="stat-sub-value">${campusStats.maktab.total}</span><br>
    <span class="stat-sub-label">Present:</span> <span class="stat-sub-value present-value">${campusStats.maktab.present}</span><br>
    <span class="stat-sub-label">Late:</span> <span class="stat-sub-value late-value">${campusStats.maktab.late}</span>
  `;

  totalPresentToday.textContent = totalPresent;
  totalLateToday.textContent = totalLate;
}

// Add other dashboard functions (updateCharts, updateAttendanceDetails, etc.) here...