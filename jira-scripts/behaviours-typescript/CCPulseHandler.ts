/**
 * CUSTCARE Traffic Light change - Management only
 * Pulse Ticket onChange behaviour script (Cloud)
 *
 * Migrated from: projects/CUSTCARE/behaviour/CCShowTrafficLightOnlyToManagement.groovy
 * Original: HELPCENTER-1696 / HELPCENTER-1901
 *
 * When Pulse Ticket (customfield_28690) is set to "Yes" on a Support issue,
 * pre-populates the system Description and Description (internal) fields
 * with their respective templates if they are currently empty.
 */

const context = await getContext();
const issueTypeName = context.extension.issueType.name;

const pulseTicketField  = getFieldById("customfield_28690");
const descField         = getFieldById("description");
const descInternalField = getFieldById("customfield_13090");

const pulseValue = pulseTicketField?.getValue() as { id: string; value: string } | null;

if (issueTypeName === "Support" && pulseValue?.value === "Yes") {

    // 1. Pre-populate system Description if empty
    if (descField) {
        const rawDesc = descField.getValue();
        const isDescEmpty =
            rawDesc == null ||
            (typeof rawDesc === "string" && rawDesc.trim() === "") ||
            (typeof rawDesc === "object" &&
                rawDesc !== null &&
                Array.isArray((rawDesc as { content?: unknown[] }).content) &&
                ((rawDesc as { content?: unknown[] }).content ?? []).length === 0);

        if (isDescEmpty) {
            descField.setValue({
                version: 1 as const,
                type: "doc" as const,
                content: [
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Description (customer-facing)" }],
                    },
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Workaround (customer-facing)" }],
                    },
                    {
                        type: "heading",
                        attrs: { level: 1 },
                        content: [{ type: "text", text: "Arc Description (internal Arc-only)" }],
                    },
                ],
            } as any);
        }
    }

    // 2. Pre-populate Description (internal) if empty
    if (descInternalField) {
        const rawInternal = descInternalField.getValue();
        const isInternalEmpty =
            rawInternal == null ||
            (typeof rawInternal === "string" && rawInternal.trim() === "") ||
            (typeof rawInternal === "object" &&
                rawInternal !== null &&
                Array.isArray((rawInternal as { content?: unknown[] }).content) &&
                ((rawInternal as { content?: unknown[] }).content ?? []).length === 0);

        if (isInternalEmpty) {
            descInternalField.setValue({
                version: 1 as const,
                type: "doc" as const,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "What happens:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide a clear and concise description of the event]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Start timestamp:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide enter in this format YYYY-MM-DD HH:MM:SS]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "End timestamp:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide enter in this format YYYY-MM-DD HH:MM:SS]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Modules affected:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide enter list of all modules affected]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Where to follow the conversation:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide a link to the relevant communication channel]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Status page announcement:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide a link to the Status page announcement]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Known workaround:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Describe any known workarounds for the issue]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "What to communicate to external customers:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Provide the key points that can be communicated to affected customers]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Link to PITOPS or DEV card:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Ensure the Pulse ticket is always linked to the relevant PITOPS or DEV card]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Link to RCA if available:", marks: [{ type: "strong" }] },
                            { type: "text", text: " [Ensure the general RCA is always added to the pulse ticket]" },
                        ],
                    },
                    {
                        type: "paragraph",
                        content: [
                            { type: "text", text: "Important links:", marks: [{ type: "strong" }] },
                            { type: "hardBreak" },
                            {
                                type: "text",
                                text: "Status Page",
                                marks: [{ type: "link", attrs: { href: "https://transporeon.statuspage.io/" } }],
                            },
                            { type: "hardBreak" },
                            {
                                type: "text",
                                text: "Crisis Communication",
                                marks: [
                                    {
                                        type: "link",
                                        attrs: {
                                            href: "https://www.notion.so/CC-Crisis-Management-8a66c9e8bacd44008e9bc9bf0725cd95?pvs=21",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            } as any);
        }
    }
}
