# This script adds a helper function to extract detailed error messages from error objects
# and updates the error handling in the quranAudioPlayer.ts file

$filePath = "D:\next.js Quran Learn\src\utils\quranAudioPlayer.ts"

# Read the file
$content = Get-Content -Path $filePath -Raw

# Add the helper function before the calculateGlobalAyahNumber method
$helperFunction = @"
  /**
   * Helper function to get detailed error message from various error types
   * @param error Any error object that might come from audio events
   * @returns A formatted error message
   */
  private getDetailedErrorMessage(error: any): string {
    if (!error) return 'Unknown error';
    
    // Handle MediaError objects specifically
    if (error instanceof MediaError) {
      const mediaErrorCodes = {
        1: 'MEDIA_ERR_ABORTED: The user aborted the download',
        2: 'MEDIA_ERR_NETWORK: A network error occurred while loading the audio',
        3: 'MEDIA_ERR_DECODE: The audio could not be decoded',
        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED: The audio format is not supported'
      };
      return mediaErrorCodes[error.code] || `Media Error (code ${error.code})`;
    }
    
    // Handle error objects with message property
    if (typeof error.message === 'string') {
      return error.message;
    }
    
    // Handle error objects with code property
    if (error.code) {
      return `Error code: ${error.code}`;
    }
    
    // Handle plain strings
    if (typeof error === 'string') {
      return error;
    }
    
    // Last resort: convert to string
    return String(error);
  }
  
"@

# Find the position to insert the helper function (before calculateGlobalAyahNumber)
$insertPosition = $content.IndexOf("  /**\n   * Calculate the global ayah number")
if ($insertPosition -gt 0) {
    $updatedContent = $content.Substring(0, $insertPosition) + $helperFunction + $content.Substring($insertPosition)
    
    # Now update error handler instances
    $updatedContent = $updatedContent -replace "console.error\(`"Failed to load audio:`", error\.message\);", "console.error(`"Failed to load audio: `" + this.getDetailedErrorMessage(error));"
    
    # Save the changes
    Set-Content -Path $filePath -Value $updatedContent
    
    Write-Host "Successfully updated error handling in quranAudioPlayer.ts"
} else {
    Write-Host "Could not find insertion point in the file. No changes made."
}