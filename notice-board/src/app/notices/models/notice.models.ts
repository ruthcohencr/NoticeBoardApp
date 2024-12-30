export interface NoticeDTO {
    id: number;
    title: string;
    uploadDate?: Date | null;
    description: string;
    categoryId: number;
    cityId: number;
    imageFile?: string;  // Can be File before upload, URL after
    userId: string;
    // userPhone: string;
}

export interface NoticeCreationDTO {
    title: string;
    description: string;
    categoryId: number;
    cityId: number;
    imageFile?: File;
    userId: string;
    // userPhone: string;
}