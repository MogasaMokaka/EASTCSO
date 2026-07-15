/* ============================================================
   EASTCSO - app.js  (Design 1: Navy & Green Classic)
   JavaScript concepts used (Session 05 lecture only):
   - Variables      : let, const
   - Objects        : key-value pairs { }
   - Arrays         : [], push(), length, indexing [i]
   - Functions      : function keyword
   - Conditionals   : if, else if, else
   - Loops          : for
   - DOM            : getElementById, innerHTML
   - Events         : onclick (in HTML), window.onscroll
   - Timing         : setInterval
   - String methods : trim(), length
   - Input/Output   : alert(), confirm()
   ============================================================ */


/* ─────────────────────────────────────────────────────────
   1. SIDEBAR TOGGLE (Mobile / Tablet)
   Shows and hides the 1fr sidebar on small screens.
   Uses getElementById and className - Session 05
───────────────────────────────────────────────────────── */

/* Open the sidebar - called by the hamburger button onclick */
function toggleSidebar() {
  let sidebar  = document.getElementById("sidebar");
  let overlay  = document.getElementById("sidebar-overlay");
  let toggle   = document.getElementById("nav-toggle");
  let isOpen   = sidebar.className.indexOf("open") !== -1;

  if (isOpen === true) {
    closeSidebar();
  } else {
    sidebar.className = "sidebar open";
    overlay.className = "sidebar-overlay active";
    toggle.className  = "nav-toggle is-active";
    /* Prevent page from scrolling behind sidebar */
    document.body.style.overflow = "hidden";
  }
}

/* Close the sidebar */
function closeSidebar() {
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("sidebar-overlay");
  let toggle  = document.getElementById("nav-toggle");

  sidebar.className = "sidebar";
  overlay.className = "sidebar-overlay";
  toggle.className  = "nav-toggle";
  document.body.style.overflow = "";
}

/* Close sidebar on Escape key */
document.onkeydown = function (e) {
  if (e.key === "Escape") {
    closeSidebar();
  }
};


/* ─────────────────────────────────────────────────────────
   3. EVENTS CRUD
   Arrays, Objects, for loop, if/else, DOM - Session 05
───────────────────────────────────────────────────────── */

/* Array of event objects */
let events = [
  { id: 1, name: "EASTCSO Sports Day",  date: "2026-07-05", venue: "EASTC Grounds", status: "Upcoming" },
  { id: 2, name: "Leadership Forum",    date: "2026-07-12", venue: "Main Hall",      status: "Upcoming" },
  { id: 3, name: "Cultural Week",       date: "2026-08-20", venue: "EASTC Campus",   status: "Upcoming" }
];

let eventIdCounter = 4;
let editingEventId = -1;


/* Helper: format date string nicely */
function formatDate(dateStr) {
  if (dateStr === "") {
    return "N/A";
  }
  let d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}


/* Helper: return coloured status badge HTML */
function getStatusBadge(status) {
  let cls = "badge-upcoming";
  if (status === "Ongoing") {
    cls = "badge-ongoing";
  } else if (status === "Completed") {
    cls = "badge-completed";
  } else if (status === "Cancelled") {
    cls = "badge-cancelled";
  }
  return "<span class='badge " + cls + "'>" + status + "</span>";
}


/* CREATE - Add new event */
function addEvent() {
  let name   = document.getElementById("ev-name").value.trim();
  let date   = document.getElementById("ev-date").value;
  let venue  = document.getElementById("ev-venue").value.trim();
  let status = document.getElementById("ev-status").value;

  /* Validate all fields */
  if (name === "") {
    document.getElementById("ev-error").innerHTML = "Please enter an event name.";
    return;
  }
  if (date === "") {
    document.getElementById("ev-error").innerHTML = "Please select a date.";
    return;
  }
  if (venue === "") {
    document.getElementById("ev-error").innerHTML = "Please enter a venue.";
    return;
  }

  /* Clear error */
  document.getElementById("ev-error").innerHTML = "";

  /* Create event object */
  let newEvent = {
    id:     eventIdCounter,
    name:   name,
    date:   date,
    venue:  venue,
    status: status
  };

  /* Add to events array */
  events.push(newEvent);
  eventIdCounter = eventIdCounter + 1;

  /* Clear form */
  document.getElementById("ev-name").value   = "";
  document.getElementById("ev-date").value   = "";
  document.getElementById("ev-venue").value  = "";
  document.getElementById("ev-status").value = "Upcoming";

  renderEvents();
  updateSidebarEvents();
}


/* READ - Render all events into the table */
function renderEvents() {
  let tbody = document.getElementById("events-tbody");
  let empty = document.getElementById("ev-empty");

  tbody.innerHTML = "";

  if (events.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  /* Loop through events array */
  for (let i = 0; i < events.length; i++) {
    let ev  = events[i];
    let row = "";

    if (editingEventId === ev.id) {

      /* UPDATE mode - inline input fields */
      row += "<tr>";
      row += "<td>" + (i + 1) + "</td>";
      row += "<td><input class='inline-input' id='edit-ev-name-" + ev.id + "' value='" + ev.name + "' /></td>";
      row += "<td><input class='inline-input' type='date' id='edit-ev-date-" + ev.id + "' value='" + ev.date + "' /></td>";
      row += "<td><input class='inline-input' id='edit-ev-venue-" + ev.id + "' value='" + ev.venue + "' /></td>";
      row += "<td>";
      row += "<select class='inline-select' id='edit-ev-status-" + ev.id + "'>";
      row += "<option>Upcoming</option>";
      row += "<option>Ongoing</option>";
      row += "<option>Completed</option>";
      row += "<option>Cancelled</option>";
      row += "</select>";
      row += "</td>";
      row += "<td class='actions'>";
      row += "<button class='btn-save'   onclick='saveEvent(" + ev.id + ")'>Save</button> ";
      row += "<button class='btn-cancel' onclick='cancelEditEvent()'>Cancel</button>";
      row += "</td>";
      row += "</tr>";

    } else {

      /* READ mode - normal display */
      row += "<tr>";
      row += "<td>" + (i + 1) + "</td>";
      row += "<td>" + ev.name + "</td>";
      row += "<td>" + formatDate(ev.date) + "</td>";
      row += "<td>" + ev.venue + "</td>";
      row += "<td>" + getStatusBadge(ev.status) + "</td>";
      row += "<td class='actions'>";
      row += "<button class='btn-edit'   onclick='editEvent(" + ev.id + ")'>Edit</button> ";
      row += "<button class='btn-delete' onclick='deleteEvent(" + ev.id + ")'>Delete</button>";
      row += "</td>";
      row += "</tr>";
    }

    tbody.innerHTML = tbody.innerHTML + row;
  }
}


/* UPDATE - put row into edit mode */
function editEvent(id) {
  editingEventId = id;
  renderEvents();
}


/* UPDATE - save the edited event */
function saveEvent(id) {
  let name   = document.getElementById("edit-ev-name-"   + id).value.trim();
  let date   = document.getElementById("edit-ev-date-"   + id).value;
  let venue  = document.getElementById("edit-ev-venue-"  + id).value.trim();
  let status = document.getElementById("edit-ev-status-" + id).value;

  if (name === "" || date === "" || venue === "") {
    alert("All fields are required to save.");
    return;
  }

  /* Find and update the event in the array */
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === id) {
      events[i].name   = name;
      events[i].date   = date;
      events[i].venue  = venue;
      events[i].status = status;
    }
  }

  editingEventId = -1;
  renderEvents();
  updateSidebarEvents();
}


/* Cancel edit without saving */
function cancelEditEvent() {
  editingEventId = -1;
  renderEvents();
}


/* DELETE - remove event from array */
function deleteEvent(id) {
  let confirmed = confirm("Delete this event? This cannot be undone.");
  if (confirmed === false) {
    return;
  }

  /* Build new array skipping the deleted event */
  let newEvents = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].id !== id) {
      newEvents.push(events[i]);
    }
  }
  events = newEvents;

  if (editingEventId === id) {
    editingEventId = -1;
  }

  renderEvents();
  updateSidebarEvents();
}


/* ─────────────────────────────────────────────────────────
   4. ANNOUNCEMENTS CRUD
───────────────────────────────────────────────────────── */

let announcements = [
  { id: 1, title: "Exam Timetable Released",  body: "Semester 2 exams begin 15 July 2026. Check Moodle for the full schedule and room allocations.", date: "2026-06-24" },
  { id: 2, title: "Library Hours Extended",   body: "The EASTC library will remain open until 10pm Monday to Friday throughout the exam period.",     date: "2026-06-20" },
  { id: 3, title: "Fee Payment Reminder",     body: "All outstanding tuition fees must be cleared by 30 June 2026. Visit accounts office for help.",  date: "2026-06-18" }
];

let annIdCounter = 4;
let editingAnnId = -1;


/* CREATE - post new announcement */
function addAnnouncement() {
  let title = document.getElementById("ann-title").value.trim();
  let body  = document.getElementById("ann-body").value.trim();

  if (title === "") {
    document.getElementById("ann-error").innerHTML = "Please enter a title.";
    return;
  }
  if (body === "") {
    document.getElementById("ann-error").innerHTML = "Please enter a message.";
    return;
  }

  document.getElementById("ann-error").innerHTML = "";

  /* Get today's date */
  let today   = new Date();
  let dateStr = today.toISOString().split("T")[0];

  let newAnn = {
    id:    annIdCounter,
    title: title,
    body:  body,
    date:  dateStr
  };

  announcements.push(newAnn);
  annIdCounter = annIdCounter + 1;

  document.getElementById("ann-title").value = "";
  document.getElementById("ann-body").value  = "";

  renderAnnouncements();
  updateSidebarAnnouncements();
}


/* READ - render announcement cards */
function renderAnnouncements() {
  let container = document.getElementById("ann-cards");
  let empty     = document.getElementById("ann-empty");

  container.innerHTML = "";

  if (announcements.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  /* Loop newest first */
  for (let i = announcements.length - 1; i >= 0; i--) {
    let ann  = announcements[i];
    let card = "";

    if (editingAnnId === ann.id) {

      /* UPDATE mode - editable card */
      card += "<div class='ann-card'>";
      card += "<div class='form-group'>";
      card += "<label>Title</label>";
      card += "<input type='text' id='edit-ann-title-" + ann.id + "' value='" + ann.title + "' />";
      card += "</div>";
      card += "<div class='form-group'>";
      card += "<label>Message</label>";
      card += "<textarea id='edit-ann-body-" + ann.id + "' rows='3'>" + ann.body + "</textarea>";
      card += "</div>";
      card += "<div class='ann-actions'>";
      card += "<button class='btn-save'   onclick='saveAnnouncement(" + ann.id + ")'>Save</button> ";
      card += "<button class='btn-cancel' onclick='cancelEditAnn()'>Cancel</button>";
      card += "</div>";
      card += "</div>";

    } else {

      /* READ mode */
      card += "<div class='ann-card'>";
      card += "<div class='ann-title'>" + ann.title + "</div>";
      card += "<div class='ann-body'>"  + ann.body  + "</div>";
      card += "<div class='ann-date'>Posted: " + formatDate(ann.date) + "</div>";
      card += "<div class='ann-actions'>";
      card += "<button class='btn-edit'   onclick='editAnnouncement(" + ann.id + ")'>Edit</button> ";
      card += "<button class='btn-delete' onclick='deleteAnnouncement(" + ann.id + ")'>Delete</button>";
      card += "</div>";
      card += "</div>";
    }

    container.innerHTML = container.innerHTML + card;
  }
}


/* UPDATE - put card into edit mode */
function editAnnouncement(id) {
  editingAnnId = id;
  renderAnnouncements();
}


/* UPDATE - save edited announcement */
function saveAnnouncement(id) {
  let title = document.getElementById("edit-ann-title-" + id).value.trim();
  let body  = document.getElementById("edit-ann-body-"  + id).value.trim();

  if (title === "" || body === "") {
    alert("Both title and message are required.");
    return;
  }

  for (let i = 0; i < announcements.length; i++) {
    if (announcements[i].id === id) {
      announcements[i].title = title;
      announcements[i].body  = body;
    }
  }

  editingAnnId = -1;
  renderAnnouncements();
  updateSidebarAnnouncements();
}


/* Cancel ann edit */
function cancelEditAnn() {
  editingAnnId = -1;
  renderAnnouncements();
}


/* DELETE - remove announcement */
function deleteAnnouncement(id) {
  let confirmed = confirm("Delete this announcement?");
  if (confirmed === false) {
    return;
  }

  let newList = [];
  for (let i = 0; i < announcements.length; i++) {
    if (announcements[i].id !== id) {
      newList.push(announcements[i]);
    }
  }
  announcements = newList;

  if (editingAnnId === id) {
    editingAnnId = -1;
  }

  renderAnnouncements();
  updateSidebarAnnouncements();
}


/* ─────────────────────────────────────────────────────────
   5. CONTACT FORM VALIDATION
   if/else, getElementById, innerHTML - Session 05
───────────────────────────────────────────────────────── */

function submitContact() {
  document.getElementById("ct-error").innerHTML   = "";
  document.getElementById("ct-success").innerHTML = "";

  let name    = document.getElementById("ct-name").value.trim();
  let reg     = document.getElementById("ct-reg").value.trim();
  let subject = document.getElementById("ct-subject").value.trim();
  let message = document.getElementById("ct-message").value.trim();

  if (name === "") {
    document.getElementById("ct-error").innerHTML = "Please enter your full name.";
    return;
  }
  if (reg === "") {
    document.getElementById("ct-error").innerHTML = "Please enter your registration number.";
    return;
  }
  if (subject === "") {
    document.getElementById("ct-error").innerHTML = "Please enter a subject.";
    return;
  }
  if (message === "") {
    document.getElementById("ct-error").innerHTML = "Please write your message.";
    return;
  }
  if (message.length < 10) {
    document.getElementById("ct-error").innerHTML = "Message is too short. Please provide more detail.";
    return;
  }

  /* All valid - show success */
  document.getElementById("ct-success").innerHTML =
    "Message sent successfully, " + name + "! EASTCSO administration will respond within 2 working days.";

  /* Clear form */
  document.getElementById("ct-name").value    = "";
  document.getElementById("ct-reg").value     = "";
  document.getElementById("ct-subject").value = "";
  document.getElementById("ct-message").value = "";
}


/* ─────────────────────────────────────────────────────────
   6. SIDEBAR LIVE PREVIEWS
   for loop, innerHTML - Session 05
───────────────────────────────────────────────────────── */

/* Show latest 3 announcements in sidebar */
function updateSidebarAnnouncements() {
  let list = document.getElementById("sidebar-ann");
  list.innerHTML = "";

  if (announcements.length === 0) {
    list.innerHTML = "<li class='sidebar-item muted'>No announcements yet.</li>";
    return;
  }

  let count = 0;
  for (let i = announcements.length - 1; i >= 0; i--) {
    if (count >= 3) {
      break;
    }
    let ann  = announcements[i];
    let item = "<li class='sidebar-item'>";
    item += "<a href='#announcements' onclick='closeSidebar()'>" + ann.title + "</a>";
    item += "</li>";
    list.innerHTML = list.innerHTML + item;
    count = count + 1;
  }
}


/* Show upcoming events in sidebar */
function updateSidebarEvents() {
  let list = document.getElementById("sidebar-ev");
  list.innerHTML = "";

  /* Filter upcoming events using for loop */
  let upcoming = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].status === "Upcoming") {
      upcoming.push(events[i]);
    }
  }

  if (upcoming.length === 0) {
    list.innerHTML = "<li class='sidebar-item muted'>No upcoming events.</li>";
    return;
  }

  let count = 0;
  for (let i = 0; i < upcoming.length; i++) {
    if (count >= 3) {
      break;
    }
    let ev   = upcoming[i];
    let item = "<li class='sidebar-item'>";
    item += "<a href='#events' onclick='closeSidebar()'>" + ev.name + "</a><br>";
    item += "<span style='font-size:11px;color:#9ca3af;'>" + formatDate(ev.date) + " &middot; " + ev.venue + "</span>";
    item += "</li>";
    list.innerHTML = list.innerHTML + item;
    count = count + 1;
  }
}


/* ─────────────────────────────────────────────────────────
   7. ACTIVE NAV HIGHLIGHT ON SCROLL
   for loop, if/else, getElementById - Session 05
───────────────────────────────────────────────────────── */

const navIds = ["home", "about", "events", "announcements", "leadership", "services", "contact"];

window.onscroll = function () {
  let current = "home";

  /* Find which section is currently in view */
  for (let i = 0; i < navIds.length; i++) {
    let section = document.getElementById(navIds[i]);
    if (section !== null) {
      if (window.scrollY >= section.offsetTop - 120) {
        current = navIds[i];
      }
    }
  }

  /* Remove active from all nav links */
  for (let i = 0; i < navIds.length; i++) {
    let link = document.getElementById("nav-" + navIds[i]);
    if (link !== null) {
      link.className = "nav-link";
    }
  }

  /* Add active to current section link */
  let activeLink = document.getElementById("nav-" + current);
  if (activeLink !== null) {
    activeLink.className = "nav-link active";
  }
};


/* ─────────────────────────────────────────────────────────
   8. INITIALISE - run everything when page loads
───────────────────────────────────────────────────────── */
renderEvents();
renderAnnouncements();
updateSidebarEvents();
updateSidebarAnnouncements();
