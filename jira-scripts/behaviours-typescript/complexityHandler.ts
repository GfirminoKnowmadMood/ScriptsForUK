/*
 * Ref: HELPCENTER-2466 and HELPCENTER-2930
 * Description: Show/hide Complexity Grade based on the selected Shipper value.
 * Trigger: ONCHANGE on Shipper (customfield_24496)
 */

const shipperField = getFieldById('customfield_24496');
const complexityGradeField = getFieldById('customfield_12904');

if (shipperField && complexityGradeField) {
    const shipperValue = shipperField.getValue();
    const shipperLabel = shipperValue ? shipperValue.value : null;

    if (shipperLabel === 'Coty') {
        complexityGradeField.setVisible(true);
        complexityGradeField.setRequired(false);
    } else {
        complexityGradeField.setVisible(false);
        complexityGradeField.setRequired(false);
        complexityGradeField.setValue(null);
    }
}
