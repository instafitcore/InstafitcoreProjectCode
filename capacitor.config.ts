import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.instafitcore.app1', // ✅ new unique package
  appName: 'InstaFitCore',
  webDir: 'out',
  bundledWebRuntime: false,

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