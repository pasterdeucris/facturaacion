export function getDifference(array1, array2, attr) {
    return array1.filter(object1 => {
        return !array2.some(object2 => {
        return eval("object1." + attr + " == object2." + attr);
        });
    });
}

export async function isServerAvailable(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (err) {
        return false;
    }
};

export async function getQRString (text) {
    const lastIndex = text.lastIndexOf("https");
    
    if (lastIndex !== -1) {
        const url = text.slice(lastIndex);
        return url;
    } else {
        return "No se encontró ningún enlace";
    }
};