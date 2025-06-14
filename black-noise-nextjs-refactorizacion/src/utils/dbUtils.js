// Helper function to convert Mongoose document to plain object
export function toPlainObject(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : { ...doc }; // Handle both Mongoose docs and lean objects

    if (obj._id) {
        obj._id = obj._id.toString();
    }
    // Convert dates to YYYY-MM-DD for form compatibility or ISO string for full timestamp
    if (obj.fechaNacimiento) {
        obj.fechaNacimiento = new Date(obj.fechaNacimiento).toISOString().split('T')[0];
    }
    if (obj.createdAt) {
        obj.createdAt = new Date(obj.createdAt).toISOString();
    }
    if (obj.updatedAt) {
        obj.updatedAt = new Date(obj.updatedAt).toISOString();
    }
    // Remove __v if present
    delete obj.__v;
    return obj;
}
