export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}