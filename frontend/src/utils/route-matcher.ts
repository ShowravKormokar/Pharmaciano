export function normalizePath(path: string) {
    return path.replace(/\/+$/, "");
}

/**
 * Parent menu active check
 */
export function isRouteActive(pathname: string, href?: string) {
    if (!href) return false;

    const current = normalizePath(pathname);
    const target = normalizePath(href);

    if (target === "/dashboard") {
        return current === target;
    }

    return current === target || current.startsWith(`${target}/`);
}

export function getBestMatch(
    pathname: string,
    hrefs: string[]
) {
    const current = normalizePath(pathname);

    let bestMatch: string | null = null;

    for (const href of hrefs) {
        const target = normalizePath(href);

        if (
            current === target ||
            current.startsWith(`${target}/`)
        ) {
            if (!bestMatch || target.length > bestMatch.length) {
                bestMatch = target;
            }
        }
    }

    return bestMatch;
}