# UnusAnnusRenamer
Renames the episode structure (001.mp4, 002.mp4) to have the actual video names.

### Help
```
--help: Shows this message
--location: Sets the location, usage: --location <folder>
--season: Sets the season you wanna rename, usage: --season <season (0 or 1)>
--metadata: Sets the location of the metadata file, ending in .json (if it doesn't exist, it will download it to that location), usage: --metadata <filename>

Example command: <executable> --location ./01 --season 1 --metadata ./metadata.json
```

### Command Example

If I have a folder with the binary along with all of season 0, then I can execute the following command and it will rename them:
```bat
:: Windows (CMD)
cd "<folderdir>\"
unusannus-renamer-win.exe --location .\ --season 0 --metadata .\metadata.json
```
```powershell
# Windows (PowerShell)
cd "<folderdir>\"
.\unusannus-renamer-win.exe --location .\ --season 0 --metadata .\metadata.json
```
```bash
# Linux
cd "<folderdir>/"
./unusannus-renamer-linux --location ./ --season 0 --metadata ./metadata.json

# macOS
cd "<folderdir>/"
./unusannus-renamer-macos --location ./ --season --metadata ./metadata.json
```
