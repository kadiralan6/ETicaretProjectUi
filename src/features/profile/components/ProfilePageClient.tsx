"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import nextApiClient from "@/util/nextApiClient";
import { NEXT_API_URLS } from "@/constants/nextApi";
import type { IUserProfile, IUpdateUserDto, IChangePasswordDto } from "@/interfaces/IProfile";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/validations/profileSchema";
import styles from "./ProfilePageClient.module.css";

type TabId = "profile" | "password";

/* ─────────────── Helper: Password Strength ─────────────── */

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 0, label: "Zayıf" };
  if (score <= 3) return { level: 1, label: "Orta" };
  return { level: 2, label: "Güçlü" };
}

/* ─────────────── Component ─────────────────────────────── */

export function ProfilePageClient() {
  const { status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/tr/login");
    }
  }, [status, router]);

  /* ─── Fetch Profile ─── */

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<IUserProfile>({
    queryKey: ["profile"],
    queryFn: () =>
      nextApiClient.get(NEXT_API_URLS.PROFILE).then((r) => r.data),
    enabled: status === "authenticated",
    staleTime: 60_000,
  });

  if (status === "loading" || status === "unauthenticated") {
    return <ProfileSkeleton />;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarSection}>
            {isLoading ? (
              <div className={styles.skeletonAvatar} />
            ) : (
              <div className={styles.avatar}>
                {profile
                  ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
                  : "?"}
              </div>
            )}
            {isLoading ? (
              <>
                <div className={styles.skeletonLine} style={{ width: 120 }} />
                <div className={styles.skeletonLine} style={{ width: 160 }} />
              </>
            ) : (
              <>
                <p className={styles.avatarName}>
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className={styles.avatarEmail}>{profile?.email}</p>
              </>
            )}
          </div>

          <nav className={styles.navList}>
            <button
              className={`${styles.navItem} ${activeTab === "profile" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Kişisel Bilgiler
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "password" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Şifre Değiştir
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === "profile" ? (
            <ProfileForm profile={profile} isLoading={isLoading} isError={isError} />
          ) : (
            <PasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Profile Form ──────────────────────────── */

function ProfileForm({
  profile,
  isLoading,
  isError,
}: {
  profile?: IUserProfile;
  isLoading: boolean;
  isError: boolean;
}) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhoneNumber(profile.phoneNumber || "");
      setBirthDay(
        profile.birthDay ? profile.birthDay.split("T")[0] : "",
      );
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: IUpdateUserDto) =>
      nextApiClient.put(NEXT_API_URLS.PROFILE, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil bilgileriniz başarıyla güncellendi.");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Profil güncellenemedi.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      firstName,
      lastName,
      phoneNumber,
      birthDay: birthDay || undefined,
    };

    const result = updateProfileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate({
      firstName,
      lastName,
      phoneNumber,
      birthDay: birthDay ? `${birthDay}T00:00:00` : null,
    });
  };

  const handleReset = () => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhoneNumber(profile.phoneNumber || "");
      setBirthDay(
        profile.birthDay ? profile.birthDay.split("T")[0] : "",
      );
      setErrors({});
    }
  };

  if (isError) {
    return (
      <>
        <div className={styles.contentHeader}>
          <h2 className={styles.contentTitle}>Kişisel Bilgiler</h2>
        </div>
        <div className={styles.contentBody}>
          <div className={styles.infoBanner}>
            <svg className={styles.infoBannerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className={styles.infoBannerText}>
              Profil bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Kişisel Bilgiler</h2>
        <p className={styles.contentSubtitle}>
          Hesabınıza ait kişisel bilgileri buradan güncelleyebilirsiniz.
        </p>
      </div>
      <div className={styles.contentBody}>
        {isLoading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              {/* Ad */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-firstName">
                  Ad
                </label>
                <input
                  id="profile-firstName"
                  className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adınız"
                />
                {errors.firstName && (
                  <span className={styles.errorText}>{errors.firstName}</span>
                )}
              </div>

              {/* Soyad */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-lastName">
                  Soyad
                </label>
                <input
                  id="profile-lastName"
                  className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                />
                {errors.lastName && (
                  <span className={styles.errorText}>{errors.lastName}</span>
                )}
              </div>

              {/* E-posta (readonly) */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-email">
                  E-posta
                </label>
                <input
                  id="profile-email"
                  className={`${styles.input} ${styles.inputReadonly}`}
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  disabled
                />
              </div>

              {/* Kullanıcı Adı (readonly) */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-userName">
                  Kullanıcı Adı
                </label>
                <input
                  id="profile-userName"
                  className={`${styles.input} ${styles.inputReadonly}`}
                  type="text"
                  value={profile?.userName || ""}
                  readOnly
                  disabled
                />
              </div>

              {/* Telefon */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-phone">
                  Telefon
                </label>
                <input
                  id="profile-phone"
                  className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ""}`}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+905001234567"
                />
                {errors.phoneNumber && (
                  <span className={styles.errorText}>{errors.phoneNumber}</span>
                )}
              </div>

              {/* Doğum Tarihi */}
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="profile-birthday">
                  Doğum Tarihi
                </label>
                <input
                  id="profile-birthday"
                  className={`${styles.input} ${errors.birthDay ? styles.inputError : ""}`}
                  type="date"
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                />
                {errors.birthDay && (
                  <span className={styles.errorText}>{errors.birthDay}</span>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleReset}
                disabled={mutation.isPending}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Spinner />
                    Kaydediliyor…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

/* ─────────────── Password Form ─────────────────────────── */

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);

  const mutation = useMutation({
    mutationFn: (data: IChangePasswordDto) =>
      nextApiClient
        .put(NEXT_API_URLS.PROFILE_PASSWORD, data)
        .then((r) => r.data),
    onSuccess: () => {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors({});
      toast.success("Şifreniz başarıyla değiştirildi.");
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || "Şifre değiştirilemedi.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const formData = { currentPassword, newPassword, confirmNewPassword };
    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate({ currentPassword, newPassword, confirmNewPassword });
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>Şifre Değiştir</h2>
        <p className={styles.contentSubtitle}>
          Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirmenizi
          öneririz.
        </p>
      </div>
      <div className={styles.contentBody}>
        {success && (
          <div className={styles.successBanner}>
            <svg className={styles.successBannerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className={styles.successBannerText}>
              Şifreniz başarıyla güncellendi!
            </span>
          </div>
        )}

        <div className={styles.infoBanner}>
          <svg className={styles.infoBannerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className={styles.infoBannerText}>
            Şifreniz en az 6 karakter uzunluğunda olmalı, en az bir büyük harf
            ve bir rakam içermelidir.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            {/* Mevcut Şifre */}
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label} htmlFor="pw-current">
                Mevcut Şifre
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="pw-current"
                  className={`${styles.input} ${errors.currentPassword ? styles.inputError : ""}`}
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifrenizi girin"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className={styles.errorText}>{errors.currentPassword}</span>
              )}
            </div>

            {/* Yeni Şifre */}
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label} htmlFor="pw-new">
                Yeni Şifre
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="pw-new"
                  className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifrenizi girin"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.newPassword && (
                <span className={styles.errorText}>{errors.newPassword}</span>
              )}
              {/* Strength indicator */}
              {newPassword.length > 0 && (
                <>
                  <div className={styles.strengthBar}>
                    <div
                      className={`${styles.strengthSegment} ${
                        strength.level >= 0 ? styles.strengthWeak : ""
                      } ${strength.level >= 1 ? styles.strengthMedium : ""} ${
                        strength.level >= 2 ? styles.strengthStrong : ""
                      }`}
                    />
                    <div
                      className={`${styles.strengthSegment} ${
                        strength.level >= 1 ? styles.strengthMedium : ""
                      } ${strength.level >= 2 ? styles.strengthStrong : ""}`}
                    />
                    <div
                      className={`${styles.strengthSegment} ${
                        strength.level >= 2 ? styles.strengthStrong : ""
                      }`}
                    />
                  </div>
                  <span className={styles.strengthText}>
                    Şifre gücü: {strength.label}
                  </span>
                </>
              )}
            </div>

            {/* Yeni Şifre Tekrar */}
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label} htmlFor="pw-confirm">
                Yeni Şifre (Tekrar)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="pw-confirm"
                  className={`${styles.input} ${errors.confirmNewPassword ? styles.inputError : ""}`}
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar girin"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <span className={styles.errorText}>{errors.confirmNewPassword}</span>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Spinner />
                  Değiştiriliyor…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Şifreyi Değiştir
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ─────────────── Skeleton ──────────────────────────────── */

function ProfileSkeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <aside className={styles.sidebar}>
          <div className={styles.avatarSection}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonLine} style={{ width: 120 }} />
            <div className={styles.skeletonLine} style={{ width: 160 }} />
          </div>
          <div className={styles.navList}>
            <div className={styles.skeletonLine} style={{ height: 40 }} />
            <div className={styles.skeletonLine} style={{ height: 40 }} />
          </div>
        </aside>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <div className={styles.skeletonLine} style={{ width: 200, height: 24 }} />
            <div className={styles.skeletonLine} style={{ width: 300, height: 16, marginTop: 8 }} />
          </div>
          <div className={styles.contentBody}>
            <FormSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className={styles.formGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div className={styles.formGroup} key={i}>
          <div className={styles.skeletonLine} style={{ width: 80, height: 14 }} />
          <div className={styles.skeletonInput} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Small SVG Icons ───────────────────────── */

function EyeIcon() {
  return (
    <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
