/**
 * Author: James
 * Ref: HELPCENTER-2477
 * Description: Hides the "Carrier Projects Europe" (ID: 20473) and
 * "Carrier Projects Americas" (ID: 21299) options from the "Team-Name"
 * select field (customfield_12090) on the Effort Estimation Request form.
 */

const teamNameField = getFieldById("customfield_12090");

if (teamNameField) {
    teamNameField.setOptionsVisibility(["20473", "21299"], false);
}
