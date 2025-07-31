declare global {
  interface Window {
    triggerScreenshot?: () => void
    screenshotCallback?: (imageData: string) => void
  }
}

export {} 