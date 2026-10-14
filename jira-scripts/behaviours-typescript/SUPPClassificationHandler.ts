/*
 * SUPP Behaviour — Classification Handler
 * Author: Dhiman (migrated to Cloud)
 * Ref: HELPCENTER-2678
 *
 * Triggered by: customfield_24604 (Classification) ONCHANGE
 *
 * Hides/shows the "Preventive Actions Completed" field (customfield_30790)
 * based on the selected Classification value.
 *
 * "Master data", "Rates", or "User management" → hide PAC (not required)
 * Any other value                               → show PAC (required)
 */

const classificationField = getFieldById("customfield_24604");
const preventiveActionCompletedField = getFieldById("customfield_30790");

if (classificationField && preventiveActionCompletedField) {
  const selectedOption = classificationField.getValue();
  const selectedValue = selectedOption ? selectedOption.value : null;

  if (
    selectedValue === "Master data" ||
    selectedValue === "Rates" ||
    selectedValue === "User management"
  ) {
    preventiveActionCompletedField.setVisible(false);
    preventiveActionCompletedField.setRequired(false);
  } else {
    preventiveActionCompletedField.setVisible(true);
    preventiveActionCompletedField.setRequired(true);
  }
}
