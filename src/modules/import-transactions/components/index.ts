// ---------------------------------------------------------------------------
// Components barrel — public API for the import-transactions UI.
// ---------------------------------------------------------------------------

// root orchestrator
export { default as ImportFlow } from "./ImportFlow";

// dropzone (file selection + provider picker)
export { UploadDropzone, ProviderSelect, type DropzonePhase } from "./dropzone";

// preview (pre-import previews)
export { TransactionPreview, DemoPreview } from "./preview";

// flow (multi-step progress)
export { StepIndicator, type ImportStep } from "./flow";

// shared (animation wrapper)
export { AnimatedSection } from "./shared";
