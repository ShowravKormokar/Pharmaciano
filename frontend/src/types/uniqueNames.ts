export interface UniqueNamesResponse {
    success: boolean;
    message: string;
    data: {
        organizationName: string[];
        branchName: string[];
        roleName: string[];
        medicineName: string[];
        categoryName: string[];
        brandName: string[];
        batchNo: string[];
    };
}

export interface UniqueNamesData {
    organizationName: string[];
    branchName: string[];
    roleName: string[];
    medicineName: string[];
    categoryName: string[];
    brandName: string[];
    batchNo: string[];
}