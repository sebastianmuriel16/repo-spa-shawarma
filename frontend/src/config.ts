declare global {
  interface ImportMetaEnv {
    readonly VITE_API_HOST: string;
  }
}

export const { VITE_API_HOST: API_HOST } = import.meta.env;
