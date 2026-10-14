(async () => {
    const affectedUserField = getFieldById('customfield_13391');
    const descField = getFieldById('description');

    if (affectedUserField) {
        affectedUserField.setRequired(true);
    }

    const changedField = getChangeField();
    if (!changedField || !descField || !affectedUserField) {
        return;
    }

    const rawValue = changedField.getValue();
    const accountId: string | undefined =
        typeof rawValue === 'string' ? rawValue : (rawValue as any)?.accountId as string | undefined;

    if (!accountId) {
        return;
    }

    // Fetch current user first to obtain their accountId
    const myselfResp = await makeRequest('/rest/api/3/myself');
    const currentUserAccountId = (myselfResp.body as any).accountId as string;

    // Fetch affected user details, affected user groups, and current user groups in parallel
    const [affectedUserResp, affectedUserGroupsResp, currentUserGroupsResp] = await Promise.all([
        makeRequest(`/rest/api/3/user?accountId=${accountId}`),
        makeRequest(`/rest/api/3/user/groups?accountId=${accountId}`),
        makeRequest(`/rest/api/3/user/groups?accountId=${currentUserAccountId}`)
    ]);

    const displayName = (affectedUserResp.body as any).displayName as string;
    const affectedUserGroups: string[] = ((affectedUserGroupsResp.body as any[]) || [])
        .map((g: any) => g.name as string);
    const currentUserGroups: string[] = ((currentUserGroupsResp.body as any[]) || [])
        .map((g: any) => g.name as string);

    const hcsGroups: string[] = [];
    const adGroups: string[] = [];

    for (const groupName of affectedUserGroups) {
        if (groupName.startsWith('sec_tg_hq_jira')) {
            adGroups.push(groupName);
        }
        if (groupName.startsWith('sec_js')) {
            hcsGroups.push(groupName);
        }
    }

    // Build ADF document for the description field
    // Note: user createdDate/updatedDate are not available via the Jira Cloud REST API
    const adf = {
        version: 1 as const,
        type: 'doc' as const,
        content: [
            {
                type: 'paragraph',
                content: [
                    { type: 'text', text: 'Overview for user: ', marks: [{ type: 'strong' }] },
                    { type: 'text', text: displayName }
                ]
            },
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'HCS internal Jira Groups (startsWith sec_js):',
                        marks: [{ type: 'strong' }]
                    }
                ]
            },
            {
                type: 'codeBlock',
                attrs: { language: 'java' },
                content: [{ type: 'text', text: hcsGroups.join('\n') || ' ' }]
            },
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'Active Directory Jira Groups (startsWith sec_tg_hq_jira):',
                        marks: [{ type: 'strong' }]
                    }
                ]
            },
            {
                type: 'codeBlock',
                attrs: { language: 'java' },
                content: [{ type: 'text', text: adGroups.join('\n') || ' ' }]
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', text: '---------------' }]
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', text: `Currentuser: ${currentUserAccountId}` }]
            },
            {
                type: 'paragraph',
                content: [
                    { type: 'text', text: 'Groups of the currentuser:', marks: [{ type: 'strong' }] }
                ]
            },
            {
                type: 'codeBlock',
                attrs: { language: 'java' },
                content: [{ type: 'text', text: currentUserGroups.join('\n') || ' ' }]
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', text: '---------------' }]
            }
        ]
    };

    descField.setValue(adf as any);
    affectedUserField.setValue(null as any);
    affectedUserField.setDescription(
        '<div class="aui-message"><font color="red" size="2">' +
        'Keep in mind that this request type is view only. No ticket will be created!' +
        '</font></div>'
    );
})();
