import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.instafitcore.app',
  appName: 'Instafitcore',
  webDir: 'out',
  server: {
    url: 'https://www.instafitcore.com/', 
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000", // Changed to black for fitness theme
      showSpinner: true,
      androidScaleType: "CENTER_CROP"
    }
  }
};
export default config;