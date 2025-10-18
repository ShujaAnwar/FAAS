// Reports functions
function generateReport() {
    const reportTypeValue = reportType.value;
    const employeeId = reportEmployeeSelect.value;
    const campus = reportCampusSelect.value;
    const month = reportMonthSelect.value;

    if (!month && reportTypeValue !== 'credentials' && reportTypeValue !== 'leaves') {
        alert('Please select a month');
        return;
    }

    let reportData = [];
    let title = '';

    // Filter employees based on campus selection
    let employeesToReport = employees;
    if (campus !== 'all') {
        employeesToReport = employees.filter(emp => emp.campus === campus);
    }

    // Filter employees based on employee selection
    if (employeeId !== 'all') {
        employeesToReport = employeesToReport.filter(emp => emp.id === employeeId);
    }

    if (reportTypeValue === 'attendance') {
        title = `Attendance Summary Report - ${month}`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }
        if (employeeId !== 'all') {
            const employee = employees.find(emp => emp.id === employeeId);
            title += ` - ${employee.name}`;
        }

        employeesToReport.forEach(employee => {
            const employeeReport = generateEmployeeReport(employee, month);
            reportData.push(employeeReport);
        });
    } else if (reportTypeValue === 'late') {
        title = `Late Arrivals Report - ${month}`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }

        employeesToReport.forEach(employee => {
            const monthAttendance = employee.attendance.filter(record => 
                record.date.startsWith(month) && record.status === 'late'
            );

            if (monthAttendance.length > 0) {
                const totalLateHours = monthAttendance.reduce((sum, record) => sum + record.lateHours, 0);
                reportData.push({
                    employee: employee,
                    lateDays: monthAttendance.length,
                    totalLateHours: parseFloat(totalLateHours.toFixed(2)),
                    attendance: monthAttendance
                });
            }
        });

        // Sort by late days (descending)
        reportData.sort((a, b) => b.lateDays - a.lateDays);
    } else if (reportTypeValue === 'overtime') {
        title = `Overtime Report - ${month}`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }

        employeesToReport.forEach(employee => {
            const monthAttendance = employee.attendance.filter(record => 
                record.date.startsWith(month)
            );

            const totalOvertime = monthAttendance.reduce((sum, record) => sum + record.overtime, 0);

            if (totalOvertime > 0) {
                reportData.push({
                    employee: employee,
                    totalOvertime: parseFloat(totalOvertime.toFixed(2)),
                    overtimeDays: monthAttendance.filter(record => record.overtime > 0).length
                });
            }
        });

        // Sort by overtime (descending)
        reportData.sort((a, b) => b.totalOvertime - a.totalOvertime);
    } else if (reportTypeValue === 'campus') {
        title = `Campus-wise Report - ${month}`;

        // Group by campus
        const campusData = {
            main: { employees: [], present: 0, late: 0, absent: 0 },
            johar: { employees: [], present: 0, late: 0, absent: 0 },
            masjid: { employees: [], present: 0, late: 0, absent: 0 },
            maktab: { employees: [], present: 0, late: 0, absent: 0 }
        };

        employeesToReport.forEach(employee => {
            const monthAttendance = employee.attendance.filter(record => 
                record.date.startsWith(month)
            );

            const presentDays = monthAttendance.filter(record => 
                record.status === 'present' || record.status === 'late'
            ).length;

            const lateDays = monthAttendance.filter(record => 
                record.status === 'late'
            ).length;

            const absentDays = monthAttendance.filter(record => 
                record.status === 'absent'
            ).length;

            campusData[employee.campus].employees.push(employee);
            campusData[employee.campus].present += presentDays;
            campusData[employee.campus].late += lateDays;
            campusData[employee.campus].absent += absentDays;
        });

        reportData = campusData;
    } else if (reportTypeValue === 'employee') {
        title = `Employee Performance Report - ${month}`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }

        employeesToReport.forEach(employee => {
            const employeeReport = generateEmployeeReport(employee, month);
            reportData.push(employeeReport);
        });

        // Sort by on-time percentage (descending)
        reportData.sort((a, b) => b.onTimePercentage - a.onTimePercentage);
    } else if (reportTypeValue === 'detailed') {
        title = `Detailed Attendance Report - ${month}`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }
        if (employeeId !== 'all') {
            const employee = employees.find(emp => emp.id === employeeId);
            title += ` - ${employee.name}`;
        }

        employeesToReport.forEach(employee => {
            const monthAttendance = employee.attendance.filter(record => 
                record.date.startsWith(month)
            );

            reportData.push({
                employee: employee,
                attendance: monthAttendance
            });
        });
    } else if (reportTypeValue === 'leaves') {
        title = `Leaves Report`;
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }
        if (employeeId !== 'all') {
            const employee = employees.find(emp => emp.id === employeeId);
            title += ` - ${employee.name}`;
        }

        employeesToReport.forEach(employee => {
            const annualTotal = employee.leaves.annual.total;
            const annualUsed = employee.leaves.annual.used;
            const annualBal = annualTotal - annualUsed;

            const casualTotal = employee.leaves.casual.total;
            const casualUsed = employee.leaves.casual.used;
            const casualBal = casualTotal - casualUsed;

            const medicalTotal = employee.leaves.medical.total;
            const medicalUsed = employee.leaves.medical.used;
            const medicalBal = medicalTotal - medicalUsed;

            const totalLeaves = annualTotal + casualTotal + medicalTotal;
            const totalAvailed = annualUsed + casualUsed + medicalUsed;
            const totalRemaining = annualBal + casualBal + medicalBal;

            reportData.push({
                employee: employee,
                annualTotal,
                annualUsed,
                annualBal,
                casualTotal,
                casualUsed,
                casualBal,
                medicalTotal,
                medicalUsed,
                medicalBal,
                totalLeaves,
                totalAvailed,
                totalRemaining
            });
        });
    } else if (reportTypeValue === 'credentials') {
        title = 'Employee Credentials Report';
        if (campus !== 'all') {
            title += ` - ${campuses[campus]}`;
        }
        if (employeeId !== 'all') {
            const employee = employees.find(emp => emp.id === employeeId);
            title += ` - ${employee.name}`;
        }

        employeesToReport.forEach(employee => {
            reportData.push({
                employee: employee,
                username: employee.username,
                password: employee.password,
                campus: campuses[employee.campus]
            });
        });
    }

    // Display report
    reportTitle.textContent = title;
    reportContent.innerHTML = generateReportHTML(reportData, reportTypeValue, employeeId === 'all');
    reportOutput.style.display = 'block';
}

function generateEmployeeReport(employee, month) {
    const monthAttendance = employee.attendance.filter(record => 
        record.date.startsWith(month)
    );

    const presentDays = monthAttendance.filter(record => 
        record.status === 'present' || record.status === 'late'
    ).length;

    const absentDays = monthAttendance.filter(record => 
        record.status === 'absent'
    ).length;

    const lateDays = monthAttendance.filter(record => 
        record.status === 'late'
    ).length;

    const holidayDays = monthAttendance.filter(record => 
        record.status === 'holiday'
    ).length;

    const totalLateHours = monthAttendance.reduce((sum, record) => 
        sum + record.lateHours, 0
    );

    const totalOvertime = monthAttendance.reduce((sum, record) => 
        sum + record.overtime, 0
    );

    const onTimePercentage = presentDays > 0 ? 
        ((presentDays - lateDays) / presentDays * 100).toFixed(1) : 0;

    return {
        employee: employee,
        presentDays,
        absentDays,
        lateDays,
        holidayDays,
        totalLateHours: parseFloat(totalLateHours.toFixed(2)),
        totalOvertime: parseFloat(totalOvertime.toFixed(2)),
        onTimePercentage,
        attendance: monthAttendance
    };
}

function generateReportHTML(reportData, reportType, isAllEmployees) {
    if (reportType === 'attendance') {
        if (isAllEmployees) {
            let html = `
                <table style="width: 100%; margin-bottom: 20px;">
                    <thead>
                        <tr>
                            <th>Campus</th>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Present Days</th>
                            <th>Absent Days</th>
                            <th>Late Days</th>
                            <th>Total Late Hours</th>
                            <th>Total Overtime</th>
                            <th>On Time %</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            reportData.forEach(data => {
                html += `
                    <tr>
                        <td><span class="campus-badge campus-${data.employee.campus}">${campuses[data.employee.campus]}</span></td>
                        <td>${data.employee.id}</td>
                        <td>${data.employee.name}</td>
                        <td>${data.presentDays}</td>
                        <td>${data.absentDays}</td>
                        <td>${data.lateDays}</td>
                        <td>${data.totalLateHours}</td>
                        <td>${data.totalOvertime}</td>
                        <td>${data.onTimePercentage}%</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;

            return html;
        } else {
            const data = reportData[0];
            let html = `
                <div style="margin-bottom: 20px;">
                    <p><strong>Employee ID:</strong> ${data.employee.id}</p>
                    <p><strong>Name:</strong> ${data.employee.name}</p>
                    <p><strong>Designation:</strong> ${data.employee.designation}</p>
                    <p><strong>Campus:</strong> ${campuses[data.employee.campus]}</p>
                    <p><strong>Shift:</strong> ${data.employee.shiftStart} - ${data.employee.shiftEnd}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="color: var(--primary); margin-bottom: 5px;">${data.presentDays}</h4>
                        <p style="font-size: 0.9rem; color: var(--gray);">Present Days</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="color: var(--danger); margin-bottom: 5px;">${data.absentDays}</h4>
                        <p style="font-size: 0.9rem; color: var(--gray);">Absent Days</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="color: var(--warning); margin-bottom: 5px;">${data.lateDays}</h4>
                        <p style="font-size: 0.9rem; color: var(--gray);">Late Days</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                        <h4 style="color: ${data.onTimePercentage >= 80 ? 'var(--success)' : data.onTimePercentage >= 60 ? 'var(--warning)' : 'var(--danger)'}; margin-bottom: 5px;">${data.onTimePercentage}%</h4>
                        <p style="font-size: 0.9rem; color: var(--gray);">On Time</p>
                    </div>
                </div>
            `;

            return html;
        }
    }
    // ... Add other report types (similar to your original code)
    return '<p>Report type not supported.</p>';
}

function printReport() {
    if (reportOutput.style.display === 'none') {
        alert('Please generate a report first');
        return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${reportTitle.textContent}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .campus-badge { padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.8rem; }
                .campus-main { background-color: #3498db; }
                .campus-johar { background-color: #9b59b6; }
                .campus-masjid { background-color: #e74c3c; }
                .campus-maktab { background-color: #f39c12; }
                .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
                .status-on-time { background-color: rgba(46, 204, 113, 0.2); color: #27ae60; }
                .status-late { background-color: rgba(243, 156, 18, 0.2); color: #d35400; }
                .status-absent { background-color: rgba(231, 76, 60, 0.2); color: #c0392b; }
            </style>
        </head>
        <body>
            <h1>${reportTitle.textContent}</h1>
            ${reportContent.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function exportPdf() {
    if (reportOutput.style.display === 'none') {
        alert('Please generate a report first');
        return;
    }

    try {
        // Use jsPDF to generate PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text(reportTitle.textContent, 14, 15);

        // Get report content as HTML table
        const reportTable = reportContent.querySelector('table');

        if (reportTable) {
            // Use autoTable plugin to add table to PDF
            doc.autoTable({
                html: reportTable,
                startY: 25,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [52, 152, 219] }
            });
        } else {
            // If no table, add text content
            const textContent = reportContent.textContent;
            const lines = doc.splitTextToSize(textContent, 180);
            doc.text(lines, 14, 25);
        }

        // Save the PDF
        doc.save(`${reportTitle.textContent}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try printing the report instead.');
    }
}