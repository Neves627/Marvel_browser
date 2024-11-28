// types.d.ts
export interface Comic {
    id: number;
    title: string;
    thumbnail: {
      path: string;
      extension: string;
    };
    onsaleDate?: string; // Make this optional if it's not needed
  }
  