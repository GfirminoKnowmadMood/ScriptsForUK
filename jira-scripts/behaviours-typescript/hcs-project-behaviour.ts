//Place the TypeScript file at cloud/src/main/typescript
import com.atlassian.jira.component.ComponentAccessor
import com.atlassian.crowd.embedded.api.Group
import com.atlassian.jira.project.Project
import com.atlassian.jira.permission.ProjectPermissions 
import com.atlassian.jira.user.ApplicationUser
import com.atlassian.jira.project.ProjectManager
import com.atlassian.jira.project.Project
import com.atlassian.jira.security.roles.ProjectRole
import com.atlassian.jira.bc.projectroles.ProjectRoleService
import com.atlassian.jira.security.roles.ProjectRoleManager
import com.atlassian.jira.security.roles.ProjectRoleActors

def projectManager =ComponentAccessor.getComponent(ProjectManager);
def projectRoleService =ComponentAccessor.getComponent(ProjectRoleService);
def projectRoleManager =ComponentAccessor.getComponent(ProjectRoleManager);
def groupManager = ComponentAccessor.groupManager

def formField = getFieldById(getFieldChanged())
def String formValue = formField.getFormValue()
log.warn("formField: "+formField)
log.warn("formValue: "+formValue)
def selectedValueID = formField.getValue()
def descField = getFieldById("description")
def affectedUser = getFieldByName("Affected User")
log.warn("selectedValueID: "+selectedValueID)

def selectedProject = getFieldByName("HCS-Project").getFormValue()
Project projectObject = projectManager.getProjectObj(formField.getFormValue() as Integer)
log.warn("project key: "+projectObject.key)

def currentuser = ComponentAccessor.jiraAuthenticationContext.loggedInUser.username
def groupNamescurrentuser = groupManager.getGroupNamesForUser(currentuser)

// can this user administer the selected project    
def user = ComponentAccessor.userManager.getUserByName(currentuser)
def resuserHasAdminult = user.canAdminister(Projects.getByKey(projectObject.key))

final String projectRoleName = 'Developers'
ProjectRole projectRole = projectRoleManager.getProjectRole(projectRoleName)
ProjectRoleActors actors = projectRoleManager.getProjectRoleActors(projectRole, projectObject)
def result = projectObject.key+projectObject.name+ projectObject.leadUserKey+actors.getUsers()*.name
descField.setFormValue('*selectedValueID:* '+selectedValueID+' userHasAdmin: '+resuserHasAdminult as String+' result: '+result)
if (resuserHasAdminult) {
    formField.setReadOnly(false)
    formField.setDescription("Granting allowed because you are a member of the group: admins")
} else {
    formField.setReadOnly(true)
    formField.setDescription("You are not allowed.")
}
