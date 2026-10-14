/*
 * Ref: HELPCENTER-2466 and HELPCENTER-2930
 * Description: Control required state of Due Date fields based on Epic Link value.
 *              Only applies to "Rates update" issue type.
 * Trigger: ONCHANGE on Epic Link (customfield_10197)
 */

const context = await getContext();
const issueTypeName = context.extension.issueType.name;

if (issueTypeName === 'Rates update') {
    const epicLinkField = getFieldById('customfield_10197');
    const dueDateForApprovalField = getFieldById('customfield_24649');
    const dueDateForUpdateField = getFieldById('customfield_24648');

    if (epicLinkField && dueDateForApprovalField && dueDateForUpdateField) {
        const epicLinkValue = epicLinkField.getValue();

        if (epicLinkValue) {
            dueDateForApprovalField.setVisible(true);
            dueDateForApprovalField.setRequired(false);
            dueDateForApprovalField.setValue(null);
            dueDateForUpdateField.setVisible(true);
            dueDateForUpdateField.setRequired(false);
            dueDateForUpdateField.setValue(null);
        } else {
            dueDateForApprovalField.setVisible(true);
            dueDateForApprovalField.setRequired(true);
            dueDateForApprovalField.setValue(null);
            dueDateForUpdateField.setVisible(true);
            dueDateForUpdateField.setRequired(true);
            dueDateForUpdateField.setValue(null);
        }
    }
}
