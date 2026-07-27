import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  SettingsModel,
} from "../models/settings.model";

import {
  createPublicUploadUrl,
  deleteUploadedFile,
  getUploadedFile,
  parseMultipartBody,
} from "../utils/media";

async function loadSettings() {
  const existing =
    await SettingsModel.findOne();

  if (existing) {
    return existing;
  }

  return SettingsModel.create(
    {},
  );
}

export async function getSettings(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const settings =
      await loadSettings();

    response.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const settings =
      await loadSettings();

    const previousLogo =
      settings.logoUrl;

    const previousFavicon =
      settings.faviconUrl;

    const previousHero =
      settings.heroImageUrl;

    const logoImage =
      getUploadedFile(
        request,
        "logoImage",
      );

    const faviconImage =
      getUploadedFile(
        request,
        "faviconImage",
      );

    const heroImage =
      getUploadedFile(
        request,
        "heroImage",
      );

    const body =
      parseMultipartBody(
        request.body,
        {
          booleanFields: [
            "removeLogo",
            "removeFavicon",
            "removeHeroImage",
          ],
        },
      );

    if (
      typeof body.storeName ===
        "string" &&
      body.storeName.trim()
    ) {
      settings.storeName =
        body.storeName.trim();
    }

    if (
      typeof body.supportEmail ===
      "string"
    ) {
      const email =
        body.supportEmail
          .trim()
          .toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email,
        )
      ) {
        response.status(400).json({
          success: false,
          message:
            "Enter a valid support email address.",
        });

        return;
      }

      settings.supportEmail =
        email;
    }

    if (
      body.currency ===
        "NPR" ||
      body.currency ===
        "USD" ||
      body.currency ===
        "INR"
    ) {
      settings.currency =
        body.currency;
    }

    if (logoImage) {
      settings.logoUrl =
        createPublicUploadUrl(
          logoImage,
        );
    } else if (
      body.removeLogo === true
    ) {
      settings.logoUrl =
        "";
    }

    if (faviconImage) {
      settings.faviconUrl =
        createPublicUploadUrl(
          faviconImage,
        );
    } else if (
      body.removeFavicon === true
    ) {
      settings.faviconUrl =
        "";
    }

    if (heroImage) {
      settings.heroImageUrl =
        createPublicUploadUrl(
          heroImage,
        );
    } else if (
      body.removeHeroImage ===
      true
    ) {
      settings.heroImageUrl =
        "";
    }

    await settings.save();

    if (
      logoImage ||
      body.removeLogo === true
    ) {
      await deleteUploadedFile(
        previousLogo,
      );
    }

    if (
      faviconImage ||
      body.removeFavicon === true
    ) {
      await deleteUploadedFile(
        previousFavicon,
      );
    }

    if (
      heroImage ||
      body.removeHeroImage ===
      true
    ) {
      await deleteUploadedFile(
        previousHero,
      );
    }

    response.status(200).json({
      success: true,
      message:
        "Settings updated successfully",

      data: settings,
    });
  } catch (error) {
    next(error);
  }
}