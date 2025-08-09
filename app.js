const rules = {
  "In Progress": { maxCards: 3 },
  "Done": { checklistRequired: true },
  "Review": { autoAssign: "Reviewer A" }
};

let dragged = null;

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const text = document.getElementById("taskText").value.trim();
  const hasChecklist = document.getElementById("hasChecklist").checked;

  if (text) {
    const card = createCard(text, hasChecklist);
    document.querySelector('[data-column="Todo"]').appendChild(card);
    document.getElementById("taskText").value = "";
    document.getElementById("hasChecklist").checked = false;
  }
});

function createCard(text, hasChecklist) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = text;
  if (hasChecklist) {
    card.dataset.checklist = "true";
  }
  card.draggable = true;

  card.addEventListener("dragstart", () => dragged = card);
  return card;
}

document.querySelectorAll(".column").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", () => {
    const colName = col.dataset.column;
    if (checkRules(colName)) {
      col.appendChild(dragged);

      // Auto-assign in Review
      if (rules[colName]?.autoAssign) {
        let label = document.createElement("div");
        label.className = "reviewer";
        label.textContent = `Assigned to: ${rules[colName].autoAssign}`;
        dragged.appendChild(label);
      }
    } else {
      alert("Rule violated!");
    }
  });
});

function checkRules(colName) {
  const col = document.querySelector(`[data-column="${colName}"]`);
  const count = col.querySelectorAll(".card").length;

  // Max cards rule
  if (rules[colName]?.maxCards && count >= rules[colName].maxCards) {
    return false;
  }

  // Checklist rule for Done
  if (colName === "Done" && rules[colName]?.checklistRequired) {
    if (!dragged.dataset.checklist) {
      return false;
    }
  }

  return true;
}
