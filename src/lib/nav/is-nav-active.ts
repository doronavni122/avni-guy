function normalizePath(value: string): string {
	return value.endsWith('/') ? value : `${value}/`;
}

export function isNavLinkActive(href: string, currentPath: string): boolean {
	const normalizedHref = normalizePath(href);
	const normalizedPath = normalizePath(currentPath);
	return normalizedPath === normalizedHref || (href !== '/' && normalizedPath.startsWith(normalizedHref));
}
