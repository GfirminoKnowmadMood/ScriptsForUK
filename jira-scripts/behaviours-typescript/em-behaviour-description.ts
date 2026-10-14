// Note: the original DC script used assignment (=) instead of comparison (==) in
// `if (IssueTypeName = "Support")`, so the condition was always truthy.
// This faithful port preserves that behaviour: the template is always applied
// when the description field is empty, regardless of issue type.

const descField = getFieldById("description");

const descriptionAdf = {
  version: 1 as const,
  type: "doc" as const,
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Please use the separator sign (||) between item names and its quantity"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Artikel Number", marks: [{ type: "strong" }] },
        { type: "text", text: " || " },
        { type: "text", text: "Name of the Items", marks: [{ type: "strong" }] },
        { type: "text", text: " || " },
        { type: "text", text: "Quantity:", marks: [{ type: "strong" }] }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Start of event", marks: [{ type: "strong" }] }
      ]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "(DD-MM-YYYY)" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Link to the Product Portfolio:",
          marks: [{ type: "strong" }]
        },
        {
          type: "text",
          text: "Click Here",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://docs.google.com/spreadsheets/d/10Rl8jXjDqNMJNkUJ1vOPA4jXdVcEcP21f0JIcdLw6Js/edit?gid=0#gid=0"
              }
            }
          ]
        }
      ]
    }
  ]
};

if (descField) {
  const value = descField.getValue();
  const isEmpty =
    value == null ||
    (typeof value === "string" && value.trim() === "") ||
    (typeof value === "object" &&
      value !== null &&
      Array.isArray((value as { content?: unknown[] }).content) &&
      ((value as { content?: unknown[] }).content ?? []).length === 0);

  if (isEmpty) {
    descField.setValue(descriptionAdf as any);
  }
}
