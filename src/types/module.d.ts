declare module "packages/ui" {
  import * as React from "react";
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
  }
  export const Modal: React.FC<ModalProps>;

  export interface EmptyStateProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    bullets?: React.ReactNode[];
    className?: string;
  }
  export const EmptyState: React.FC<EmptyStateProps>;
}

declare module "components/ui" {
  export * from "packages/ui";
}
