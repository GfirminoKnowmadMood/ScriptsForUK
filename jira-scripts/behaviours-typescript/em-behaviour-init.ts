const duedateField = getFieldById("duedate");
const eventLocation = getFieldById("customfield_28394");
const contactDetailsField = getFieldById("customfield_28395");
const billingAddressField = getFieldById("customfield_28396");

if (eventLocation) {
  eventLocation.setDescription(
    '<div class ="aui-message"><font color="green" size="2">' +
    '<i>Please enter event location in the mentioned format. e.g. Barcelona, Spain</i>' +
    '</font></div>'
  );
}

if (duedateField) {
  duedateField.setDescription(
    '<div class ="aui-message"><font color="green" size="2">' +
    '<i>Please enter latest date of arrival at end location. Estimated approx delivery time is 3 weeks</i>' +
    '</font></div>'
  );
}

if (contactDetailsField) {
  contactDetailsField.setValue({
    version: 1,
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "[Recipient Name]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Address]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Zip Code, Country]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Phone Number]" }] }
    ]
  } as any);
  contactDetailsField.setDescription(
    '<div class ="aui-message"><font color="green" size="2">' +
    '<i>Please enter <b>Recipient Name, Full Address, Zip Code, Country, Phone Number</b></i>' +
    '</font></div>'
  );
}

if (billingAddressField) {
  billingAddressField.setValue({
    version: 1,
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "[Company Name]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Address]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Zip Code, Country]" }] },
      { type: "paragraph", content: [{ type: "text", text: "[Email]" }] }
    ]
  } as any);
  billingAddressField.setDescription(
    '<div class ="aui-message"><font color="green" size="2">' +
    "<i>Please enter <b> Company's Full Address, Zip Code, Country, Email</b> for billing purpose</i>" +
    '</font></div>'
  );
}
