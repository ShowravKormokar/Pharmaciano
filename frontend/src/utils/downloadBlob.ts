export const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // No need to append to DOM (modern browsers support this)
    link.click();

    // Cleanup (important)
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
};