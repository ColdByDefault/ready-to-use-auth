import type * as React from "react";

// ---------------------------------------------------------------------------
// Shared icon prop interface — compatible with react-icons IconType and custom
// SVG components alike, without coupling to react-icons internals.
// ---------------------------------------------------------------------------

export interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}

export type AuthIconComponent = React.ComponentType<IconProps>;

// ---------------------------------------------------------------------------
// Provider types
// ---------------------------------------------------------------------------

export type SocialProvider =
  | "google"
  | "github"
  | "discord"
  | "twitter"
  | "microsoft"
  | "facebook"
  | "apple"
  | "twitch"
  | "spotify"
  | "linkedin";

export interface ProviderConfig {
  id: SocialProvider;
  label: string;
  icon: AuthIconComponent;
  brandColor: string;
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// Form value types
// ---------------------------------------------------------------------------

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export interface AuthError {
  message: string;
  code?: string | undefined;
}

// ---------------------------------------------------------------------------
// Callback configuration
// ---------------------------------------------------------------------------

export interface AuthCallbackConfig {
  callbackURL: string;
  errorCallbackURL: string;
  newUserCallbackURL?: string;
}

// ---------------------------------------------------------------------------
// Field-level error maps
// ---------------------------------------------------------------------------

export type SignUpFieldErrors = Partial<
  Record<keyof SignUpFormValues, string | undefined>
>;

export type SignInFieldErrors = Partial<
  Record<keyof SignInFormValues, string | undefined>
>;

// ---------------------------------------------------------------------------
// Pure UI prop interfaces — no logic, only data + callbacks
// ---------------------------------------------------------------------------

export interface SignUpFormProps {
  values: SignUpFormValues;
  fieldErrors: SignUpFieldErrors;
  authError: AuthError | null;
  isLoading: boolean;
  providers: ProviderConfig[];
  onFieldChange: (field: keyof SignUpFormValues, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSocialSignIn: (provider: SocialProvider) => void;
  socialLoadingProvider: SocialProvider | null;
}

export interface SignInFormProps {
  values: SignInFormValues;
  fieldErrors: SignInFieldErrors;
  authError: AuthError | null;
  isLoading: boolean;
  providers: ProviderConfig[];
  onFieldChange: (
    field: keyof SignInFormValues,
    value: string | boolean,
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSocialSignIn: (provider: SocialProvider) => void;
  socialLoadingProvider: SocialProvider | null;
}
