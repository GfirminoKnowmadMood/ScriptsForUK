/*
 * Behaviour: CX Adjusted Expected ARR (in €)
 * Field:     Adjusted Expected ARR (in €) [customfield_29991]
 * Trigger:   ONCHANGE
 * Scope:     All projects – Epic issue type
 *
 * Validates that the ARR field value is either 0 / empty (valid)
 * or >= 500 (valid). Values between 0 (exclusive) and 500 (exclusive)
 * are flagged with a description-level error message.
 *
 * Note: Cloud Behaviours does not support setError() / clearError().
 * Validation feedback is surfaced via setDescription() on the field.
 * For hard form-blocking validation, consider adding a workflow
 * validator (Jira Expression) on the relevant transitions.
 *
 * Ref: HELPCENTER-2764
 */

const ARR_FIELD_ID   = "customfield_29991";
const ARR_FIELD_NAME = "Adjusted Expected ARR (in €)";

const arrField = getFieldById(ARR_FIELD_ID);

if (arrField) {
  const arrValue = arrField.getValue();

  // Reset any previous description before re-validating
  arrField.setDescription("");

  const valueStr =
    arrValue !== null && arrValue !== undefined
      ? String(arrValue).trim()
      : "";

  // Empty or explicit zero are considered valid – no further checks needed
  if (valueStr !== "" && valueStr !== "0") {
    // Normalise decimal separator (comma → period) before parsing
    const normalised   = valueStr.replace(",", ".");
    const numericValue = parseFloat(normalised);

    if (isNaN(numericValue)) {
      arrField.setDescription(
        `The value for '${ARR_FIELD_NAME}' is not a valid number.`
      );
    } else if (numericValue > 0 && numericValue < 500) {
      arrField.setDescription(
        `The value of '${ARR_FIELD_NAME}' you recently tried to store` +
        ` cannot be lower than €500 (unless it is 0).`
      );
    }
  }
}
