// Attendance management functions
async function employeeMarkTimeIn() {
  const today = getCurrentDate();
  const currentTime = getCurrentTime();
  const remarks = attendanceRemarks.value;

  try {
    // Find or create today's attendance record
    let record = currentUser.attendance.find(r => r.date === today);
    if (!record) {
      record = {
        date: today,
        timeIn: currentTime,
        timeOut: null,
        lateHours: 0,
        overtime: 0,
        onTime: false,
        status: 'present',
        remarks: remarks
      };
      currentUser.attendance.push(record);
    } else {
      record.timeIn = currentTime;
      record.status = 'present';
      record.remarks = remarks;
    }

    // Calculate if late
    const shiftStartTime = new Date(`2000-01-01T${currentUser.shiftStart}`);
    const timeInTime = new Date(`2000-01-01T${currentTime}`);

    if (timeInTime > shiftStartTime) {
      record.lateHours = (timeInTime - shiftStartTime) / (1000 * 60 * 60);
      record.onTime = false;
      record.status = 'late';
    } else {
      record.lateHours = 0;
      record.onTime = true;
      record.status = 'present';
    }

    // Save to database
    await ApiService.updateAttendance(currentUser.id, record);

    // Update UI
    let message = `<i class="fas fa-check-circle"></i> <strong>Time In recorded successfully at ${currentTime}</strong>`;
    if (record.status === 'present') {
      message += '<br>Great job! You\'re on time today! 👍';
    } else if (record.status === 'late') {
      message += '<br>You\'re a bit late today, but keep up the good work! Tomorrow is a new day! 💪';
    }
    employeeAttendanceStatus.innerHTML = `
      <div class="status-success">
        ${message}
      </div>
    `;
    employeeAttendanceStatus.style.display = 'block';

    // Update button states
    employeeMarkTimeInBtn.disabled = true;
    employeeMarkTimeOutBtn.disabled = false;
    employeeMarkLeaveBtn.disabled = true;

    // Update button styles
    employeeMarkTimeInBtn.classList.remove('btn-success');
    employeeMarkTimeInBtn.classList.add('btn-disabled');
    employeeMarkTimeOutBtn.classList.remove('btn-disabled');
    employeeMarkTimeOutBtn.classList.add('btn-danger');

    updateEmployeeTodaySummary();
    generateEmployeeCalendar(employeeMonthSelect.value);

    // Clear remarks
    attendanceRemarks.value = '';
  } catch (error) {
    console.error('Error marking time in:', error);
    alert('Error recording time in. Please try again.');
  }
}

async function employeeMarkTimeOut() {
  const today = getCurrentDate();
  const currentTime = getCurrentTime();
  const remarks = attendanceRemarks.value;

  try {
    // Find today's attendance record
    const record = currentUser.attendance.find(r => r.date === today);
    if (!record || !record.timeIn) {
      alert('Please mark Time In first');
      return;
    }

    record.timeOut = currentTime;
    if (remarks) {
      record.remarks = remarks;
    }

    // Calculate overtime
    const shiftEndTime = new Date(`2000-01-01T${currentUser.shiftEnd}`);
    const timeOutTime = new Date(`2000-01-01T${currentTime}`);

    if (timeOutTime > shiftEndTime) {
      record.overtime = (timeOutTime - shiftEndTime) / (1000 * 60 * 60);
    } else {
      record.overtime = 0;
    }

    // Save to database
    await ApiService.updateAttendance(currentUser.id, record);

    // Update UI
    employeeAttendanceStatus.innerHTML = `
      <div class="status-success">
        <i class="fas fa-check-circle"></i>
        <strong>Time Out recorded successfully at ${currentTime}</strong>
      </div>
    `;
    employeeAttendanceStatus.style.display = 'block';

    // Update button states
    employeeMarkTimeInBtn.disabled = true;
    employeeMarkTimeOutBtn.disabled = true;
    employeeMarkLeaveBtn.disabled = true;

    // Update button styles
    employeeMarkTimeInBtn.classList.remove('btn-success');
    employeeMarkTimeInBtn.classList.add('btn-disabled');
    employeeMarkTimeOutBtn.classList.remove('btn-danger');
    employeeMarkTimeOutBtn.classList.add('btn-disabled');
    employeeMarkLeaveBtn.classList.remove('btn-warning');
    employeeMarkLeaveBtn.classList.add('btn-disabled');

    updateEmployeeTodaySummary();
    generateEmployeeCalendar(employeeMonthSelect.value);

    // Clear remarks
    attendanceRemarks.value = '';
  } catch (error) {
    console.error('Error marking time out:', error);
    alert('Error recording time out. Please try again.');
  }
}

async function employeeMarkLeave() {
  const today = getCurrentDate();
  const remarks = attendanceRemarks.value;

  try {
    // Find or create today's attendance record
    let record = currentUser.attendance.find(r => r.date === today);
    if (!record) {
      record = {
        date: today,
        timeIn: null,
        timeOut: null,
        lateHours: 0,
        overtime: 0,
        onTime: false,
        status: 'leave',
        remarks: remarks
      };
      currentUser.attendance.push(record);
    } else {
      record.timeIn = null;
      record.timeOut = null;
      record.status = 'leave';
      record.remarks = remarks;
    }

    // Save to database
    await ApiService.updateAttendance(currentUser.id, record);

    // Update UI
    employeeAttendanceStatus.innerHTML = `
      <div class="status-warning">
        <i class="fas fa-calendar-times"></i>
        <strong>Leave marked successfully for today</strong>
      </div>
    `;
    employeeAttendanceStatus.style.display = 'block';

    // Update button states
    employeeMarkTimeInBtn.disabled = true;
    employeeMarkTimeOutBtn.disabled = true;
    employeeMarkLeaveBtn.disabled = true;

    // Update button styles
    employeeMarkTimeInBtn.classList.remove('btn-success');
    employeeMarkTimeInBtn.classList.add('btn-disabled');
    employeeMarkTimeOutBtn.classList.remove('btn-danger');
    employeeMarkTimeOutBtn.classList.add('btn-disabled');
    employeeMarkLeaveBtn.classList.remove('btn-warning');
    employeeMarkLeaveBtn.classList.add('btn-disabled');

    updateEmployeeTodaySummary();
    generateEmployeeCalendar(employeeMonthSelect.value);

    // Clear remarks
    attendanceRemarks.value = '';
  } catch (error) {
    console.error('Error marking leave:', error);
    alert('Error recording leave. Please try again.');
  }
}