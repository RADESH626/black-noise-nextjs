// Helper function to convert Mongoose document (or plain object) to a serializable plain object
export function toPlainObject(doc) {
    if (doc === null || typeof doc !== 'object') {
        return doc;
    }

    // Handle Mongoose documents by converting to a plain object first
    const obj = doc.toObject ? doc.toObject({ getters: true, virtuals: true }) : { ...doc };

    // Recursive function to process properties
    const processValue = (value) => {
        if (value && typeof value === 'object') {
            if (value instanceof Date) {
                return value.toISOString();
            }
            if (value instanceof Buffer) {
                return value.toString('base64');
            }
            // Handle objects that are serialized Buffers (e.g., from JSON.parse)
            if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
                return Buffer.from(value.data).toString('base64');
            }
            // Check if it's a Mongoose ObjectId
            if (value._bsontype === 'ObjectId' || (value.constructor && value.constructor.name === 'ObjectId')) {
                return value.toString();
            }
            if (Array.isArray(value)) {
                return value.map(item => processValue(item));
            }
            // Recursively process nested objects
            const newObj = {};
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    newObj[key] = processValue(value[key]);
                }
            }
            return newObj;
        }
        return value;
    };

    const result = processValue(obj);

    // Remove __v if present at the top level
    if (result.__v !== undefined) {
        delete result.__v;
    }

    return result;
}
