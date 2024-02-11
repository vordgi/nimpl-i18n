export const isPromise = <T>(el: unknown): el is Promise<T> => {
    if (el && typeof el === 'object' && 'then' in el) {
        return true;
    }

    return false;
}