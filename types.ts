
export interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  url?: string;
  iconUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
