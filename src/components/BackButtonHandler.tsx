"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function BackButtonHandler() {
  useEffect(() => {
    const setupBackButton = async () => {
      // Check if the App plugin is available
      if (App) {
        await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
      }
    };

    setupBackButton();

    return () => {
      App.removeAllListeners();
    };
  }, []);

  return null; // This component doesn't show anything
}