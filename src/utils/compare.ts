export const sonObjetosIguales = (obj1: any, obj2: any): boolean => {
    if(typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }

    for (let key of obj1Keys) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
};