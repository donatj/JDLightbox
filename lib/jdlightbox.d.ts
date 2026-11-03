interface JDLightboxOptions {
    /** Selector for links that should open in the lightbox. */
    selector?: string;
}
interface LightboxItem {
    href: string;
    title: string;
    thumbnailAlt: string;
    isFrame: boolean;
}
interface LightboxView {
    href: string;
    title: string;
    isFrame: boolean;
    showNavigation: boolean;
    canGoPrevious: boolean;
    canGoNext: boolean;
}
declare function adjacentIndex(index: number, count: number, direction: -1 | 1): number | null;
declare function lightboxView(item: LightboxItem, index: number, count: number): LightboxView;
declare function isEligibleLink(link: Element | null): link is HTMLAnchorElement;
declare class JDLightbox {
    private readonly selector;
    private readonly dialog;
    private readonly content;
    private readonly caption;
    private readonly original;
    private readonly previous;
    private readonly next;
    private current;
    constructor(options?: JDLightboxOptions);
    /** Remove the lightbox and its event listener. */
    destroy(): void;
    private readonly onClick;
    private createNavigationButton;
    private links;
    private navigate;
    private readonly onKeyDown;
    private readonly onDialogClick;
    private readonly onClose;
    private show;
    private render;
}
