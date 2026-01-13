
export interface Theme {
    id: string;
    name: string;
    values: Record<string, string>;
}

export const themes: Theme[] = [
    {
        id: 'default',
        name: 'n8n Default',
        values: {
            '--chat--header--background': '#101330',
            '--chat--color--primary': '#e74266',
            '--chat--message--user--background': '#e74266',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#101330',
            '--chat--welcome-pill-icon-hover-color': '#e74266',
            '--chat--toggle--background': '#e74266',
            '--chat--toggle--hover--background': '#db4061',
            '--chat--input--send--background': '#e74266',
            '--chat--border-radius': '0.25rem',
        },
    },

    {
        id: 'forest',
        name: 'Forest',
        values: {
            '--chat--header--background': '#1b5e20',
            '--chat--color--primary': '#2e7d32',
            '--chat--color-light': '#e8f5e9',
            '--chat--message--user--background': '#2e7d32',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#1b5e20',
            '--chat--welcome-pill-icon-hover-color': '#2e7d32',
            '--chat--toggle--background': '#2e7d32',
            '--chat--toggle--hover--background': '#1b5e20',
            '--chat--input--send--background': '#2e7d32',
            '--chat--border-radius': '0.75rem',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean',
        values: {
            '--chat--header--background': '#01579b',
            '--chat--color--primary': '#0277bd',
            '--chat--color-light': '#e1f5fe',
            '--chat--message--user--background': '#0277bd',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#01579b',
            '--chat--welcome-pill-icon-hover-color': '#0277bd',
            '--chat--toggle--background': '#0277bd',
            '--chat--toggle--hover--background': '#01579b',
            '--chat--input--send--background': '#0277bd',
            '--chat--border-radius': '0.5rem',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset',
        values: {
            '--chat--header--background': '#e65100',
            '--chat--color--primary': '#ef6c00',
            '--chat--color-light': '#fff3e0',
            '--chat--message--user--background': '#ef6c00',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#e65100',
            '--chat--welcome-pill-icon-hover-color': '#ef6c00',
            '--chat--toggle--background': '#ef6c00',
            '--chat--toggle--hover--background': '#e65100',
            '--chat--input--send--background': '#ef6c00',
            '--chat--border-radius': '1rem',
        },
    },
    {
        id: 'amethyst',
        name: 'Amethyst',
        values: {
            '--chat--header--background': '#4a148c',
            '--chat--color--primary': '#9b59b6',
            '--chat--color-light': '#f3e5f5',
            '--chat--message--user--background': '#9b59b6',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#4a148c',
            '--chat--welcome-pill-icon-hover-color': '#9b59b6',
            '--chat--toggle--background': '#9b59b6',
            '--chat--toggle--hover--background': '#8e44ad',
            '--chat--input--send--background': '#9b59b6',
            '--chat--border-radius': '0.75rem',
        },
    },
    {
        id: 'black',
        name: 'Midnight',
        values: {
            '--chat--header--background': '#000000',
            '--chat--color--primary': '#000000',
            '--chat--color-light': '#fafafa',
            '--chat--message--user--background': '#000000',
            '--chat--message--user--color': '#ffffff',
            '--chat--welcome-pill-icon-color': '#000000',
            '--chat--welcome-pill-icon-hover-color': '#404040',
            '--chat--toggle--background': '#000000',
            '--chat--toggle--hover--background': '#333333',
            '--chat--input--send--background': '#000000',
            '--chat--border-radius': '0.5rem',
        },
    }
];
