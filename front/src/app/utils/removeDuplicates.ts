export const removeDuplicatesById = (array: any) => {
    const unique = array.reduce((acc:any, item:any) => {
        if (!acc.some((existingItem: { userId: string, status: "ONLINE" | "OFFLINE", role:any; }) => existingItem.userId === item.userId && existingItem.status === "ONLINE" && existingItem.role === "CLIENT")) {
            acc.push(item);
        }
        return acc;
    }, []);
    return unique;
};

