export interface Comic {
    id: number;
    title: string;
    thumbnail: {
      path: string;
      extension: string;
    };
    // Check if onsaleDate is present here
    onsaleDate: string; // This should be added if it's missing
  }
  