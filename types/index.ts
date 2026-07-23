export type Project = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  importance: string;
  status: string;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Knowledge = {
  id: string;
  projectId: string;
  title: string;
  type: "sop" | "policy" | "workflow" | "checklist" | "guideline" | "meeting_note" | "document";
  content: string;
  tags: string; // comma-separated
  createdAt: Date;
  updatedAt: Date;
};

export type TimelineColor = "overdue" | "today" | "1-2days" | "3-7days" | "more7days";
