import * as React from "react";
import Link from "next/link";
import { Loader2, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type {
  SignInFormProps,
  ProviderConfig,
  SocialProvider,
} from "@/types/auth";

// ---------------------------------------------------------------------------
// Sub-components — purely presentational, zero side effects
//
// OPTIMIZE: `FormField` and `ProviderButton` are defined in this file for
// co-location convenience. If you reuse them in sign-up or other forms,
// extract them to e.g. `components/auth/shared/form-field.tsx` and
// `components/auth/shared/provider-button.tsx`.
// ---------------------------------------------------------------------------

interface FieldProps {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  error?: string | undefined;
  disabled?: boolean;
  autoComplete?: string;
  rightSlot?: React.ReactNode;
  onChange: (value: string) => void;
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  disabled,
  autoComplete,
  rightSlot,
  onChange,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {rightSlot}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        suppressHydrationWarning
      />
      {error && (
        <p id={`${id}-error`} className="text-destructive text-xs leading-snug">
          {error}
        </p>
      )}
    </div>
  );
}

interface ProviderButtonProps {
  provider: ProviderConfig;
  isLoading: boolean;
  disabled: boolean;
  onPress: (id: SocialProvider) => void;
}

function ProviderButton({
  provider,
  isLoading,
  disabled,
  onPress,
}: ProviderButtonProps) {
  const Icon = provider.icon;
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      disabled={disabled}
      onClick={() => onPress(provider.id)}
      aria-label={`Sign in with ${provider.label}`}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Icon style={{ color: provider.brandColor }} className="size-4" />
      )}
      <span className="text-sm font-medium">{provider.label}</span>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Main sign-in form — pure UI, receives everything via props
// ---------------------------------------------------------------------------

export function SignInFormUI({
  values,
  fieldErrors,
  authError,
  isLoading,
  providers,
  onFieldChange,
  onSubmit,
  onSocialSignIn,
  socialLoadingProvider,
}: SignInFormProps) {
  // OPTIMIZE: Wrap these in `useMemo` if the providers array is large or the
  // parent re-renders frequently, to avoid recomputing on every render.
  const enabledProviders = providers.filter((p) => p.enabled);
  const isAnyLoading = isLoading || socialLoadingProvider !== null;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header */}
      {/* OPTIMIZE: "Welcome back" and the subtitle are hardcoded. Accept a
          `labels` prop (e.g. `labels.title`, `labels.subtitle`) so consumers
          can customise copy without editing this file. */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to your account to continue
        </p>
      </div>

      {/* Global auth error */}
      {authError && (
        <Alert variant="destructive" role="alert">
          <TriangleAlert className="size-4" />
          <AlertDescription>{authError.message}</AlertDescription>
        </Alert>
      )}

      {/* Email / password form */}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          error={fieldErrors.email}
          disabled={isAnyLoading}
          autoComplete="email"
          onChange={(v) => onFieldChange("email", v)}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          value={values.password}
          error={fieldErrors.password}
          disabled={isAnyLoading}
          autoComplete="current-password"
          rightSlot={
            // OPTIMIZE: `/forgot-password` is hardcoded. Accept a
            // `forgotPasswordHref` prop (or include it in `labels`) so you
            // can change the route without touching this file.
            <Link
              href="/forgot-password"
              tabIndex={0}
              className="text-muted-foreground text-xs underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Forgot password?
            </Link>
          }
          onChange={(v) => onFieldChange("password", v)}
        />

        {/* Remember me */}
        {/* OPTIMIZE: "Remember me for 30 days" is hardcoded. Pass it through
            `labels.rememberMe` if you need white-label or i18n support. */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={values.rememberMe}
            disabled={isAnyLoading}
            onCheckedChange={(checked) =>
              onFieldChange("rememberMe", checked === true)
            }
          />
          <Label
            htmlFor="rememberMe"
            className="cursor-pointer text-sm font-normal"
          >
            Remember me for 30 days
          </Label>
        </div>

        <Button
          type="submit"
          className="mt-1 w-full"
          disabled={isAnyLoading}
          aria-busy={isLoading}
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {/* OPTIMIZE: Button labels are hardcoded. Accept `labels.submitIdle`
              and `labels.submitLoading` props to support i18n or rebranding. */}
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      {enabledProviders.length > 0 && (
        <>
          {/* OPTIMIZE: "Or continue with" is hardcoded. Move it to a
              `labels.divider` prop for i18n / custom copy. */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              Or continue with
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Provider grid: 2 cols on ≥2 providers, 1 col otherwise */}
          {/* OPTIMIZE: The 2-column threshold is hardcoded. Accept a
              `providerGridCols` prop (1 | 2) to let consumers control layout
              regardless of how many providers are enabled. */}
          <div
            className={cn(
              "grid gap-2",
              enabledProviders.length >= 2 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {enabledProviders.map((provider) => (
              <ProviderButton
                key={provider.id}
                provider={provider}
                isLoading={socialLoadingProvider === provider.id}
                disabled={isAnyLoading}
                onPress={onSocialSignIn}
              />
            ))}
          </div>
        </>
      )}

      {/* Sign-up link */}
      {/* OPTIMIZE: The sign-up href `/sign-up` and surrounding copy are
          hardcoded. Accept a `signUpHref` prop and include the text in
          `labels` so this component can be dropped into any route structure. */}
      <p className="text-muted-foreground text-center text-sm leading-relaxed">
        {"Don't have an account? "}
        <Link
          href="/sign-up"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
