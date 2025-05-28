import type {ParserText} from "$lib/DataColumn";

const setNestedValue = (obj: any, path: string, value: any)=> {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

/**
 * 获取嵌套属性的值
 * @param obj
 * @param path
 */
const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export default {
    setNestedValue,
    getNestedValue
}