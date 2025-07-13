// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stripSchemaKey(obj: any): any {
    if (obj && Object.hasOwn(obj, "$schema")) {
        delete obj.$schema;
    }
    return obj;
}