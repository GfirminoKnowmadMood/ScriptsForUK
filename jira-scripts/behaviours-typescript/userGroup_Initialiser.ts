const descField = getFieldById('description');

if (descField) {
    descField.setDescription(
        '<div class="aui-message"><font color="red" size="2">' +
        'Please don\'t create a ticket. This is for investigation of user permissions only!"' +
        '</font></div>'
    );
    descField.setRequired(true);
    descField.setReadOnly(true);
}
