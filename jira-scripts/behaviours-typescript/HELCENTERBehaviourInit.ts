const EXCLUDED_CATEGORY_NAMES: string[] = ['CXPROIMP', 'CXSYSDESIGN'];

interface ProjectDetail {
  key: string;
  name: string;
  groupName: string;
  members: string;
}

function boldText(content: string): object {
  return { type: 'text', text: content, marks: [{ type: 'strong' }] };
}

function italicText(content: string): object {
  return { type: 'text', text: content, marks: [{ type: 'em' }] };
}

function plainText(content: string): object {
  return { type: 'text', text: content };
}

function paragraph(nodes: object[]): object {
  return { type: 'paragraph', content: nodes };
}

async function fetchAllProjects(): Promise<object[]> {
  const projects: object[] = [];
  let startAt = 0;
  const maxResults = 50;

  while (true) {
    const response = await makeRequest(
      `/rest/api/3/project/search?startAt=${startAt}&maxResults=${maxResults}`
    );
    if (response.status !== 200) break;

    const body = response.body as { values: object[]; isLast: boolean };
    const values = body.values || [];
    projects.push(...values);

    if (body.isLast || values.length < maxResults) break;
    startAt += values.length;
  }

  return projects;
}

async function fetchGroupMembers(
  groupName: string
): Promise<{ found: boolean; members: string[] }> {
  const members: string[] = [];
  let startAt = 0;
  const maxResults = 50;

  while (true) {
    const response = await makeRequest(
      `/rest/api/3/group/member?groupname=${encodeURIComponent(groupName)}&startAt=${startAt}&maxResults=${maxResults}`
    );

    if (response.status === 404) {
      return { found: false, members: [] };
    }
    if (response.status !== 200) break;

    const body = response.body as {
      values: { displayName: string }[];
      isLast: boolean;
    };
    const values = body.values || [];
    for (const user of values) {
      if (user.displayName) {
        members.push(user.displayName);
      }
    }

    if (body.isLast || values.length < maxResults) break;
    startAt += values.length;
  }

  return { found: true, members };
}

// ── Main initialiser logic ──────────────────────────────────────────────────

const descriptionField = getFieldById('description');
const affectedUserField = getFieldById('customfield_13391');

if (descriptionField && affectedUserField) {
  const allProjects = await fetchAllProjects();
  const filteredProjectDetails: ProjectDetail[] = [];

  for (const proj of allProjects) {
    const project = proj as {
      key: string;
      name: string;
      projectCategory?: { name: string };
    };
    const categoryName = project.projectCategory?.name || '';

    if (EXCLUDED_CATEGORY_NAMES.includes(categoryName)) continue;

    const projectKey = project.key;
    const projectName = project.name;
    const groupName = `sec_${projectKey}_admin`;

    const { found, members } = await fetchGroupMembers(groupName);

    let membersList: string;
    let resolvedGroupName: string;

    if (found) {
      resolvedGroupName = groupName;
      membersList = members.length > 0 ? members.join(', ') : 'No members in group';
    } else {
      resolvedGroupName = 'N/A - Group Missing';
      membersList = 'Group Not Found';
    }

    filteredProjectDetails.push({
      key: projectKey,
      name: projectName,
      groupName: resolvedGroupName,
      members: membersList,
    });
  }

  // Sort alphabetically by project name
  filteredProjectDetails.sort((a, b) => a.name.localeCompare(b.name));

  // Build ADF document
  const adfContent: object[] = [];

  adfContent.push(
    paragraph([boldText('Find Your Project Administrator Here:')])
  );
  adfContent.push(
    paragraph([boldText('[Result is sorted alphabetically based on project full name.]')])
  );
  adfContent.push(
    paragraph([plainText('+++++++++++++++++++++++++++++++++++++++')])
  );

  if (filteredProjectDetails.length === 0) {
    adfContent.push(paragraph([plainText('No projects found.')]));
  } else {
    for (const detail of filteredProjectDetails) {
      let membersNode: object;

      if (detail.groupName.startsWith('N/A')) {
        membersNode = boldText(detail.members);
      } else if (detail.members === 'No members in group') {
        membersNode = italicText(detail.members);
      } else {
        membersNode = plainText(detail.members);
      }

      adfContent.push(
        paragraph([
          boldText(detail.key),
          plainText(' || '),
          boldText(detail.name),
          plainText(' || : ['),
          membersNode,
          plainText(']'),
        ])
      );
    }
  }

  const adf = {
    version: 1 as const,
    type: 'doc' as const,
    content: adfContent,
  };

  descriptionField.setValue(adf as any);
  descriptionField.setReadOnly(true);

  affectedUserField.setValue('' as any);
  affectedUserField.setVisible(false);
  affectedUserField.setRequired(true);
}
