export interface Issue {
  id: string;
  description: string;
  status: boolean;
  issueFiles: Array<File>;
  comments: Array<Comment>;
}

export interface Comment {
  content: string;
}
export interface File {
  name: string;
  path: string;
}
