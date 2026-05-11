"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiPercent,
  FiAlertCircle,
} from "react-icons/fi";

import { useTranslation } from "@/providers/TranslationProvider";
import { loginSchema, type LoginSchemaType } from "@/validations/loginSchema";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = loginSchema(t);

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("auth.invalidCredentials"));
      } else {
        router.push(`/${lang}`);
        router.refresh();
      }
    } catch {
      setError(t("auth.genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Left Panel - Branding */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandIcon}>
            <FiShoppingBag size={36} />
          </div>
          <h1 className={styles.brandSlogan}>
            {t("auth.brandSlogan")}
          </h1>
          <p className={styles.brandDesc}>{t("auth.brandDesc")}</p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FiTruck size={18} />
              </div>
              <span>
                {lang === "tr"
                  ? "Hızlı ve güvenli teslimat"
                  : "Fast and secure delivery"}
              </span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FiShield size={18} />
              </div>
              <span>
                {lang === "tr"
                  ? "Güvenli ödeme seçenekleri"
                  : "Secure payment options"}
              </span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FiPercent size={18} />
              </div>
              <span>
                {lang === "tr"
                  ? "Özel kampanya ve indirimler"
                  : "Exclusive deals and discounts"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>{t("auth.welcomeBack")}</h2>
            <p className={styles.subtitle}>
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className={styles.generalError}>
                  <FiAlertCircle size={18} className={styles.errorIcon} />
                  <span className={styles.generalErrorText}>{error}</span>
                </div>
              )}

              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState: { error: fieldError } }) => (
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      {t("auth.email")}
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <FiMail size={18} />
                      </span>
                      <input
                        {...field}
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        className={`${styles.input} ${fieldError ? styles.inputError : ""}`}
                      />
                    </div>
                    {fieldError && (
                      <p className={styles.errorText}>
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState: { error: fieldError } }) => (
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      {t("auth.password")}
                    </label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <FiLock size={18} />
                      </span>
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.passwordPlaceholder")}
                        className={`${styles.input} ${fieldError ? styles.inputError : ""}`}
                      />
                      <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    {fieldError && (
                      <p className={styles.errorText}>
                        {fieldError.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Options Row */}
              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span className={styles.rememberLabel}>
                    {t("auth.rememberMe")}
                  </span>
                </label>
                <a href="#" className={styles.forgotLink}>
                  {t("auth.forgotPassword")}
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    {t("auth.loggingIn")}
                  </>
                ) : (
                  t("auth.login")
                )}
              </button>

              {/* Divider */}
              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>
                  {t("auth.orContinueWith")}
                </span>
                <span className={styles.dividerLine} />
              </div>

              {/* Test Accounts */}
              <div className={styles.testAccountsBox}>
                <p className={styles.testAccountsTitle}>
                  {t("auth.testAccounts")}
                </p>
                <p className={styles.testAccountText}>
                  {t("auth.adminAccount")}
                </p>
                <p className={styles.testAccountText}>
                  {t("auth.userAccount")}
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              {t("auth.noAccount")}
              <Link
                href={`/${lang}/register`}
                className={styles.registerLink}
              >
                {t("auth.register")}
              </Link>
            </p>
            <div className={styles.secureNote}>
              <FiShield size={14} className={styles.secureIcon} />
              <span className={styles.secureText}>
                {t("auth.secureLoginDesc")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
