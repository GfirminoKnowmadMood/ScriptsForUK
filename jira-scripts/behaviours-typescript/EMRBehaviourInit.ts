// Project has been migrated to eTools Jira. Ref:HELPCENTER-3478 and archived on 23.3.2026

const qmField = getFieldById('customfield_11693');

if (qmField) {
    qmField.setDescription(
        '<div class ="aui-message-warning"><font color="red" size="2"> Please note that if "QM Relevant" is set to "YES," all test cases must be approved before proceeding with the workflow transition to "READY"' +
        '\n             </font>\n             </div>'
    );
}
