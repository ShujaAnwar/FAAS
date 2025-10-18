// Employee management functions
async function handleEmployeeFormSubmit(e) {
  e.preventDefault();

  const employeeId = document.getElementById('employee-id').value;
  const name = document.getElementById('employee-name').value;
  const designation = document.getElementById('employee-designation').value;
  const campus = document.getElementById('employee-campus').value;
  const status = document.getElementById('employee-status').value;
  const shiftStart = document.getElementById('shift-start').value;
  const shiftEnd = document.getElementById('shift-end').value;
  const username = document.getElementById('employee-username').value;
  const password = document.getElementById('employee-password').value;

  try {
    const employeeData = {
      id: employeeId || generateEmployeeId(campus),
      name,
      designation,
      department: 'General',
      campus,
      status,
      shiftStart,
      shiftEnd,
      username,
      password: password || 'abc123',
      attendance: [],
      leaves: { annual: { total: 20, used: 0 }, casual: { total: 10, used: 0 }, medical: { total: 15, used: 0 } },
      leaveRequests: [],
      performanceReviews: []
    };

    await ApiService.saveEmployee(employeeData);
    
    // Refresh data
    employees = await ApiService.getEmployees();
    
    // Reset form and refresh tables
    resetEmployeeForm();
    renderEmployeeTable();
    populateEmployeeDropdowns();
    updateDashboard();

    // Show success message
    alert('Employee saved successfully!');
  } catch (error) {
    console.error('Error saving employee:', error);
    alert('Error saving employee. Please try again.');
  }
}

async function deleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    try {
      await ApiService.deleteEmployee(id);
      employees = await ApiService.getEmployees();
      renderEmployeeTable();
      populateEmployeeDropdowns();
      updateDashboard();

      // If we were editing this employee, reset the form
      if (document.getElementById('employee-id').value === id) {
        resetEmployeeForm();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee. Please try again.');
    }
  }
}

function editEmployee(id) {
  const employee = employees.find(emp => emp.id === id);
  if (employee) {
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('employee-name').value = employee.name;
    document.getElementById('employee-designation').value = employee.designation;
    document.getElementById('employee-campus').value = employee.campus;
    document.getElementById('employee-status').value = employee.status || 'full_time';
    document.getElementById('shift-start').value = employee.shiftStart;
    document.getElementById('shift-end').value = employee.shiftEnd;
    document.getElementById('employee-username').value = employee.username;
    document.getElementById('employee-password').value = '';
  }
}

function resetEmployeeForm() {
  employeeForm.reset();
  document.getElementById('employee-id').value = '';

  // Set campus to current user's campus if not main campus or admin
  if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
    document.getElementById('employee-campus').value = currentUser.campus;
  }
}

function handleEmployeeSearch() {
  const searchTerm = employeeSearch.value.toLowerCase();

  if (searchTerm === '') {
    renderEmployeeTable();
    return;
  }

  let filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm) || 
    employee.id.toLowerCase().includes(searchTerm)
  );

  // Filter by campus if user is not from main campus or admin
  if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
    filteredEmployees = filteredEmployees.filter(emp => emp.campus === currentUser.campus);
  }

  renderEmployeeTable(filteredEmployees);
}

function renderEmployeeTable(filteredEmployees = null) {
  let employeesToRender = filteredEmployees || employees;

  // Filter employees by campus if user is not from main campus or admin
  if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
    employeesToRender = employeesToRender.filter(emp => emp.campus === currentUser.campus);
  }

  employeeTableBody.innerHTML = '';

  if (employeesToRender.length === 0) {
    employeeTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <i class="fas fa-users"></i>
          <p>No employees found</p>
        </td>
      </tr>
    `;
    return;
  }

  employeesToRender.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.id}</td>
      <td>${employee.name}</td>
      <td>${employee.designation}</td>
      <td><span class="campus-badge campus-${employee.campus}">${campuses[employee.campus]}</span></td>
      <td>${employee.shiftStart}</td>
      <td>${employee.shiftEnd}</td>
      <td>${employee.status === 'full_time' ? 'Full Time' : 'Part Time'}</td>
      <td>
        <button class="btn btn-warning edit-btn" data-id="${employee.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger delete-btn" data-id="${employee.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    employeeTableBody.appendChild(row);
  });

  // Add event listeners to edit and delete buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const employeeId = this.getAttribute('data-id');
      editEmployee(employeeId);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const employeeId = this.getAttribute('data-id');
      deleteEmployee(employeeId);
    });
  });
}

function populateEmployeeDropdowns() {
  reportEmployeeSelect.innerHTML = '<option value="all">All Employees</option>';
  const singleSelect = document.getElementById('single-employee-select');
  singleSelect.innerHTML = '<option value="">-- Select Employee --</option>';

  // Filter employees by campus if user is not from main campus or admin
  let employeesToShow = employees;
  if (currentUser.campus !== 'main' && currentUser.role !== 'admin' && currentUser.role !== 'mudeer') {
    employeesToShow = employees.filter(emp => emp.campus === currentUser.campus);
  }

  employeesToShow.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.id;
    option.textContent = `${employee.name} (${employee.id})`;
    reportEmployeeSelect.appendChild(option);

    const option2 = document.createElement('option');
    option2.value = employee.id;
    option2.textContent = `${employee.name} (${employee.id})`;
    singleSelect.appendChild(option2);
  });
}