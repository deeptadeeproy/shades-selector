declare module 'vue-swatches' {
  import { DefineComponent } from 'vue';
  
  export interface SwatchesProps {
    value?: string;
    colors?: string[];
    shapes?: 'circles' | 'squares';
    spacing?: 'small' | 'medium' | 'large';
    'max-height'?: number;
    'fallback-type'?: 'input' | 'button';
    'fallback-input-type'?: 'text' | 'color';
    'fallback-input-placeholder'?: string;
    'fallback-input-class'?: string;
    'popover-to'?: 'top' | 'bottom' | 'left' | 'right';
    'show-border'?: boolean;
    'border-color'?: string;
    'background-color'?: string;
    'text-color'?: string;
  }
  
  export const Swatches: DefineComponent<SwatchesProps>;
} 