export interface Message {
    id: string;
    title: string;
    senderId: string;
    receiverId: string;
    content: string;
    senderName: string;
    receiverName: string;
    createdOn: Date;
    fromClient?: boolean;
}