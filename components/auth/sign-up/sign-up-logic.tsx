"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ExternalLink, FlaskConical } from "lucide-react";

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
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
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
  /** Extra Tailwind classes forwarded to the outermost wrapper div of the form. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Controller — zero UI, all logic
// ---------------------------------------------------------------------------

export function SignUpLogic({
  callbackConfig,
  providerOverrides,
  className,
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
  // Demo / showcase mode — registration is disabled.
  // -------------------------------------------------------------------------
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return (
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-balance text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Enter your details below to get started
          </p>
        </div>

        {/* Showcase notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950">
          <div className="flex items-start gap-3">
            <FlaskConical className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-200">
                This is a live showcase
              </p>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                Creating new accounts is disabled here. This deployment exists
                only to demonstrate what the project looks like in action.
              </p>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                To get your own fully working instance, clone the repository,
                connect a PostgreSQL database, and configure your environment
                variables.
              </p>
              <a
                href="https://github.com/ColdByDefault/ready-to-use-auth"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-medium underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Back to sign-in */}
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign in with demo credentials
          </Link>
        </p>
      </div>
    );
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
      {...(className !== undefined && { className })}
    />
  );
}
