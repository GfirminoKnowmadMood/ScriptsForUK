// Initialiser: DEVSERVICE – AP Company Mapping Request
// Makes the Summary field read-only and shows a warning description on load.

const summaryField = getFieldById("summary");

if (summaryField) {
    summaryField.setReadOnly(true);
    summaryField.setDescription("Issue cannot be created!");
}
