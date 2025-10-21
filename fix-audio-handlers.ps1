# Fix Audio Error Handlers

# First check the file exists
$audioPlayerPath = "d:\next.js Quran Learn\src\utils\quranAudioPlayer.ts"
if (!(Test-Path $audioPlayerPath)) {
    Write-Error "File not found: $audioPlayerPath"
    exit 1
}

# Read the file content
$content = Get-Content $audioPlayerPath -Raw

# Replace first error handler
$pattern1 = '        const handleError = \(e\) => \{
          this\.audioElement\?\.removeEventListener\(''error'', handleError\);
          reject\(new Error\(`Failed to load audio: \${e\.message}`\)\);
        \};'
$replacement1 = '        const handleError = (e: Event) => {
          this.audioElement?.removeEventListener(''error'', handleError);
          const errorMessage = this.getDetailedErrorMessage(e);
          reject(new Error(`Failed to load audio: ${errorMessage}`));
        };'
$content = $content -replace $pattern1, $replacement1

# Replace second error handler
$pattern2 = $pattern1 # Same pattern, will find the second occurrence
$replacement2 = $replacement1 # Same replacement
$content = $content -replace $pattern2, $replacement2

# Write the modified content back to the file
$content | Out-File $audioPlayerPath -Encoding utf8
Write-Host "Error handlers updated successfully"