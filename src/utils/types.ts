export type User = {};

export type Idea = {
  impact: number;
  ease: number;
  confidence: number;
  content: string;
  id?: string;
};

export type IdeaProperty = 'impact' | 'ease' | 'confidence';

export enum IconTypes {
  addIdea,
  edit,
  cancel,
  confirm,
  delete,
}
