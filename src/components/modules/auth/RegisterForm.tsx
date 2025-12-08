"use client";

import { registerUser } from "@/services/auth/registerUser";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import InputFieldError from "../../shared/InputFieldError";
import { Upload, X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and WebP images are allowed");
        e.target.value = "";
        return;
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePreview(null);
    const fileInput = document.getElementById(
      "profilePicture"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Very Weak";
    if (strength === 2) return "Weak";
    if (strength === 3) return "Medium";
    if (strength === 4) return "Strong";
    return "Very Strong";
  };

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture Upload */}
          <div className="md:col-span-2">
            <Field>
              <FieldLabel htmlFor="profilePicture">Profile Picture</FieldLabel>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {profilePreview ? (
                    <>
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-300">
                        <Image
                          src={profilePreview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                          width={96}
                          height={96}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <Upload className="text-gray-400" size={32} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload size={18} className="mr-2" />
                    Upload Photo
                  </label>
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or WebP. Max 5MB. Optional.
                  </p>
                  <InputFieldError field="profilePicture" state={state} />
                </div>
              </div>
            </Field>
          </div>

          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
            />
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">
              Email <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Address */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main Street, City, Country"
            />
            <InputFieldError field="address" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">
              Password <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) =>
                  setPasswordStrength(checkPasswordStrength(e.target.value))
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordStrength > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i < passwordStrength
                          ? getStrengthColor(passwordStrength)
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${
                    passwordStrength <= 2
                      ? "text-red-600"
                      : passwordStrength === 3
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {getStrengthText(passwordStrength)}
                </p>
              </div>
            )}

            <FieldDescription className="text-sm">
              At least 8 characters with uppercase, lowercase, number, and
              special character
            </FieldDescription>
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <InputFieldError field="confirmPassword" state={state} />
          </Field>
        </div>

        <FieldGroup className="mt-8">
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-3 text-base"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="mt-6 space-y-3 text-center">
              <FieldDescription>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </a>
              </FieldDescription>

              <div className="text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;