"use client";

import {
  CheckCircle2,
  Save,
  Settings,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import ImageUploadField from "@/components/admin/ImageUploadField";

import {
  AdminSettings,
  getAdminSettings,
  updateAdminSettings,
} from "@/lib/api/admin-settings.api";

import {
  getApiErrorMessage,
} from "@/lib/api/client";

export default function AdminSettingsPage() {
  const [
    settings,
    setSettings,
  ] =
    useState<AdminSettings | null>(
      null,
    );

  const [
    storeName,
    setStoreName,
  ] =
    useState("");

  const [
    supportEmail,
    setSupportEmail,
  ] =
    useState("");

  const [
    currency,
    setCurrency,
  ] =
    useState<
      | "NPR"
      | "USD"
      | "INR"
    >("NPR");

  const [
    logoImage,
    setLogoImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    faviconImage,
    setFaviconImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    heroImage,
    setHeroImage,
  ] =
    useState<File | null>(
      null,
    );

  const [
    removeLogo,
    setRemoveLogo,
  ] =
    useState(false);

  const [
    removeFavicon,
    setRemoveFavicon,
  ] =
    useState(false);

  const [
    removeHeroImage,
    setRemoveHeroImage,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const result =
          await getAdminSettings();

        setSettings(
          result,
        );

        setStoreName(
          result.storeName,
        );

        setSupportEmail(
          result.supportEmail,
        );

        setCurrency(
          result.currency,
        );
      } catch (loadError) {
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load settings.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const result =
        await updateAdminSettings({
          storeName:
            storeName.trim(),

          supportEmail:
            supportEmail
              .trim()
              .toLowerCase(),

          currency,

          logoImage,
          faviconImage,
          heroImage,

          removeLogo,
          removeFavicon,
          removeHeroImage,
        });

      setSettings(
        result,
      );

      setLogoImage(
        null,
      );

      setFaviconImage(
        null,
      );

      setHeroImage(
        null,
      );

      setRemoveLogo(
        false,
      );

      setRemoveFavicon(
        false,
      );

      setRemoveHeroImage(
        false,
      );

      setSuccess(
        "Settings updated successfully.",
      );
    } catch (saveError) {
      setError(
        getApiErrorMessage(
          saveError,
          "Unable to update settings.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#11141c] p-12 text-center text-white/45">
        Loading settings...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-red-500">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-black md:text-4xl">
        Platform Settings
      </h1>

      <p className="mt-2 text-white/45">
        Update CineTix branding,
        support information and
        currency.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
          <CheckCircle2
            size={19}
          />

          {success}
        </div>
      )}

      <form
        onSubmit={(event) => {
          void handleSubmit(
            event,
          );
        }}
        className="mt-8 space-y-7"
      >
        <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
          <div className="flex items-center gap-3">
            <Settings
              size={21}
              className="text-red-400"
            />

            <h2 className="text-xl font-black">
              General details
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm text-white/65">
                Platform name
              </span>

              <input
                required
                value={
                  storeName
                }
                onChange={(event) =>
                  setStoreName(
                    event.target.value,
                  )
                }
                className={
                  inputClass
                }
              />
            </label>

            <label>
              <span className="text-sm text-white/65">
                Support email
              </span>

              <input
                required
                type="email"
                value={
                  supportEmail
                }
                onChange={(event) =>
                  setSupportEmail(
                    event.target.value,
                  )
                }
                className={
                  inputClass
                }
              />
            </label>

            <label>
              <span className="text-sm text-white/65">
                Currency
              </span>

              <select
                value={
                  currency
                }
                onChange={(event) =>
                  setCurrency(
                    event.target
                      .value as
                      | "NPR"
                      | "USD"
                      | "INR",
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="NPR">
                  NPR
                </option>

                <option value="USD">
                  USD
                </option>

                <option value="INR">
                  INR
                </option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#11141c] p-6">
          <h2 className="text-xl font-black">
            Branding images
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Upload branding files
            directly from your computer.
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ImageUploadField
              label="Platform logo"
              currentUrl={
                settings?.logoUrl
              }
              file={
                logoImage
              }
              removed={
                removeLogo
              }
              aspect="banner"
              onFileChange={(
                file,
              ) => {
                setLogoImage(
                  file,
                );

                setRemoveLogo(
                  false,
                );
              }}
              onRemove={() => {
                setLogoImage(
                  null,
                );

                setRemoveLogo(
                  true,
                );
              }}
            />

            <ImageUploadField
              label="Favicon"
              currentUrl={
                settings?.faviconUrl
              }
              file={
                faviconImage
              }
              removed={
                removeFavicon
              }
              aspect="square"
              onFileChange={(
                file,
              ) => {
                setFaviconImage(
                  file,
                );

                setRemoveFavicon(
                  false,
                );
              }}
              onRemove={() => {
                setFaviconImage(
                  null,
                );

                setRemoveFavicon(
                  true,
                );
              }}
            />

            <div className="lg:col-span-2">
              <ImageUploadField
                label="Homepage hero image"
                currentUrl={
                  settings?.heroImageUrl
                }
                file={
                  heroImage
                }
                removed={
                  removeHeroImage
                }
                maximumSizeMb={8}
                aspect="banner"
                onFileChange={(
                  file,
                ) => {
                  setHeroImage(
                    file,
                  );

                  setRemoveHeroImage(
                    false,
                  );
                }}
                onRemove={() => {
                  setHeroImage(
                    null,
                  );

                  setRemoveHeroImage(
                    true,
                  );
                }}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              saving
            }
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-red-600 px-6 font-bold hover:bg-red-500 disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}