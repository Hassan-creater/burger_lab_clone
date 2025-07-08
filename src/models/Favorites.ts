export type Favorite = {
    id: string;
    itemId?: string;
    dealId?: string;
    item?: any; // Should be Item type if imported
    deal?: any; // Should be Deal type if defined
    userid: string;
    favoriteStatus?: string;
}