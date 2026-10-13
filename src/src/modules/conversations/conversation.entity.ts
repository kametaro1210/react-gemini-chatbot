export class Conversation {
    id!: string;
    userId!: string;
    title?: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Conversation) {
        Object.assign(this, data);
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }
}