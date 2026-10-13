import { profile } from './profile'
import { projects, projectCategories } from './projects'
import { skillGroups, softSkills } from './skills'
import { certifications, education, experiences } from './experience'

export const defaultContent = {
  profile,
  projects,
  projectCategories,
  skillGroups,
  softSkills,
  experiences,
  education,
  certifications,
}

export function mergePortfolioContent(data) {
  return {
    ...defaultContent,
    ...data,
    profile: { ...defaultContent.profile, ...data.profile },
  }
}
