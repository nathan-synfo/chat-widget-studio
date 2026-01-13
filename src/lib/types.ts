
export interface LogoValues {
    headerLogo: string | null;
    toggleIcon: string | null;
    botAvatar: string | null;
}

export interface HeaderContent {
    title: string;
    subtitle: string;
}

export interface Pill {
    id: string;
    label: string;
    message: string;
}

export interface WelcomeConfig {
    enabled: boolean;
    title: string;
    subtitle: string;
    pills: Pill[];
}

export interface ChatConfig {
    webhookUrl: string;
}
