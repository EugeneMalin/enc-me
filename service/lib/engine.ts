export function post(data: Object, path: string) {
    return new Promise<Object>((resolve) => {
        resolve({
            data,
            path
        });
    })
}

export function get(data: Object, path: string) {
    return new Promise<Object>((resolve, reject) => {
        resolve({
            data,
            path
        });
    })
}
