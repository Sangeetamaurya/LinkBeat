// Dates are plain "YYYY-MM-DD" strings sent by the app (the phone knows its own time zone).
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isDateKey(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// The 7 date keys of the week (Monday..Sunday) that contains `day`.
function weekKeys(day) {
  const d = new Date(day + 'T00:00:00Z');
  const sinceMonday = (d.getUTCDay() + 6) % 7;
  const out = [];
  for (let i = 0; i < 7; i++) {
    const x = new Date(d.getTime() + (i - sinceMonday) * 86400000);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

module.exports = { isDateKey, todayKey, weekKeys };
