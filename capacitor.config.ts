import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.instafitcore.appss',
  appName: 'InstaFitCore',
  webDir: 'public',

  // ✅ IMPORTANT: Load live website (no white screen)
  server: {
    url: 'https://www.instafitcore.com',
    cleartext: true,
    androidScheme: 'https'
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#000000",
      showSpinner: true,
      androidScaleType: "CENTER_CROP"
    }
  },

  android: {
    allowMixedContent: true
  }
};

export default config;