import type { ComponentType } from "react";

// -------------------------------------------------------------
// SERVICE TYPE (FINAL – DO NOT MODIFY ELSEWHERE)
// -------------------------------------------------------------
export type Service = {
  title: string;
  description: string;

  /**
   * Icon component
   * Supports lucide-react AND react-icons
   */
  Icon: ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;

  slug: string;

  /**
   * Accent / brand color
   * Used for icons, highlights, CTA sync
   */
  color: string;

  /**
   * Optional image gallery
   */
  images?: string[];

  /**
   * Optional modal-only copy
   * If missing, UI falls back to description
   */
  modalContent?: string;
  
};
