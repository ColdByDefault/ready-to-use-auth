"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { ENABLED_PROVIDERS } from "@/components/auth/providers";
import { SignUpFormUI } from "./sign-up-form";
import type {
  SignUpFormValues,
  SignUpFieldErrors,
  AuthError,
  SocialProvider,
  AuthCallbackConfig,
} from "@/types/auth";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

const DEFAULT_VALUES: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// ---------------------------------------------------------------------------
// Props — all configuration is passed in; no hard-coded paths
// ---------------------------------------------------------------------------

interface SignUpLogicProps {
  /** Overrides for redirect behaviour. Defaults to /dashboard on success. */
  callbackConfig?: Partial<AuthCallbackConfig>;
  /**
   * Override the enabled provider list at the call-site.
   * Defaults to the ENABLED_PROVIDERS from providers.ts.
   */
  providerOverrides?: Partial<
    Record<SocialProvider, { enabled?: boolean; label?: string }>
  >;
}

// ---------------------------------------------------------------------------
// Controller — zero UI, all logic
// ---------------------------------------------------------------------------

export function SignUpLogic({
  callbackConfig,
  providerOverrides,
}: SignUpLogicProps) {
  const router = useRouter();

  const [values, setValues] = React.useState<SignUpFormValues>(DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = React.useState<SignUpFieldErrors>({});
  const [authError, setAuthError] = React.useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoadingProvider, setSocialLoadingProvider] =
    React.useState<SocialProvider | null>(null);

  const successURL = callbackConfig?.callbackURL ?? "/dashboard";
  const errorURL = callbackConfig?.errorCallbackURL ?? "/sign-up";

  // Merge provider overrides into the default list
  const providers = React.useMemo(() => {
    if (!providerOverrides) return ENABLED_PROVIDERS;
    return ENABLED_PROVIDERS.map((p) => {
      const override = providerOverrides[p.id];
      if (!override) return p;
      return {
        ...p,
        enabled: override.enabled ?? p.enabled,
        label: override.label ?? p.label,
      };
    });
  }, [providerOverrides]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function handleFieldChange(
    field: keyof SignUpFormValues,
    value: string,
  ): void {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the field-level error as the user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (authError) setAuthError(null);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setAuthError(null);

    const result = signUpSchema.safeParse(values);
    if (!result.success) {
      const errors: SignUpFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SignUpFormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        callbackURL: successURL,
      });

      if (error) {
        setAuthError({
          message: error.message ?? "Sign-up failed. Please try again.",
          code: error.code,
        });
        return;
      }

      router.push(successURL);
    } catch {
      setAuthError({
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialSignIn(provider: SocialProvider): Promise<void> {
    setAuthError(null);
    setSocialLoadingProvider(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: successURL,
        errorCallbackURL: errorURL,
        newUserCallbackURL: callbackConfig?.newUserCallbackURL ?? successURL,
      });
      // better-auth handles the redirect — no explicit push needed
    } catch {
      setAuthError({
        message: `Could not sign up with ${provider}. Please try again.`,
      });
      setSocialLoadingProvider(null);
    }
  }

  // -------------------------------------------------------------------------
  // Render — delegates 100% of UI to SignUpFormUI
  // -------------------------------------------------------------------------

  return (
    <SignUpFormUI
      values={values}
      fieldErrors={fieldErrors}
      authError={authError}
      isLoading={isLoading}
      providers={providers}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      onSocialSignIn={handleSocialSignIn}
      socialLoadingProvider={socialLoadingProvider}
    />
  );
}
