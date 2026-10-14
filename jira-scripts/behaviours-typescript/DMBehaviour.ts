const summaryField = getFieldById('summary');
const shipperField = getFieldById('customfield_24496');
const documentTypeField = getFieldById('customfield_24615');
const componentField = getFieldById('components');
const templateLabelField = getFieldById('customfield_24790');

if (
  summaryField &&
  shipperField &&
  documentTypeField &&
  componentField &&
  templateLabelField
) {
  const templateLabelOption = templateLabelField.getValue();
  const templateLabelValue = templateLabelOption ? templateLabelOption.value : null;

  if (templateLabelValue === 'DM') {
    summaryField.setReadOnly(true);

    const components = componentField.getValue() ?? [];
    const componentStr = components.map(c => c.name ?? '').join(',');
    const shipperValue = (shipperField.getValue()?.value) ?? '';
    const documentTypeValue = (documentTypeField.getValue()?.value) ?? '';

    if (componentStr.includes('Creation')) {
      summaryField.setValue(
        `Business Process Initial Version Creation - ${shipperValue} - ${documentTypeValue}`
      );
    } else if (shipperValue === 'All') {
      summaryField.setValue(
        `Business Process template changes - ${shipperValue} - ${documentTypeValue}`
      );
    } else {
      summaryField.setValue(
        `Business Process Update - ${shipperValue} - ${documentTypeValue}`
      );
    }
  } else {
    summaryField.setReadOnly(false);
  }
}
