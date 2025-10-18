// Utility functions
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatTime(date) {
  return date.toTimeString().substring(0, 5);
}

function getCurrentDate() {
  return formatDate(new Date());
}

function getCurrentTime() {
  return formatTime(new Date());
}

function generateEmployeeId(campus) {
  const campusPrefix = {
    'main': 'FAMC',
    'johar': 'FAJC', 
    'masjid': 'FAMS',
    'maktab': 'FAMT'
  };

  const campusEmployees = employees.filter(emp => emp.campus === campus);
  const nextNumber = campusEmployees.length + 1;
  return `${campusPrefix[campus]}${nextNumber.toString().padStart(4, '0')}`;
}

// Campus data
const campuses = {
  main: "Fiqh Academy - Main Campus",
  johar: "Fiqh Academy - Johar Campus",
  masjid: "Fiqh Academy - Masjid Campus",
  maktab: "Fiqh Academy - Maktab Campus"
};

// Campus colors for charts
const campusColors = {
  main: '#3498db',
  johar: '#9b59b6',
  masjid: '#e74c3c',
  maktab: '#f39c12'
};

// Global variables
let employees = [];
let currentUser = null;