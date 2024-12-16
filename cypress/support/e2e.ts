import "./commands";
import "cypress-real-events";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

Cypress.on("log:changed", (log, interactive) => {
  if (log.displayName !== "fetch" && log.displayName !== "xhr") return;

  const logs = window?.top?.document.querySelectorAll(
    "li.command-name-request"
  );
  if (logs?.length) {
    const last = [...logs][logs.length - 1];
    last.remove();
  }
});
