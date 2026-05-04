"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import {
  FiUser,
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
import { registerSchema, type RegisterSchemaType } from "@/validations/registerSchema";
import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "tr";
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = registerSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const response = await axios.post(
        `${backendUrl}/api/identity/auth/register`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userName: data.userName || data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      );

      const body = response.data;

      if (body?.isSuccess) {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          router.push(`/${lang}/login`);
        } else {
          router.push(`/${lang}`);
          router.refresh();
        }
      } else {
        setError(body?.message || body?.errors?.[0] || t("auth.genericError"));
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0];
      if (err?.response?.status === 400) {
        setError(msg || t("auth.emailAlreadyUsed"));
      } else {
        setError(t("auth.genericError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandIcon}>
            <FiShoppingBag size={36} />
          </div>
          <h1 className={styles.brandSlogan}>
            {lang === "tr" ? "Hemen Üye Ol" : "Create Account"}
          </h1>
          <p className={styles.brandDesc}>
            {lang === "tr"
              ? "Binlerce ürüne anında erişim. Üyeliğin ücretsiz!"
              : "Instant access to thousands of products. Free membership!"}
          </p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><FiTruck size={18} /></div>
              <span>{lang === "tr" ? "Hızlı ve güvenli teslimat" : "Fast and secure delivery"}</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><FiShield size={18} /></div>
              <span>{lang === "tr" ? "Güvenli ödeme seçenekleri" : "Secure payment options"}</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}><FiPercent size={18} /></div>
              <span>{lang === "tr" ? "Özel kampanya ve indirimler" : "Exclusive deals and discounts"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {lang === "tr" ? "Hesap Oluştur" : "Create Account"}
            </h2>
            <p className={styles.subtitle}>
              {lang === "tr"
                ? "Bilgilerinizi girerek ücretsiz hesap oluşturun"
                : "Enter your details to create a free account"}
            </p>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && (
                <div className={styles.generalError}>
                  <FiAlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Ad / Soyad */}
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{t("auth.firstName")}</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><FiUser size={16} /></span>
                    <input
                      {...register("firstName")}
                      type="text"
                      placeholder={t("auth.firstNamePlaceholder")}
                      className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                    />
                  </div>
                  {errors.firstName && <p className={styles.errorText}>{errors.firstName.message}</p>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>{t("auth.lastName")}</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputIcon}><FiUser size={16} /></span>
                    <input
                      {...register("lastName")}
                      type="text"
                      placeholder={t("auth.lastNamePlaceholder")}
                      className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                    />
                  </div>
                  {errors.lastName && <p className={styles.errorText}>{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t("auth.email")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><FiMail size={16} /></span>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  />
                </div>
                {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
              </div>

              {/* Kullanıcı Adı */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t("auth.userName")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><FiUser size={16} /></span>
                  <input
                    {...register("userName")}
                    type="text"
                    placeholder={t("auth.userNamePlaceholder")}
                    className={`${styles.input} ${errors.userName ? styles.inputError : ""}`}
                  />
                </div>
                {errors.userName && <p className={styles.errorText}>{errors.userName.message}</p>}
              </div>

              {/* Şifre */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t("auth.password")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><FiLock size={16} /></span>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
              </div>

              {/* Şifre Tekrar */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>{t("auth.confirmPassword")}</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}><FiLock size={16} /></span>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    {lang === "tr" ? "Kayıt yapılıyor..." : "Registering..."}
                  </>
                ) : (
                  t("auth.register")
                )}
              </button>
            </form>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              {lang === "tr" ? "Zaten hesabın var mı?" : "Already have an account?"}{" "}
              <Link href={`/${lang}/login`} className={styles.loginLink}>
                {t("auth.login")}
              </Link>
            </p>
            <div className={styles.secureNote}>
              <FiShield size={14} />
              <span>{t("auth.secureLoginDesc")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
