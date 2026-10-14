/**
 * CUSTCARE Traffic Light change - Management only
 * Initialiser behaviour script (Cloud)
 *
 * Migrated from: projects/CUSTCARE/behaviour/CCShowTrafficLightOnlyToManagement.groovy
 * Original: HELPCENTER-1696 / HELPCENTER-1901
 *
 * NOTE: customfield_12902 (Language) is a select field.
 *       Replace "ENGLISH_OPTION_ID" below with the actual option ID for "English".
 *       Find it via: GET /rest/api/3/field/customfield_12902/context/{contextId}/option
 */

const context = await getContext();
const issueTypeName = context.extension.issueType.name;
const accountId = context.accountId;

const languageField    = getFieldById("customfield_12902");
const pulseTicketField = getFieldById("customfield_28690");
const tlField          = getFieldById("customfield_25190");
const labelsField      = getFieldById("labels");
// NOTE: The "attachment" field is not supported by Cloud Behaviours.
// The DC description hint on the attachment field cannot be replicated in Cloud.

if (issueTypeName === "Sub-Task") {
    if (languageField) {
        languageField.setVisible(false);
        // TODO: Replace "ENGLISH_OPTION_ID" with the real option ID for "English"
        languageField.setValue("ENGLISH_OPTION_ID");
    }
} else {
    if (pulseTicketField) {
        pulseTicketField.setDescription(
            '<div class ="aui-message-warning"><font color="red" size="2">' +
            '<i>For Crisis communication process ONLY!</i></font></div>'
        );
    }

    // Fetch the current user's group memberships
    const groupsRes = await makeRequest(`/rest/api/3/user/groups?accountId=${accountId}`);
    const userGroups: string[] = ((groupsRes.body as Array<{ name: string }>) || [])
        .map((g: { name: string }) => g.name);

    // Mark the screen as Script Runner active for sysadmins
    if (userGroups.includes("sec_Jira_sysadmin")) {
        if (labelsField) {
            labelsField.setDescription("Script Runner active!");
        }
    }

    // Show or hide the TL field based on group membership.
    // NOTE: Preserves the original DC loop behaviour — the last group in the
    // list determines the final state (last-write-wins per iteration).
    const groupNames = [
        "sec_Jira_sysadmin",
        "sec_Jira_admin",
        "sec_CUSTCARE_PulseticketManagement",
    ];

    for (const groupName of groupNames) {
        if (userGroups.includes(groupName)) {
            if (tlField) {
                tlField.setReadOnly(false);
                tlField.setVisible(true);
                tlField.setDescription(
                    "Edit field allowed because you are a member of the group: sec_CUSTCARE_Management"
                );
            }
        } else {
            if (tlField) {
                tlField.setReadOnly(true);
                tlField.setVisible(false);
            }
        }
    }

    // Set Pulse Ticket field read-only based on group membership
    if (pulseTicketField) {
        if (userGroups.includes("sec_CUSTCARE_PulseticketManagement")) {
            pulseTicketField.setReadOnly(false);
        } else {
            pulseTicketField.setReadOnly(true);
        }
    }
}
