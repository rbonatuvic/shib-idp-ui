export function readFileContents(file) {
    return new Promise(function (resolve, reject) {
        const fileReader = new FileReader();
        fileReader.onload = (evt) => {
            const reader = evt.target;
            const txt = reader.result;
            resolve(txt);
        };
        fileReader.onerror = reject;
        fileReader.readAsText(file);
    });
}