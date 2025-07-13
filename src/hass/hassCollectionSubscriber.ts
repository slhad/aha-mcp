import { Connection, getCollection } from "home-assistant-js-websocket";

// from home-assistant-js-websocket/README.md

export class HassCollectionSubscriber {
    collection: ReturnType<typeof getCollection>;
    collectionId: string;
    collectionType: string;
    constructor(collectionType: string, connection: Connection) {
        this.collectionType = collectionType;
        this.collectionId = `id_`;
        this.collection = getCollection(
            connection,
            this.collectionId,
            this.fetchItems.bind(this),
            this.subscribeUpdates.bind(this),
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemRegistered(state: any, event: unknown) {
        if (state === undefined) return null;
        console.log("Item registered:", JSON.stringify(event));
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: state.items.concat((event as any).data.item),
        };
    }

    fetchItems(conn: Connection) {
        return conn.sendMessagePromise({ type: this.collectionType });
    }

    subscribeUpdates(conn: Connection, store: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return conn.subscribeEvents((store as any).action(this.itemRegistered), "item_registered");
    }

    refresh() {
        return this.collection.refresh();
    }

    async getItems() {
        await this.collection.refresh();
        return this.collection.state;
    }
}