const dayOrder = ["月", "火", "水", "木", "金"];
let classes = JSON.parse(localStorage.getItem("classes")) || [];

window.onload = function () {
  classes.sort(compareByDayAndPeriod);
  classes.forEach(c => addClassToDOM(c));
};

document.getElementById("classForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("className").value.trim();
  const max = parseInt(document.getElementById("maxAbsence").value);
  const take = document.getElementById("takeAttendance").checked;
  const day = document.getElementById("dayOfWeek").value;
  const period = document.getElementById("period").value;

  if (!name || isNaN(max) || !day || !period) return;

  const newClass = {
    name: name,
    absence: 0,
    maxAbsence: max,
    takeAttendance: take,
    dayOfWeek: day,
    period: period
  };

  classes.push(newClass);
  localStorage.setItem("classes", JSON.stringify(classes));

  // 表示を再構築
  document.getElementById("classList").innerHTML = "";
  classes.sort(compareByDayAndPeriod);
  classes.forEach(c => addClassToDOM(c));

  this.reset();
});

function addClassToDOM(classData) {
  const div = document.createElement("div");
  div.className = "class-item";
  div.dataset.name = classData.name;

  div.innerHTML = `
    <h2>${classData.name}</h2>
    <p>曜日・時限: ${classData.dayOfWeek}曜日・${classData.period}限</p>
    <p>欠席回数: <span class="absence-count">${classData.absence}</span></p>
    <p>欠席上限: ${classData.maxAbsence}</p>
    <p>出席を取る: ${classData.takeAttendance ? "はい" : "いいえ"}</p>
    <button onclick="increaseAbsence(this)">欠席する</button>
    <button onclick="resetAbsence(this)">リセット</button>
    <button onclick="deleteClass(this)">削除</button>
  `;

  document.getElementById("classList").appendChild(div);
}

function increaseAbsence(button) {
  const div = button.parentElement;
  const name = div.dataset.name;
  const countSpan = div.querySelector(".absence-count");

  let classData = classes.find(c => c.name === name);
  if (!classData) return;

  classData.absence++;

  if (classData.absence > classData.maxAbsence) {
    alert(`${classData.name} の欠席が上限を超えました！`);
  }

  countSpan.textContent = classData.absence;
  localStorage.setItem("classes", JSON.stringify(classes));
}

function resetAbsence(button) {
  const div = button.parentElement;
  const name = div.dataset.name;
  const countSpan = div.querySelector(".absence-count");

  let classData = classes.find(c => c.name === name);
  if (!classData) return;

  classData.absence = 0;
  countSpan.textContent = "0";
  localStorage.setItem("classes", JSON.stringify(classes));
}

function deleteClass(button) {
  const div = button.parentElement;
  const name = div.dataset.name;

  div.remove();
  classes = classes.filter(c => c.name !== name);
  localStorage.setItem("classes", JSON.stringify(classes));
}

function compareByDayAndPeriod(a, b) {
  const dayDiff = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
  if (dayDiff !== 0) return dayDiff;
  return parseInt(a.period) - parseInt(b.period);
}
