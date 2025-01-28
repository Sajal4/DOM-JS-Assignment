document.addEventListener("DOMContentLoaded", function () {
  const studentForm = document.getElementById("studentForm");
  const studentTable = document.getElementById("studentTable");

  function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    studentTable.innerHTML = "";
    students.forEach((student, index) => addStudentToTable(student, index));
  }

  function addStudentToTable(student, index) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.id}</td>
        <td>${student.class}</td>
        <td>${student.roll}</td>
        <td class="actions">
          <button class="edit" onclick="editStudent(${index})">Edit</button>
          <button class="delete" onclick="deleteStudent(${index})">Delete</button>
        </td>
      `;
    studentTable.appendChild(row);
  }

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const id = document.getElementById("studentID").value.trim();
    const studentClass = document.getElementById("class").value.trim();
    const roll = document.getElementById("roll").value.trim();

    if (!name || !id || !studentClass || !roll) {
      alert("All fields are required!");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(name)) {
      alert("Student name must contain only letters.");
      return;
    }
    if (!/^[0-9]+$/.test(id) || !/^[0-9]+$/.test(roll)) {
      alert("Student ID and Roll No. must be numeric.");
      return;
    }

    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.push({ name, id, class: studentClass, roll });
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
    studentForm.reset();
  });

  window.editStudent = function (index) {
    const students = JSON.parse(localStorage.getItem("students"));
    const student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("studentID").value = student.id;
    document.getElementById("class").value = student.class;
    document.getElementById("roll").value = student.roll;
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    loadStudents();
  };

  window.deleteStudent = function (index) {
    if (confirm("Are you sure, you want to delete this student?")) {
      const students = JSON.parse(localStorage.getItem("students"));
      students.splice(index, 1);
      localStorage.setItem("students", JSON.stringify(students));
      loadStudents();
    }
  };

  loadStudents();
});
