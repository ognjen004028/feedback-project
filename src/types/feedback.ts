export interface Feedback {
  id: string;
  name: string;
  email: string;
  type: 'bug' | 'suggestion';
  title: string;
  message: string;
  createdAt: string;
}

export interface FeedbackFormData {
  name: string;
  email: string;
  type: 'bug' | 'suggestion';
  title: string;
  message: string;
}