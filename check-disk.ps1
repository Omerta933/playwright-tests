$items = @(
    @{ Name="User Temp ($env:TEMP)";       Path=$env:TEMP },
    @{ Name="Windows Temp (C:\Windows\Temp)"; Path="C:\Windows\Temp" },
    @{ Name="npm cache";                   Path="C:\Users\16462\AppData\Local\npm-cache" },
    @{ Name="MS Playwright cache";         Path="C:\Users\16462\AppData\Local\ms-playwright" },
    @{ Name="Windows SoftwareDistribution Download"; Path="C:\Windows\SoftwareDistribution\Download" }
)

foreach ($item in $items) {
    if (Test-Path $item.Path) {
        $size = (Get-ChildItem $item.Path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $mb = [math]::Round($size / 1MB, 0)
        Write-Host "$($item.Name): ${mb} MB"
    } else {
        Write-Host "$($item.Name): (not found)"
    }
}
