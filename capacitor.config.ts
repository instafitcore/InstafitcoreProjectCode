import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.instafitcore.app1',
  appName: 'InstaFitCore',
  webDir: 'out',

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