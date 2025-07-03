export type Theme = 'light' | 'dark' | 'very-dark';


export interface ThemeClasses {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  hover: string;
  hoverSecondary: string;
}


export const getThemeClasses = (theme: Theme): ThemeClasses => {
  switch (theme) {
    case 'very-dark':
      return {
        bg: 'bg-black',
        bgSecondary: 'bg-gray-950',
        bgTertiary: 'bg-gray-900',
        border: 'border-gray-800',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-500',
        hover: 'hover:bg-gray-900',
        hoverSecondary: 'hover:bg-gray-800'
      };
    case 'dark':
      return {
        bg: 'bg-gray-900',
        bgSecondary: 'bg-gray-800',
        bgTertiary: 'bg-gray-700',
        border: 'border-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-200',
        textMuted: 'text-gray-400',
        hover: 'hover:bg-gray-800',
        hoverSecondary: 'hover:bg-gray-700'
      };
    default: // light
      return {
        bg: 'bg-gray-50',
        bgSecondary: 'bg-white',
        bgTertiary: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        hover: 'hover:bg-gray-50',
        hoverSecondary: 'hover:bg-gray-100'
      };
  }
};

