"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { ENABLED_PROVIDERS } from "@/components/auth/providers";
import { SignInFormUI } from "./sign-in-form";
import type {
  SignInFormValues,
  SignInFieldErrors,
  AuthError,
  SocialProvider,
  AuthCallbackConfig,
} from "@/types/auth";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

const DEFAULT_VALUES: SignInFormValues = {
  email: "",
  password: "",
  rememberMe: true,
};

// ---------------------------------------------------------------------------
// Props — all configuration is passed in; no hard-coded paths
// ---------------------------------------------------------------------------

interface SignInLogicProps {
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

export function SignInLogic({
  callbackConfig,
  providerOverrides,
}: SignInLogicProps) {
  const router = useRouter();

  const [values, setValues] = React.useState<SignInFormValues>(DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = React.useState<SignInFieldErrors>({});
  const [authError, setAuthError] = React.useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoadingProvider, setSocialLoadingProvider] =
    React.useState<SocialProvider | null>(null);

  const successURL = callbackConfig?.callbackURL ?? "/dashboard";
  const errorURL = callbackConfig?.errorCallbackURL ?? "/sign-in";

  // In demo mode, disable all social providers (they need the database)
  const providers = React.useMemo(() => {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return [];
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
    field: keyof SignInFormValues,
    value: string | boolean,
  ): void {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field !== "rememberMe" && fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (authError) setAuthError(null);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setAuthError(null);

    const result = signInSchema.safeParse(values);
    if (!result.success) {
      const errors: SignInFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SignInFormValues;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // -----------------------------------------------------------------
      // Demo / showcase mode — call the lightweight API route instead of
      // Better Auth (no database involved).
      // -----------------------------------------------------------------
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        const res = await fetch("/api/demo-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: result.data.email,
            password: result.data.password,
          }),
        });

        if (!res.ok) {
          setAuthError({
            message: "Invalid demo credentials. Check the hint above.",
          });
          return;
        }

        router.push(successURL);
        return;
      }

      // -----------------------------------------------------------------
      // Normal mode — Better Auth
      // -----------------------------------------------------------------
      const { error } = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
        rememberMe: result.data.rememberMe,
        callbackURL: successURL,
      });

      if (error) {
        setAuthError({
          message:
            error.message ?? "Sign-in failed. Please check your credentials.",
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
      });
      // better-auth handles the redirect — no explicit push needed
    } catch {
      setAuthError({
        message: `Could not sign in with ${provider}. Please try again.`,
      });
      setSocialLoadingProvider(null);
    }
  }

  // -------------------------------------------------------------------------
  // Render — delegates 100% of UI to SignInFormUI
  // -------------------------------------------------------------------------

  return (
    <SignInFormUI
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
