interface JDLightboxOptions {
    /** Selector for links that should open in the lightbox. */
    selector?: string;
}
declare class JDLightbox {
    private readonly selector;
    private readonly dialog;
    private readonly content;
    private readonly caption;
    private readonly original;
    constructor(options?: JDLightboxOptions);
    /** Remove the lightbox and its event listener. */
    destroy(): void;
    private readonly onClick;
    private readonly onDialogClick;
    private readonly onClose;
    private show;
}
