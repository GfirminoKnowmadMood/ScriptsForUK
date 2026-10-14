/*
 * SUPP Behaviour — Preventive Actions Completed (PAC) Handler
 * Author: Dhiman (migrated to Cloud)
 * Ref: HELPCENTER-2678
 *
 * Triggered by: customfield_30790 (Preventive Actions Completed) ONCHANGE
 *
 * Hides/shows the "Reason" field (customfield_30990) based on the
 * selected PAC value.
 *
 * "No"          → show Reason (required)
 * Any other value → hide Reason (not required)
 */

const preventiveActionCompletedField = getFieldById("customfield_30790");
const reasonField = getFieldById("customfield_30990");

if (preventiveActionCompletedField && reasonField) {
  // Default: hide Reason and make it not required
  reasonField.setVisible(false);
  reasonField.setRequired(false);

  const selectedOption = preventiveActionCompletedField.getValue();
  if (selectedOption && selectedOption.value === "No") {
    reasonField.setVisible(true);
    reasonField.setRequired(true);
  }
}
