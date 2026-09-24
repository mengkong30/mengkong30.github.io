import homeProjects from './home.json';

export interface ProjectItem {
  id?: number;
  title: string;
  title_en?: string;
  description?: string;
  date?: string;
  detail?: string;
  url?: string;
  tags?: string[];
  cover?: string[];
}

// 首页与项目列表使用同一份真实项目数据。
export const projectItems: ProjectItem[] = homeProjects.map((project) => ({
  id: Number(project.id),
  title: project.title,
  description: project.desc,
  date: project.date,
  detail: project.detail,
  url: project.url,
  tags: [project.tag],
}));

