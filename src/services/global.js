

export async function getData() {
    return new Promise(resolve => {
        setTimeout(() => resolve({a: '1', b: '2' }), 2000)
    })
}

export async function getUserData() {
    return new Promise(resolve => {
        setTimeout(() => resolve({age: 20, name: "Abc dDef" }), 2000)
    })
}