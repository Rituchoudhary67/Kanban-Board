const rules = {
  "In Progress": { maxCards: 3 },
  "Done": { checklistRequired: true },
  "Review": { autoAssign: "Reviewer A" }
};

let dragged = null;

// Add new task
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const text = document.getElementById("taskText").value.trim();
  if (text) {
    const card = createCard(text, true); // always has checklist for simplicity
    document.querySelector('[data-column="Todo"]').appendChild(card);
    document.getElementById("taskText").value = "";
  }
});

// Create a card
function createCard(text, hasChecklist) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;

  const taskSpan = document.createElement("span");
  taskSpan.textContent = text;
  card.appendChild(taskSpan);

  const btns = document.createElement("div");
  btns.className = "card-buttons";

  // Edit
 const editBtn = document.createElement("button");
  editBtn.textContent = "✍";
  editBtn.classList.add("edit-btn");
  editBtn.title = "Edit";
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", taskSpan.textContent);
    if (newText) taskSpan.textContent = newText;
  });

 // Delete button (Red ❌)
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.classList.add("delete-btn");
  removeBtn.title = "Delete";
  removeBtn.addEventListener("click", () => card.remove());

  btns.appendChild(editBtn);
  btns.appendChild(removeBtn);
  card.appendChild(btns);

  if (hasChecklist) card.dataset.checklist = "true";

  card.addEventListener("dragstart", () => dragged = card);
  return card;
}

// Drag and drop
document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", () => {
    const colName = col.dataset.column;
    if (checkRules(colName)) {
      col.appendChild(dragged);
      if (rules[colName]?.autoAssign) {
        const label = document.createElement("div");
        label.className = "reviewer";
        label.textContent = `Assigned to: ${rules[colName].autoAssign}`;
        dragged.appendChild(label);
      }
    } else {
      alert("Rule violated!");
    }
  });
});

// Rules check
function checkRules(colName) {
  const col = document.querySelector(`[data-column="${colName}"]`);
  const count = col.querySelectorAll(".card").length;

  if (rules[colName]?.maxCards && count >= rules[colName].maxCards) return false;
  if (colName === "Done" && rules[colName]?.checklistRequired) {
    if (!dragged.dataset.checklist) return false;
  }
  return true;
}
