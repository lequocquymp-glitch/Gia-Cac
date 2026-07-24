export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  projectId?: string | null;
  title: string;
  description?: string | null;
  importance: string;
  status: string;
  deadline?: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Knowledge = {
  id: string;
  projectId: string;
  title: string;
  type: string;
  content: string;
  tags: string; // comma-separated
  createdAt: Date;
  updatedAt: Date;
};

export type TimelineColor = "overdue" | "today" | "1-2days" | "3-7days" | "more7days";
