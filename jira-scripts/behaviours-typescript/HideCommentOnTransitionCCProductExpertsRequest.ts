/*
 * Author: James
 * Created: 2025-11-28
 * Ref. id: HELPCENTER-3057
 * Desc: Hide the comment field when the "+Product-Experts Request" transition
 *       screen is shown.
 *
 * ⚠️  PLATFORM LIMITATION: The "comment" field is not currently listed as a
 *     supported field in the Atlassian UI Modifications API for the Transition
 *     view. As a result, getFieldById("comment") may return undefined at
 *     runtime and the visibility change may have no effect.
 *     Monitor the ScriptRunner Behaviours supported fields page for updates:
 *     https://docs.adaptavist.com/sr4jc/latest/features/behaviours/behaviours-supported-fields-and-products
 *
 * NOTE: Replace TRANSITION_ID_PLACEHOLDER below with the actual Cloud
 *       transition ID for the "+Product-Experts Request" transition.
 *       You can find it via:
 *         GET /rest/api/3/issue/{issueKey}/transitions
 *       and look for the transition whose name matches "+Product-Experts Request".
 */

const TARGET_TRANSITION_ID = "TRANSITION_ID_PLACEHOLDER";

const context = await getContext();

// "comment" is not in the typed FieldId union because Atlassian's UI
// Modifications API does not officially expose it on the Transition view.
// The cast is intentional — if Atlassian adds support in future, this will
// work automatically; until then, commentField will be undefined and the
// guard below will no-op safely.
const commentField = getFieldById("comment" as any);

if (commentField) {
  const transitionId = context.extension.issueTransition?.id;

  if (transitionId === TARGET_TRANSITION_ID) {
    commentField.setVisible(false);
  } else {
    commentField.setVisible(true);
  }
}
